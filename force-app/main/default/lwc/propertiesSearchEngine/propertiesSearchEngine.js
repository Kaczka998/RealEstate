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
    @track viewC=false;

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
                this.recordType="Business Premises"
            }
            else if(this.roleName=='Sales Representants B2C'){
                this.showC=true;
                this.recordType="Apartments"
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
    }

    renderedCallback(){

        if(this.showEmergency==true){
            if(this.viewC==true){
                this.recordType="Apartments";
            }else if(this.viewC==false){
                this.recordType="Business Premises";
            }
        }
        console.log(this.recordType);
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
        console.log(this.productsCount);
    }

    changeView(){
        if(this.viewC==false){
            this.viewC=true;
            this.recordType="Apartments";
        }
        else{
            this.viewC=false;
            this.recordType="Business Premises";
        }
    }
    
}