public with sharing class RE_QuoteGenerate {
     
    @AuraEnabled
    public static void createRequest(String recordId, String userId, Decimal price){
        try{
            Quote_Community_Request__e request = new Quote_Community_Request__e();
            request.Record_Id__c = recordId;
            request.User_Id__c = userId;
            request.Price__c = price;

            Database.SaveResult sr =  EventBus.publish(request);
            if (sr.isSuccess()) {
                System.debug('Successfully published event.');
                System.debug(EventBus.getOperationId(sr));     
            } else {
                for(Database.Error err : sr.getErrors()) {
                    System.debug('Error returned: ' +
                                 err.getStatusCode() +
                                 ' - ' +
                                 err.getMessage());
                }
            }          
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }     
    }

    public void generateQuote (String recordId, String userId, Decimal price){
        try{
            Product2 product = [SELECT Id, Name, Apartment_Agent__c, Description FROM Product2 WHERE Id=:recordId];
            String id = '';
                PricebookEntry entry = [SELECT Id, UnitPrice FROM PricebookEntry WHERE UnitPrice =: price AND Product2Id =: recordId LIMIT 1];
                id=entry.Id;
        
            Opportunity newO = new Opportunity();
            newO.RecordTypeID = [SELECT Id FROM RecordType WHERE Name LIKE 'B2C' AND SobjectType = 'Opportunity'].Id;
            newO.OwnerId = product.Apartment_Agent__c;
            String accId = [SELECT AccountId FROM User WHERE Id =: userId].AccountId;
            Account acc = [SELECT RecordTypeID FROM Account WHERE Id =: accId];
            String personAcc = [SELECT Id FROM RecordType WHERE Name LIKE 'Person Acc' AND SobjectType = 'Account'].Id;
            if(acc.RecordTypeID==personAcc){
                newO.AccountId = accId;
            }
            newO.Name = product.Name;
            newO.StageName = 'Prospecting';
            newO.CloseDate = Date.today().addDays(1);
    
            insert newO;
    
            OpportunityLineItem item = new OpportunityLineItem();
           item.OpportunityId = newO.Id;
           item.PricebookEntryId = id;
           item.Product2Id = product.Id;
           item.UnitPrice = price;
           item.Quantity = 1;
    
            insert item;
    
           Quote newQ = new Quote();
           newQ.Name = product.Name;
           newQ.OwnerId = product.Apartment_Agent__c;
           newQ.OpportunityId = newO.Id;
    
           insert newQ;
    
    
            generateQuotePDF(newQ.Id, userId);
        }catch(Exception e){
            Error_Log__c error = new Error_Log__c();
            error.Exception__c = 'generateQuote '+e.getMessage();
            insert error;
        } 
    }

    @future(Callout=True)
    public static void generateQuotePDF(String quoteId, String userId) {
        try{
            String url = Url.getSalesforceBaseUrl().toExternalForm() + '/quote/quoteTemplateDataViewer.apexp?id=' + quoteId + '&summlid=0EH7Q000003lRco'; 
            PageReference pr = new PageReference(url);
            QuoteDocument doc = new QuoteDocument();
            Blob body = pr.getContentAsPDF();
            doc.Document = body;
            doc.QuoteId = quoteId;
            insert doc;
            sendQuoteEmail(body, quoteId, userId);
        }catch(Exception e){
            Error_Log__c error = new Error_Log__c();
            error.Exception__c = 'generateQuotePDF '+ e.getMessage();
            insert error;
        }
    }

    public static void sendQuoteEmail(Blob pdfBody, String quoteId, String userId) {
        try{
            system.debug('sendemail');
            EmailTemplate et = [SELECT Id FROM EmailTemplate WHERE DeveloperName = 'QuoteEmailTemplate'];
            Quote quote = [SELECT OpportunityId, Name FROM Quote WHERE Id = :quoteId];
            User user = [SELECT Id, Email FROM User WHERE Id =:userId];
            Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            OrgWideEmailAddress[] owea = [select Id from OrgWideEmailAddress where DisplayName = 'Default Sender Email'];
            if ( owea.size() > 0 ) {
                mail.setOrgWideEmailAddressId(owea.get(0).Id);
            }
            attachment.setContentType('application/pdf');
            attachment.setFileName(quote.Name);
            attachment.setBody(pdfBody);
            mail.setToAddresses(new List<String>{
                    user.Email
            });
            mail.setTemplateId(et.Id);
            mail.setWhatId(quoteId);
            mail.setTargetObjectId(user.Id);
            mail.setSaveAsActivity(false);
            mail.setFileAttachments(new List<Messaging.EmailFileAttachment>{
                    attachment
            });
            Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{
                    mail
            });
        }catch(Exception e){
            Error_Log__c error = new Error_Log__c();
            error.Exception__c = e.getMessage();
            TimeZone tz = TimeZone.getTimeZone('Europe/Warsaw');
            DateTime dt = Datetime.now();
            dt = dt.addSeconds((tz.getOffset(dt)/1000));
            error.Created__c = dt;
            
            insert error;
        }
    }

    @AuraEnabled(Cacheable = true)
    public static String getQuoteConfirm(String recordId) {
        try{
            Product2 product = [SELECT Id, Name FROM Product2 WHERE Id =: recordId];
            List<String> labelValues = new List<String>();
            labelValues.add(product.Name);
            String label = Label.RE_Quote_Confirm;
            String title = String.format(label, labelValues);    
            return title;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

}