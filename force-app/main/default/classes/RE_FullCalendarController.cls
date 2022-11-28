public without sharing class RE_FullCalendarController {
   
    @AuraEnabled
    public static void createEvent(String option, Date selectedDate, String propertyId, String customerId){
        try{
                Real_Estate_Appointment__e appointment = new Real_Estate_Appointment__e();
                String userName = [SELECT Username FROM USER WHERE ID=: customerId].Username;
                User agent = getAgentInfo(propertyId);
                String agentId = agent.Id;
         
                String[] dateInfo = option.split('-');
                String[] startTime = dateInfo[0].split(':');
                String[] endTime = dateInfo[1].split(':');

                Integer h =  Integer.valueOf(startTime[0]);
                Integer m =  Integer.valueOf(startTime[1]);
                Time startT = Time.newInstance(h,m,0,0);
                h =  Integer.valueOf(endTime[0]);
                m =  Integer.valueOf(endTime[1]);
                Time endT = Time.newInstance(h,m,0,0);
                DateTime StartDateTime = DateTime.newInstance(selectedDate,startT);
                DateTime EndDateTime = DateTime.newInstance(selectedDate,endT);

                String propertyName = [SELECT Name FROM Product2 WHERE Id=:propertyId].Name;
                String contactId = [SELECT ContactId FROM User WHERE Id=:customerId].ContactId;
                
                appointment.AgentId__c = agentId;
                appointment.Start_Date__c = StartDateTime;
                appointment.End_Date__c = EndDateTime;
                appointment.Property__c = propertyId;
                appointment.CustomerName__c = userName;
                appointment.Customer_Id__c = contactId;
                appointment.PropertyName__c = propertyName;

                Database.SaveResult sr = EventBus.publish(appointment);
        }
        catch(Exception e){
            Error_Log__c error = new Error_Log__c();
            error.Exception__c = e.getMessage();
            insert error;
        }
    }

    @AuraEnabled(Cacheable = true)
    public static String getModalHeader(String recordId) {
        try{
            Product2 product = [SELECT Id, Name FROM Product2 WHERE Id =: recordId];
            List<String> labelValues = new List<String>();
            labelValues.add(product.Name);
            String label = Label.RE_ScheduleJourneyHeader;
            String title = String.format(label, labelValues);    
            return title;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static User getAgentInfo(String recordId) {
        Product2 selectedProduct = [SELECT Id, Apartment_Agent__c FROM Product2 WHERE Id = :recordId];
        User apartmentAgent = [SELECT Id, FirstName, LastName FROM User WHERE id = :selectedProduct.Apartment_Agent__c];
        return apartmentAgent;
    }

    @AuraEnabled
    public static List<Event> getEvents(String recordId) {
        User apartmentAgent = getAgentInfo(recordId);
        return [SELECT Id, Subject, StartDateTime, IsAllDayEvent, EndDateTime, WhoId, WhatId, OwnerId FROM Event WHERE OwnerId = :apartmentAgent.Id];
    }
    
    @AuraEnabled
    public static Product2 getPropertyDetails(String recordId){
        try {
            Product2 property = [SELECT Name, Street__c, City__c, Country__c, Postal_Code__c FROM Product2 WHERE Id=:recordId];
            return property;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // private static void createActualEvent(Real_Estate_Appointment__e platformEvent){
    //     User apartmentAgent = getAgentInfo(apartmentId);
    //     User currUser = [SELECT firstname, lastname, id, ContactId FROM User WHERE Id = :UserInfo.getUserId()];
    //     Event E = new Event();

    //     String[] dateInfo = meetingDate.split('-');
    //     String timeInfoStart = meetingTime.split('-')[0];
    //     String timeInfoEnd = meetingTime.split('-')[1];

    //     Integer year = integer.valueOf(dateInfo[0]);
    //     Integer month = integer.valueOf(dateInfo[1]);
    //     Integer day = integer.valueOf(dateInfo[2]);
    //     Integer hourStart = integer.valueOf(timeInfoStart.split(':')[0]);
    //     Integer minutesStart = integer.valueOf(timeInfoStart.split(':')[1]);
    //     Integer hourEnd = integer.valueOf(timeInfoEnd.split(':')[0]);
    //     Integer minutesEnd = integer.valueOf(timeInfoEnd.split(':')[1]);

    //     E.Description = Description;
    //     E.OwnerId = apartmentAgent.id;
    //     E.StartDateTime = DateTime.newInstanceGmt(year, month, day, hourStart, minutesStart, 0);
    //     E.EndDateTime = DateTime.newInstanceGmt(year, month, day, hourEnd, minutesEnd, 0);
    //     E.Subject = Label.RE_meeting_with_client;
    //     E.WhatId = apartmentId;
    //     E.WhoId = currUser.ContactId;

    //     Database.insert(E, true);
    //     return true;
    // } catch (Exception exc) {
    //     throw newMessageException(exc.getMessage());
    // }
    //     }

        private static User getInfo(String recordId) {
            Product2 selectedProduct = [SELECT Id, Apartment_Agent__c FROM Product2 WHERE Id = :recordId];
            User apartmentAgent = [SELECT Id, FirstName, LastName FROM User WHERE id = :selectedProduct.Apartment_Agent__c];
            return apartmentAgent;
        }
}
