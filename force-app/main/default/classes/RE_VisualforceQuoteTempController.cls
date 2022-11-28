public without sharing class RE_VisualforceQuoteTempController {

    public String quoteId {get;set;}
    public Quote quoteObj {get;set;}    

    public List<QuoteLineItem> getQuoteItemList(){
        try{
            List<QuoteLineItem> quoteItems = new List<QuoteLineItem>();
            if(quoteId!=null){
                quoteItems = [SELECT Id, Product2Id, Product2.DisplayUrl,Product2.Name, UnitPrice FROM QuoteLineItem WHERE QuoteId =: quoteId];
            }
            return quoteItems;
        }catch(Exception e){
            Error_Log__c error = new Error_Log__c();
            error.Exception__c = e.getMessage();
            TimeZone tz = TimeZone.getTimeZone('Europe/Warsaw');
            DateTime dt = Datetime.now();
            dt = dt.addSeconds((tz.getOffset(dt)/1000));
            error.Created__c = dt;
            
            insert error;
            throw new AuraHandledException(e.getMessage());
        }
    }
}