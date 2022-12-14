public with sharing class RE_photoGalleryController{
    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getVersionFiles(String recordId){
        try{
            return [SELECT 
                        Id,
                        Title,
                        ContentDocumentId,
                        FileType,
                        ContentSize,
                        FileExtension,
                        VersionNumber,
                        CreatedDate,
                        VersionData,
                        FirstPublishLocationId 
                        FROM ContentVersion 
                        WHERE FirstPublishLocationId =:recordId 
                        ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static String getProductImage(String pId){
        
        Product2 product = [SELECT Id, Name, DisplayUrl FROM Product2 WHERE Id=: pId];
        String productImage = product.DisplayUrl;
        if(productImage==null){
            productImage='/resource/1669234517000/RE_NoImage';
          }
        return productImage;
    }

    @AuraEnabled
    public static void deleteImage(String imageId){        
        ContentDocument ConDoc =[SELECT Id, CreatedBy.name, ContentSize, ParentId FROM ContentDocument WHERE Id =: imageId];
        delete ConDoc; 
    }

    @AuraEnabled(cacheable=true)
    public static List<ContentDistribution> getUrlsFromContentDistribution(String recordId) {
        try{
            List<ContentDistribution> contentDistributions = [
                    SELECT Id, Name, DistributionPublicUrl, ContentDownloadUrl, ContentDocumentId, CreatedDate
                    FROM ContentDistribution
                    WHERE Name LIKE :recordId
            ];
            return contentDistributions;
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateVersions(String recordId){
        try {
            List<ContentVersion> version = [SELECT Id, FirstPublishLocationId FROM ContentVersion WHERE FirstPublishLocationId=: recordId];
            for(ContentVersion v:version){
                v.Product__c = recordId;
            }
            update version;
        }catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}