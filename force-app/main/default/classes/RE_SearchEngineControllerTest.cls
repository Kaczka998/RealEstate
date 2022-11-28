@isTest
private class RE_SearchEngineControllerTest{

	@testSetup static void setup(){

		Product2 product2Obj = new Product2 (
			Description = 'Test Value', 
			DisplayUrl = 'www.google.com', 
			Name = 'test value', 
			Street__c = 'test value', 
			City__c = 'test value', 
			Postal_Code__c = 'test value', 
			Country__c = 'test value'
		);
		insert product2Obj;
		 Pricebookentry pricebookentryObj = new Pricebookentry (
			UnitPrice = 1.1
		);
		insert pricebookentryObj;
		 Userrole userroleObj = new Userrole (
			Name = 'test value', 
			OpportunityAccessForAccountOwner ='None'
		);
		insert userroleObj;
		 
	}

	@isTest static void testMethod1() {
		// code_block	
	}

	@isTest static void testMethod2() {
		// code_block	
	}
}