public with sharing class RE_CreateB2BOfferController {

    @AuraEnabled
    public static List<Product2> getPremises(){
        try{
            List<Product2> p = [SELECT Id, Name FROM Product2 WHERE RecordType.Name LIKE '%Business Premises%'];
            return p;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }       
    }

    @AuraEnabled
    public static List<Account> getAccounts(){
        try{
            List<Account> a = [SELECT Id, Name FROM account WHERE RecordType.Name LIKE '%Business Account%'];
            return a;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }       
    }

    @AuraEnabled
    public static List<Account> createB2BOffer(String productId, String accountId, Integer months, Decimal price){
        try{
            String accountName = [SELECT Name FROM Account WHERE Id =: accountId].Name;
           List<Account> a = [SELECT Id, Name FROM account WHERE RecordType.Name LIKE '%Business%'];

            Product2 product = [SELECT Name, Id, NumberOfRevenueInstallments, RevenueInstallmentPeriod, RevenueScheduleType, CanUseRevenueSchedule FROM Product2 WHERE Id =: productId];
            product.CanUseRevenueSchedule = true;
            product.NumberOfRevenueInstallments = months;
            product.RevenueInstallmentPeriod = 'Monthly';
            product.RevenueScheduleType = 'Repeat';

            update product;

            Opportunity newO = new Opportunity();
            newO.RecordTypeID = [SELECT Id FROM RecordType WHERE Name LIKE 'B2B' AND SobjectType = 'Opportunity'].Id;
            newO.OwnerId = [SELECT Id FROM User WHERE ProfileId IN (SELECT Id FROM Profile WHERE Name LIKE 'System%')].Id;
            newO.AccountId = accountId;
            newO.Name = product.Name + '/' + accountName + '/' + String.valueOf(months) + '_' + System.Label.RE_Months;
            newO.StageName = 'Prospecting';
            newO.CloseDate = Date.today().addDays(1);
            PricebookEntry entry = new PricebookEntry();
            try{
                entry = [SELECT Id, Pricebook2Id FROM PricebookEntry WHERE UnitPrice = :price AND Product2Id =: productId AND (NOT Pricebook2.Name LIKE '%Standard%') LIMIT 1];
            }catch(Exception e){
                entry = [SELECT Pricebook2Id FROM PricebookEntry WHERE UnitPrice =:price AND Product2Id =: productId AND Pricebook2.Name LIKE '%Standard%' LIMIT 1];  
            }
            newO.Pricebook2Id = entry.Pricebook2Id;

            insert newO;

            OpportunityLineItem item = new OpportunityLineItem();
            item.OpportunityId = newO.Id;
            item.PricebookEntryId = entry.Id;
            item.Product2Id = productId;
            item.UnitPrice = price;
            item.Quantity = 1;

            insert item;
            return a;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }       
    }
}
