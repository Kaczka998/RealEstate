public with sharing class RE_quoteEmailTemplate {
    @InvocableMethod(label='CreatePDFAndSendEmail' description='Returns the list of account names corresponding to the specified account IDs.')
    public static void createPDFAndSendEmail(List<String> quoteId) {
        for(String q:quoteId){
            generatePDF(q);
        }
  }

  @future(Callout=True)
    public static void generatePDF(String quoteId) {
        String url = Url.getSalesforceBaseUrl().toExternalForm() + '/quote/quoteTemplateDataViewer.apexp?id=' + quoteId + '&summlid=0EH7Q000003lRco'; 
        PageReference pr = new PageReference(url);
        QuoteDocument doc = new QuoteDocument();
        Blob body = pr.getContentAsPDF();
        doc.Document = body;
        doc.QuoteId = quoteId;
        insert doc;
        sendEmail(body, quoteId);
    }

    public static void sendEmail(Blob pdfBody, String quoteId) {
        EmailTemplate et = [SELECT Id FROM EmailTemplate WHERE DeveloperName = 'QuoteEmailTemplate'];
        Quote quote = [SELECT OpportunityId, Name FROM Quote WHERE Id = :quoteId];
        Opportunity opportunity = [SELECT AccountId FROM Opportunity WHERE Id = :quote.OpportunityId];
        Contact con = [SELECT Id, Email FROM Contact WHERE AccountId = :opportunity.AccountId LIMIT 1];
        Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        attachment.setContentType('application/pdf');
        attachment.setFileName(quote.Name);
        attachment.setBody(pdfBody);
        mail.setToAddresses(new List<String>{
                con.Email
        });
        mail.setTemplateId(et.Id);
        mail.setWhatId(quoteId);
        mail.setTargetObjectId(con.Id);
        mail.setSaveAsActivity(false);
        mail.setFileAttachments(new List<Messaging.EmailFileAttachment>{
                attachment
        });
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{
                mail
        });
    }
}