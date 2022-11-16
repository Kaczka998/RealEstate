public with sharing class RE_VisualforceQuoteTempController {

    public String quoteId {get;set;}
    public Quote quoteObj {get;set;}    

    public List<QuoteLineItem> getQuoteItemList(){
        List<QuoteLineItem> quoteItems = new List<QuoteLineItem>();
        if(quoteId!=null){
            quoteItems = [SELECT Id, Product2Id, Product2.DisplayUrl,Product2.Name, UnitPrice FROM QuoteLineItem WHERE QuoteId =: quoteId];
        }
        return quoteItems;
    }
}
