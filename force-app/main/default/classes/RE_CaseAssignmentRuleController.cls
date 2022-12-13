public without sharing class RE_CaseAssignmentRuleController {
    
    public String getAssignmentRuleId(){
        try{
            AssignmentRule AR = new AssignmentRule();
            AR = [SELECT Id FROM AssignmentRule WHERE SobjectType = 'Case' AND Active = true LIMIT 1];
            return AR.Id;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }       
    }
}
