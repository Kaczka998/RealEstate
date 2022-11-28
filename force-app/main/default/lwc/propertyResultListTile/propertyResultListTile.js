import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getProductPrice from '@salesforce/apex/RE_SearchEngineController.getProductPrice';
import getStandardProductPrice from '@salesforce/apex/RE_SearchEngineController.getStandardProductPrice';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import RE_Error from '@salesforce/label/c.RE_Error';

export default class PropertyResultListTile extends NavigationMixin(LightningElement) {
    @api product;
    @api productId;
    @track price;
    @track recordPageUrl;

    label={
        RE_Error
    }

    connectedCallback(){
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.productId,
                actionName: 'view',
            }
        })
        .then((url) => {
            this.recordPageUrl = url;
        });
    }

    @wire(getProductPrice, { productId: '$productId'})
    wiredResult(wiredResult) {
    const { data, error } = wiredResult;
    this._wiredMarketData = wiredResult;
        if (data) {
            this.price = data[0].expr0;
            console.log(this.price);
            getStandardProductPrice({productId: this.productId})
                .then((result)=>{
                    this.standardPrice = result.UnitPrice;
            
                    if(this.price == 'undefined'||this.price==null){
                    this.price = this.standardPrice;
                } 
                })
        }
        if (error) {
            console.log(error);
            if(this.price == null){
                const toastEvent = new ShowToastEvent({
                    title: this.label.RE_Error,
                    message: 'propertyDetails ' + error["body"]["message"],
                    variant: "error"
                  });
                    this.dispatchEvent(toastEvent);
            }
        }
    }
    
}