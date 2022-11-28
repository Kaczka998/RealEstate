public with sharing class RE_SearchEngineController {
    
    public class PropertyWrapper
    {
        @AuraEnabled
        public String name{get;set;}
        @AuraEnabled
        public Decimal areaMin{get;set;}
        @AuraEnabled
        public Decimal areaMax{get;set;}
        @AuraEnabled
        public Boolean isKitchen{get;set;}
        @AuraEnabled
        public Boolean isSwimming{get;set;}
        @AuraEnabled
        public Boolean isFacilities{get;set;}
        @AuraEnabled
        public Boolean isFurnished{get;set;}
        @AuraEnabled
        public String location{get;set;}
        @AuraEnabled
        public String toilet{get;set;}
        @AuraEnabled
        public Integer noRooms{get;set;}
        @AuraEnabled
        public Integer garageSpaces{get;set;}
        @AuraEnabled
        public Integer parkingSpaces{get;set;}
        @AuraEnabled
        public List<String> additional{get;set;}
        @AuraEnabled
        public List<String> bathroom{get;set;}
        @AuraEnabled
        public Integer limitV{get;set;}
        @AuraEnabled
        public Integer offsetV { get; set; }
    }

    @AuraEnabled(Cacheable = true)
    public static list<Product2> getPropertiesData(PropertyWrapper wrapper, String recordType){
        try{
            system.debug(wrapper);

            String query = queryBuilder(wrapper,recordType);
           
            system.debug(query);

                List<Product2> prodLst = Database.query(query);
                for(Product2 p:prodLst){
                    if(p.DisplayUrl==null){
                        p.DisplayUrl = '/resource/1669234517000/RE_NoImage';
                    }
                }

            if(prodLst.isEmpty()) {
                throw new AuraHandledException('No Record Found..');
            }
            return prodLst; 
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(Cacheable = true)
    public static String getProductsCount(String recordType) {
        try{
            List<Product2> products = [SELECT Id, Name, RecordType.Name FROM Product2 WHERE RecordType.Name LIKE: recordType];
            Integer count = products.size();
            List<String> labelValues = new List<String>();
            labelValues.add(String.valueOf(count));
            String label = Label.RE_FindPropTitle;
            String title = String.format(label, labelValues);    
            return title;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable = true)
    public static AggregateResult[] getProductPrice(String productId) {
        try{
            AggregateResult[] groupedResults = [SELECT MIN(UnitPrice) FROM PricebookEntry WHERE Product2Id =: productId AND Pricebook2.isActive = true];
            return groupedResults;  
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static PricebookEntry getStandardProductPrice(String productId) {
        try{
            PricebookEntry standardPrice = [SELECT UnitPrice FROM PricebookEntry WHERE Pricebook2.isStandard = true AND Product2Id =: productId LIMIT 1];
            return standardPrice;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(Cacheable = true)
    public static String getCurrentUserRole() {
        try{    
            UserRole role = new UserRole();
            String uRoleId = UserInfo.getUserRoleId();
            if(uRoleId!=null){
                role = [SELECT Id, Name FROM UserRole WHERE Id =: uRoleId];
            }
                return role.Name;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }    

    private static String queryBuilder(PropertyWrapper wrapper, String recordType){
        try{
            wrapper.name = String.escapeSingleQuotes(wrapper.name);
            wrapper.name = '\'%' + wrapper.name + '%\'';
            String query='SELECT  Id, Name, Description, Street__c, Postal_Code__c, City__c, RecordType.Name, DisplayUrl FROM Product2 WHERE Name LIKE '+wrapper.name+' AND RecordType.Name LIKE \'%'+recordType+'%\'';

            if(wrapper.areaMin!=null&&String.valueOf(wrapper.areaMin).length()>0){
                query+=' AND Area__c >= '+ wrapper.areaMin;
            }
            if(wrapper.areaMax!=null&&String.valueOf(wrapper.areaMax).length()>0){
                query+=' AND Area__c <= '+ wrapper.areaMax;
            }
            if(recordType == 'B2B'){
                if(wrapper.isKitchen!=null&&wrapper.isKitchen==true){
                    query+=' AND Kitchen__c = '+ wrapper.isKitchen;
                }
                if(wrapper.toilet!=null&&wrapper.toilet.length()>0){
                    query+=' AND Toilet__c = '+ wrapper.toilet;
                }
                if(wrapper.isFacilities!=null&&wrapper.isFacilities==true){
                    query+=' AND Facilities_For_Disabled__c = '+ wrapper.isFacilities;
                }
                if(wrapper.parkingSpaces!=null&&String.valueOf(wrapper.parkingSpaces).length()>0){
                    query+=' AND Parking_spaces__c >= '+ wrapper.parkingSpaces;
                }
                if(!wrapper.additional.isEmpty()){
                    String params='';
                    for(String a: wrapper.additional){
                        params += a+';';
                    }
                    params = params.removeEnd(';');
                    query+=' AND Additional__c includes (\''+params+'\')';
                }

            }
            if(recordType == 'Apartments'){
                if(wrapper.isSwimming!=null&&wrapper.isSwimming==true){
                    query+=' AND Swimming_Pool__c = '+ wrapper.isSwimming;
                }
                if(!wrapper.bathroom.isEmpty()){
                    String params='';
                    for(String b: wrapper.bathroom){
                        params += b+';';
                    }
                    params = params.removeEnd(';');
                    query+=' AND Bathroom__c includes (\''+params+'\')';
                }
                if(wrapper.isFurnished!=null&&wrapper.isFurnished==true){
                    query+=' AND Furnished__c = '+ wrapper.isFurnished;
                }
                if(wrapper.garageSpaces!=null&&String.valueOf(wrapper.garageSpaces).length()>0){
                    query+=' AND Garage_space__c >= '+ wrapper.garageSpaces;
                }
                if(wrapper.noRooms!=null&&String.valueOf(wrapper.noRooms).length()>0){
                    query+=' AND Rooms__c >= '+ wrapper.noRooms;
                }

            }
            if(!String.isBlank(wrapper.location)){
                wrapper.location = String.escapeSingleQuotes(wrapper.location);
                wrapper.location = '\'%' + wrapper.location + '%\'';
                query+=' AND City__c LIKE '+wrapper.location;
            }
            query += ' LIMIT '+wrapper.limitV+' OFFSET '+wrapper.offsetV;

            system.debug(query);
            return query; 
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        
    }
}