public with sharing class RE_ContentVersionTriggerDispatcher {
    public static void run(ICL_ContentVersionTrigger handler){
        if (trigger.isAfter) {
            if (trigger.isUpdate) {
                handler.AfterUpdate(trigger.new);
            }
        }
    }
}
