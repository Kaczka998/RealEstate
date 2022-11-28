public with sharing class RE_AppointmentTriggerHandler {
   
    public void createEvent(List<Real_Estate_Appointment__e> pEvents){
        try{
            List<Event> events= new List<Event>();
  
        for (Real_Estate_Appointment__e event : pEvents) {
            if (event.Customer_Id__c!=null) {
                Error_Log__c e = new Error_Log__c();
            e.Exception__c = String.valueOf(event.Start_Date__c)+' '+String.valueOf(event.End_Date__c);
            insert e;
            Event newEvent = new Event(
                OwnerId = event.AgentId__c,
                WhoId = event.Customer_Id__c,
                WhatId = event.Property__c,
                StartDateTime = event.Start_Date__c,
                EndDateTime = event.End_Date__c,
                ActivityDateTime = event.Start_Date__c,
                Subject = event.PropertyName__c+ ' showing'
        
            );
                events.add(newEvent);
            }
        }
        if (events.size() > 0) {
            insert events;
        }
        }catch(Exception e){
            Error_Log__c error = new Error_Log__c();
            error.Exception__c = e.getMessage();
            insert error;
        }
        
    }
}
