public with sharing class HS_CheckOverlapDateHandler {
    public void overlapContractDate(List<Contract__c> contractList){

        List<Contract__c> contracts = new List<Contract__c>();
        contracts = [SELECT Name, Doctor__c, Start_Date__c, End_Date__c, Hospital__c FROM Contract__c];

        for(Contract__c cont: contractList){
            for(Contract__c con: contracts){
                if(cont.Doctor__c == con.Doctor__c && cont.Hospital__c == con.Hospital__c) {
                    if((cont.End_Date__c>con.Start_Date__c && (cont.End_Date__c<=con.End_Date__c) ||con.End_Date__c==null)|| (con.End_Date__c>cont.Start_Date__c && (con.End_Date__c<=cont.End_Date__c||cont.End_Date__c==null))){
                        if(con.End_Date__c!=null){
                            cont.addError(String.format(Label.HS_ContractDateError, new String[]{
                                    con.Name, (con.Start_Date__c).format(), (con.End_Date__c).format()
                            }));
                        }else{
                            cont.addError(String.format(Label.HS_ContractDateError, new String[]{
                                    con.Name, (con.Start_Date__c).format(), ' - '
                            }));
                        }
                    }
                }
            }
        }
    }
}