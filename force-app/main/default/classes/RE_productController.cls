public with sharing class RE_productController {

    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts(String recordType, String pricebookId) {
    
        try{
            List<Product2> productsinpricebook = new List<Product2>();
            List<Product2> productsToAdd = new List<Product2>();
            
            if(pricebookId.length() >0){
                List<PricebookEntry> productListResults = [SELECT Name, Pricebook2Id, Product2Id FROM PricebookEntry WHERE Pricebook2Id =: pricebookId];
                List<String> pId = new List<String>();
                for(PricebookEntry entry: productListResults){
                    pId.add(entry.Product2Id);
                }
                productsinpricebook = [SELECT Id, Name, Description, RecordTypeId, RecordType.Name FROM Product2 WHERE Id IN :pId]; 
                List<Product2> products = new List<Product2>();
                if(recordType.length()>2&&recordType!=null){
                    products = [SELECT Id, Name, Description, RecordTypeId, RecordType.Name FROM Product2 WHERE RecordTypeId=:recordType];      
                }
                else{
                    products = [SELECT Id, Name, Description, RecordTypeId, RecordType.Name FROM Product2 WHERE RecordTypeId IN ('0127Q000000EtwK','0127Q000000EtwF')];      
                }            
                if(productListResults.size()>0){
                    for(PricebookEntry entry: productListResults){
                        for(Product2 product: products){    
                            if ((entry.Product2Id != product.Id) && (!productsinpricebook.contains(product))&&(!productsToAdd.contains(product))){
                                productsToAdd.add(product);
                            }
                        }
                    }
                }                 
                if(productListResults.size()==0){
                    productsToAdd = products;
                } 
            }
        
            return productsToAdd;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
            
    @AuraEnabled(cacheable=true)
    public static List<PricebookEntry> getPricebookEntriess(String pricebookId) {
    
        try{
            List<PricebookEntry> productWithPrice = new List<PricebookEntry>();
            productWithPrice = [SELECT Id, Name, Pricebook2Id, Product2Id, UnitPrice FROM PricebookEntry WHERE Pricebook2Id =: pricebookId];
                                
            return productWithPrice;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage()); 
        }
    }

    @AuraEnabled
    public static void updatePrice(List<String> entries, List<Decimal> prices) {

        try{
            List<PricebookEntry> entriesList = [SELECT Id, Name, UnitPrice FROM PricebookEntry WHERE Id IN: entries];

            for(PricebookEntry e: entriesList){
                for(Integer i=0; i<entries.size();i++){
                    if(entries[i]==e.Id){
                        e.UnitPrice = prices[i];
                    }
                }
            }
    
            update entriesList;
        }
        catch(Exception e)   {
            throw new AuraHandledException(e.getMessage()); 
        }
    }

    @AuraEnabled
    public static void applyToSelected(List<PricebookEntry> products, Decimal priceChange, String action) {
       
        try{
            priceChange=0.01*priceChange;
            if(action == 'discount'){
                for(PricebookEntry e: products){
                    e.UnitPrice = e.UnitPrice - (e.UnitPrice * priceChange); 
                }
            }
            if(action == 'increment'){
                for(PricebookEntry e: products){
                    e.UnitPrice = e.UnitPrice + (e.UnitPrice * priceChange); 
                }
            }

            Database.update(products);
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteSelected(List<PricebookEntry> products) {
        
        try{        
            delete products;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
 }