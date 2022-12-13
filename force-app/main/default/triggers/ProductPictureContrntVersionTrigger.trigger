trigger ProductPictureContrntVersionTrigger on ContentVersion (after update) {
    RE_ContentVersionTriggerDispatcher.run(new RE_ContentVersionTriggerHandler());
    }