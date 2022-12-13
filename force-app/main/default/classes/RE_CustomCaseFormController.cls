public with sharing class RE_CustomCaseFormController {
    
    @AuraEnabled
    public static List<Product2> getProperties(){
        try{
            List<Product2> p = [SELECT Id, Name FROM Product2 WHERE RecordType.Name LIKE 'Apartments'];
            return p;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }       
    }

    @AuraEnabled
    public static void createCase(String caseType, Product2 property, String userId, String description){
        try{
            RE_CaseAssignmentRuleController ruleController = new RE_CaseAssignmentRuleController();
            String aRule = ruleController.getAssignmentRuleId();

            Database.DMLOptions dmlOpts = new Database.DMLOptions();
            dmlOpts.assignmentRuleHeader.assignmentRuleId= aRule;

            Case newCase = new Case();
            User u = [SELECT Name, AccountId FROM User WHERE Id =: userId];
            newCase.Subject = property.Name + ' ' + u.Name;
            if(u.AccountId!=null){
                newCase.AccountId = u.AccountId;
            }
            newCase.Type = caseType;
            newCase.Status = 'New';
            newCase.Origin = 'Web';
            newCase.ProductId = property.Id;
            newCase.Description = description;
            newCase.setOptions(dmlOpts);

            insert newCase;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }     
    } 
}
