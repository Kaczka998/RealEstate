@isTest
private class RE_photoGalleryControllerTest{

	@testSetup static void setup(){

		Contentversion contentversionObj = new Contentversion (
			
			Title = 'test value'
		);
		insert contentversionObj;
		 Product2 product2Obj = new Product2 (
			DisplayUrl = 'www.google.com', 
			Name = 'test value', 
			Street__c = 'test value', 
			City__c = 'test value', 
			Postal_Code__c = 'test value', 
			Country__c = 'test value'
		);
		insert product2Obj;

		 
	}

	@isTest static void testMethod1() {
		// code_block	
	}

	@isTest static void testMethod2() {
		// code_block	
	}
}