import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getProductPrice from '@salesforce/apex/RE_SearchEngineController.getProductPrice';
import getStandardProductPrice from '@salesforce/apex/RE_SearchEngineController.getStandardProductPrice';
import createRequest from '@salesforce/apex/RE_QuoteGenerate.createRequest';
import Id from '@salesforce/user/Id';
import LightningConfirm from 'lightning/confirm';

const FIELDS = [
    'Product2.Name',
    'Product2.Street__c',
    'Product2.City__c'
];

export default class ProductPageHeader extends LightningElement {
    @api recordId;
    @track price;
    @track showSearchComponent = false;
    standardPrice;
    userId = Id;

    @wire(getProductPrice, { productId: '$recordId'})
    wiredResult(wiredResult) {
    const { data, error } = wiredResult;
        if (data) {
            this.price = data[0].expr0;
            getStandardProductPrice({productId: this.recordId})
                .then((result)=>{
                    this.standardPrice = result.UnitPrice;
            
                    if(this.price == 'undefined'||this.price==null){
                    this.price = this.standardPrice;
                } 
                })
        }
        if (error) {
            console.log(error);
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    product;

    get name() {
        return this.product.data.fields.Name.value;
    }

    get street() {
        return this.product.data.fields.Street__c.value;
    }

    get city() {
        return this.product.data.fields.City__c.value;
    }    

    handleClick(){
        const showPreview = this.template.querySelector("c-appointment-scheduler");
        showPreview.show();
    }

    async handleQuote(){
            const result = await LightningConfirm.open({
                message: 'Do you want to generate quote PDF from '+this.name+' and send it to your email?',
                variant: 'headerless',
                label: 'Please Confirm',
                theme: 'default',
            });
    
            if(result==true){
                this.submitDetails();
        }

    }

    submitDetails(){
        createRequest({recordId: this.recordId, userId: this.userId, price: this.price})
        .then(data => {
          this.error = null;
        })
        .catch(error => {
          this.error = error;
    
        });
    }
    
}