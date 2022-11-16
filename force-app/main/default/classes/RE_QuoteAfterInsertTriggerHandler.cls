public with sharing class RE_QuoteAfterInsertTriggerHandler {
   
    public void updateQuoteLineItems(List<Quote> quoteList){
        List<QuoteLineItem> quoteItems = new List<QuoteLineItem>();
        Set<QuoteLineItem> quoteItemSet = new Set<QuoteLineItem>();
        List<String> IDs = new List<String>();
        for(Quote q: quoteList){
            IDs.add(q.Id);
        }
            List<OpportunityLineItem> oppItems = [SELECT Id, OpportunityId, PricebookEntryId, Product2Id, UnitPrice, Quantity FROM OpportunityLineItem WHERE OpportunityId IN: IDs];      
            for(OpportunityLineItem o: oppItems){
                QuoteLineItem quoteItem = new QuoteLineItem();
                for(Quote q:quoteList){
                    if(q.OpportunityId == o.OpportunityId){
                        quoteItem.QuoteId = q.Id;
                    }
                }
                quoteItem.PricebookEntryId = o.PricebookEntryId;
                quoteItem.Product2Id = o.Product2Id;
                quoteItem.UnitPrice = o.UnitPrice;
                quoteItem.Quantity = o.Quantity;
                quoteItemSet.add(quoteItem);
            }

        quoteItems.addAll(quoteItemSet);
        
        insert quoteItems;
    }
}