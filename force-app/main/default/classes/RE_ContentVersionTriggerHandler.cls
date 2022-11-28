public with sharing class RE_ContentVersionTriggerHandler implements ICL_ContentVersionTrigger{
    public void AfterUpdate(List<ContentVersion> updatedContentVersions){
        RE_ContentVersionService.createContentDistribution(updatedContentVersions);
    }
}