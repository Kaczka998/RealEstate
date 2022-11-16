public with sharing class PricebookManagerController {
  
    @AuraEnabled(cacheable=true)
    public static List<Pricebook2> getPricebooks() {

        try{
            List<Object> result = new List<Object>();
            List<Pricebook2> priceBooks = [SELECT Id, Name, Description, Start_Date__c, End_Date__c, IsActive FROM Pricebook2];
    
            return priceBooks;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Pricebook2 getPricebookDetails(String priceBookId) {

        try{
            Pricebook2 priceBook = [SELECT id, name, description, IsActive, Start_Date__c, End_Date__c FROM Pricebook2 WHERE id=:priceBookId];
            return priceBook;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }  
    }

    @AuraEnabled
    public static void addProductsToPricebook(String pricebookId, List<String> productId){
    
        try{                    
            Pricebook2 standard = [SELECT Id FROM Pricebook2 WHERE IsStandard = true];
            Pricebook2 custom = [SELECT Id, IsActive FROM Pricebook2 WHERE Id =:pricebookId];
            List<PricebookEntry> standardEntry = [SELECT Product2.Name, PricebookEntry.UnitPrice FROM PricebookEntry WHERE Pricebook2Id =:standard.Id];
            List<PricebookEntry> newPricebookEntries = new List<PricebookEntry>();
            for(String id: productId){
                PricebookEntry pricebookEntry = new PricebookEntry();
                pricebookEntry.Pricebook2Id = pricebookId;
                pricebookEntry.Product2Id = id;
                for(PricebookEntry pricebook: standardEntry){
                    if(pricebook.Product2Id == pricebookEntry.Product2Id){
                        pricebookEntry.UnitPrice = pricebook.UnitPrice;
                    }
                    if(pricebookEntry.UnitPrice==null){
                        pricebookEntry.UnitPrice = 0;
                    }
                    pricebookEntry.isActive = custom.isActive;
                }
                newPricebookEntries.add(pricebookEntry);
            }
            insert newPricebookEntries;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=false)
    public static void deletePricebook(String pricebookId){
    
        try{
            Pricebook2 pricebook = [SELECT Id, Name FROM Pricebook2 WHERE Id=:pricebookId];

            delete pricebook;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }    
    
}
