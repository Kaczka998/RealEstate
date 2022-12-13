trigger RE_QuoteAfterInsert on Quote (after insert) {

    RE_QuoteAfterInsertTriggerHandler handler = new RE_QuoteAfterInsertTriggerHandler();
    handler.updateQuoteLineItems(Trigger.new);
   
}