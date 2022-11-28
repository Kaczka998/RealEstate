public with sharing class RE_CreateQuoteRequest {

    public void getRequest(List<Quote_Community_Request__e> requests){

        try{
            RE_QuoteGenerate generator = new RE_QuoteGenerate();
            for(Quote_Community_Request__e r:requests){
                generator.generateQuote(r.Record_Id__c, r.User_Id__c, r.Price__c);
            }
        }
        catch(Exception e){
            Error_Log__c error = new Error_Log__c();
            error.Exception__c = e.getMessage();
            insert error;
        }
        
    }
}
