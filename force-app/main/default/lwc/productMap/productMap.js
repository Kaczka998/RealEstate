import { LightningElement, wire, api, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import STREET_FIELD from '@salesforce/schema/Product2.Street__c';
import CITY_FIELD from '@salesforce/schema/Product2.City__c';
import COUNTRY_FIELD from '@salesforce/schema/Product2.Country__c';
import POSTAL_FIELD from '@salesforce/schema/Product2.Postal_Code__c';
import NAME_FIELD from '@salesforce/schema/Product2.Name';

const FIELDS = [
    STREET_FIELD,CITY_FIELD,COUNTRY_FIELD,POSTAL_FIELD,NAME_FIELD
];

export default class ProductMap extends LightningElement {

    @api recordId;
    @track mapMarkers;
    @track mapTitle;
    
    @wire(getRecord, {
        recordId: '$recordId',
        fields: FIELDS
    })
    fetchAcc({ data, error }) {
        if (data) {
            this.mapMarkers = [{
                location: {
                'City': getFieldValue(data, CITY_FIELD),
                'Country': getFieldValue(data, COUNTRY_FIELD),
                'PostalCode': getFieldValue(data, POSTAL_FIELD),
                'Street': getFieldValue(data, STREET_FIELD)
                },
                title: 'The Landmark Building',
                icon: 'standard:account'
                }];
                this.mapTitle = getFieldValue(data, NAME_FIELD)+' Location';
        } else if (error) {
            console.error('ERROR => ', error);
        }
    }
    
}