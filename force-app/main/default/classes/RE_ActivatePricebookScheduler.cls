global with sharing class RE_ActivatePricebookScheduler implements schedulable
{
    global void execute(SchedulableContext sc)
    {
    RE_ActivatePricebook b = new RE_ActivatePricebook(); //ur batch class
      database.executebatch(b);
    }
}