public with sharing class RE_setDefaultController {

    @AuraEnabled
    public static Boolean saveImageAsDefault(String recordId, String contentDocumentId, String versionId) {
        Boolean result;
        try {
            Product2 product = [SELECT DisplayUrl FROM Product2 WHERE Id=:recordId];
            ContentDistribution contentDistribution = [
                SELECT Id, Name, DistributionPublicUrl, ContentDownloadUrl, ContentDocumentId, ContentVersionId
                FROM ContentDistribution
                WHERE Name LIKE :recordId AND ContentVersionId =: versionId
            ];

            product.DisplayUrl = contentDistribution.ContentDownloadUrl;
            update product;
            result = true;
        }catch (Exception e) {
            result = false;
        }
        return result;
    }
}