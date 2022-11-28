public without sharing class RE_getQuotesToTemplate {
    public List<QuoteLineItem> getQuotes(String quoteId){
       
        List<QuoteLineItem> quoteItems = new List<QuoteLineItem>();
        if(quoteId!=null){
            quoteItems = [SELECT Id, Product2Id, Product2.DisplayUrl,Product2.Name, UnitPrice FROM QuoteLineItem WHERE QuoteId =: quoteId];
        }
        return quoteItems;
    }
}
