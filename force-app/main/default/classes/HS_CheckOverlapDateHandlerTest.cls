@IsTest
private class HS_CheckOverlapDateHandlerTest {
    @TestSetup
    private static void setup() {
        Doctor__c doc1 = new Doctor__c();
        doc1.First_Name__c = 'Antoni';
        doc1.Last_Name__c = 'Antoniak';
        doc1.License_Number__c = 5463211;
        doc1.Email__c = 'ant@oni.com';

        insert doc1;

        Hospital__c hos1 = new Hospital__c();
        hos1.Name = 'test';
        hos1.Phone_Number__c = '1235467';

        insert hos1;
    }

    @isTest
    private static void shouldOverlapIfStartsBeforeExistingEnds() {
        Boolean exceptionThrown = false;

        Doctor__c newDoctor = [SELECT id FROM Doctor__c LIMIT 1];
        Hospital__c newHospital = [SELECT id FROM Hospital__c LIMIT 1];

        Contract__c con = new Contract__c();
        con.Doctor__c = newDoctor.id;
        con.Hospital__c = newHospital.id;
        con.Start_Date__c = Date.newInstance(2019, 11, 18);
        con.End_Date__c = Date.newInstance(2019, 11, 26);

        insert con;

        try {
            Contract__c con1 = new Contract__c();
            con1.Doctor__c = newDoctor.id;
            con1.Hospital__c = newHospital.id;
            con1.Start_Date__c = Date.newInstance(2019, 11, 24);
            con1.End_Date__c = Date.newInstance(2019, 12, 26);

            insert con1;
        } catch (Exception e) {
            exceptionThrown = true;
        }
        System.assertEquals(true, exceptionThrown);
    }
    @isTest static void shouldOverlapIfStartsAfterExistingEnds() {
        Boolean exceptionThrown = false;

        Doctor__c newDoctor = [SELECT id FROM Doctor__c LIMIT 1];
        Hospital__c newHospital = [SELECT id FROM Hospital__c LIMIT 1];

        Contract__c con = new Contract__c();
        con.Doctor__c = newDoctor.id;
        con.Hospital__c = newHospital.id;
        con.Start_Date__c = Date.newInstance(2020, 01, 18);
        con.End_Date__c = Date.newInstance(2020, 01, 26);

        insert con;

        try {
            Contract__c con1 = new Contract__c();
            con1.Doctor__c = newDoctor.id;
            con1.Hospital__c = newHospital.id;
            con1.Start_Date__c = Date.newInstance(2020, 01, 29);
            con1.End_Date__c = Date.newInstance(2020, 02, 10);

            insert con1;
        } catch (Exception e) {
            exceptionThrown = true;
        }
        System.assertEquals(false, exceptionThrown);
    }
    @isTest
    private static void shouldOverlapIfThereIsUnfinishedExisting() {
        Boolean exceptionThrown = false;

        Doctor__c newDoctor = [SELECT id FROM Doctor__c LIMIT 1];
        Hospital__c newHospital = [SELECT id FROM Hospital__c LIMIT 1];

        Contract__c con = new Contract__c();
        con.Doctor__c = newDoctor.id;
        con.Hospital__c = newHospital.id;
        con.Start_Date__c = Date.newInstance(2020, 11, 18);
        con.End_Date__c = null;

        insert con;

        try {
            Contract__c con1 = new Contract__c();
            con1.Doctor__c = newDoctor.id;
            con1.Hospital__c = newHospital.id;
            con1.Start_Date__c = Date.newInstance(2020, 11, 01);
            con1.End_Date__c = Date.newInstance(2020, 11, 26);

            insert con1;
        } catch (Exception e) {
            exceptionThrown = true;
        }
        System.assertEquals(true, exceptionThrown);
    }
    @isTest
    private static void shouldOverlapIfStartsAfterExistingEndsAndUnfinished() {
        Boolean exceptionThrown = false;

        Doctor__c newDoctor = [SELECT id FROM Doctor__c LIMIT 1];
        Hospital__c newHospital = [SELECT id FROM Hospital__c LIMIT 1];

        Contract__c con = new Contract__c();
        con.Doctor__c = newDoctor.id;
        con.Hospital__c = newHospital.id;
        con.Start_Date__c = Date.newInstance(2021, 11, 18);
        con.End_Date__c = Date.newInstance(2021, 11, 26);

        insert con;

        try {
            Contract__c con1 = new Contract__c();
            con1.Doctor__c = newDoctor.id;
            con1.Hospital__c = newHospital.id;
            con1.Start_Date__c = Date.newInstance(2021, 11, 28);
            con1.End_Date__c = null;

            insert con1;
        } catch (Exception e) {
            exceptionThrown = true;
        }
        System.assertEquals(false, exceptionThrown);
    }
    @isTest static void shouldOverlapIfBothEndDatesNull() {
        Boolean exceptionThrown = false;

        Doctor__c newDoctor = [SELECT id FROM Doctor__c LIMIT 1];
        Hospital__c newHospital = [SELECT id FROM Hospital__c LIMIT 1];

        Contract__c con = new Contract__c();
        con.Doctor__c = newDoctor.id;
        con.Hospital__c = newHospital.id;
        con.Start_Date__c = Date.newInstance(2022, 11, 18);
        con.End_Date__c = null;

        insert con;


        try {
            Contract__c con1 = new Contract__c();
            con1.Doctor__c = newDoctor.id;
            con1.Hospital__c = newHospital.id;
            con1.Start_Date__c = Date.newInstance(2022, 11, 29);
            con1.End_Date__c = null;

            insert con1;
        } catch (Exception e) {
            exceptionThrown = true;
            //musisz pobrać e.getMessage i sprawdzić JAKI WYJĄTEK
        }
        System.assertEquals(true, exceptionThrown);
    }
}