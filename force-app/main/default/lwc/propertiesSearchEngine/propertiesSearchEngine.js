import { LightningElement, track, api} from 'lwc';
import getCurrentUserRole from '@salesforce/apex/RE_SearchEngineController.getCurrentUserRole';
import getProductsCount from '@salesforce/apex/RE_SearchEngineController.getProductsCount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import RE_Error from '@salesforce/label/c.RE_Error';

export default class CustomRecordSearch extends LightningElement {
 
    @track showB=false;
    @track showC=false;
    @track showEmergency=false;
    @track productsCount = '';

    roleName;
    recordType='';
    label={
        RE_Error
    }

    connectedCallback(){   
        getCurrentUserRole()
        .then(result=>{
            this.roleName=result;   
            if(this.roleName=='Sales Representants B2B'){
                this.showB=true;
                this.recordType="B2B"
            }
            else if(this.roleName=='Sales Representants B2C'){
                this.showC=true;
                this.recordType="B2C"
            }
            else{
                this.showEmergency=true;
            }
        })
        .catch(error => {
            console.log(error);
            const toastEvent = new ShowToastEvent({
                title: this.label.RE_Error,
                message: 'roleName ' + error["body"]["message"],
                variant: "error"
              });
                this.dispatchEvent(toastEvent);
        })  

        getProductsCount({recordType: this.recordType})
        .then(result=>{
            this.productsCount=result;
        })
        .catch(error => {
            console.log(error);
            const toastEvent = new ShowToastEvent({
                title: this.label.RE_Error,
                message: 'propertyCount ' + error["body"]["message"],
                variant: "error"
              });
                this.dispatchEvent(toastEvent);
        })  
    }

    
}