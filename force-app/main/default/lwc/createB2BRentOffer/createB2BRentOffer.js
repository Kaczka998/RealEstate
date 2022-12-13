import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPremises from '@salesforce/apex/RE_CreateB2BOfferController.getPremises';
import getAccounts from '@salesforce/apex/RE_CreateB2BOfferController.getAccounts';
import createB2BOffer from '@salesforce/apex/RE_CreateB2BOfferController.createB2BOffer';
import getProductPrice from '@salesforce/apex/RE_SearchEngineController.getProductPrice';
import getStandardProductPrice from '@salesforce/apex/RE_SearchEngineController.getStandardProductPrice';
import Id from '@salesforce/user/Id';

import RE_Error from '@salesforce/label/c.RE_Error';
import RE_Success from '@salesforce/label/c.RE_Success';
import RE_B2BOpportunityScheduleCreatedd from '@salesforce/label/c.RE_B2BOpportunityScheduleCreatedd';
import RE_CreateOpportunity from '@salesforce/label/c.RE_CreateOpportunity';
import RE_Property_Name from '@salesforce/label/c.RE_Property_Name';
import RE_RelatedClientAccount from '@salesforce/label/c.RE_RelatedClientAccount';
import RE_RevenuePeriodLength from '@salesforce/label/c.RE_RevenuePeriodLength';
import RE_RequiredFieldsMissing from '@salesforce/label/c.RE_RequiredFieldsMissing';
import RE_Month from '@salesforce/label/c.RE_Month';
import RE_CreateB2BOpportunityTitle from '@salesforce/label/c.RE_CreateB2BOpportunityTitle';
import RE_Price from '@salesforce/label/c.RE_Price';

export default class RE_CreateCaseSiteSupport extends LightningElement {
    @track selectOptions = [];
    @track currProperty;
    @track accountOptions = [];
    @track currAccount;
    userId = Id;
    selectedAccount;
    selectedAccountId;
    selectedProperty;
    selectedPeriod = '12';
    selectedPropertyId;
    showEdit=false;;
    @track price;

    label = {
        RE_Error,
        RE_Property_Name,
        RE_B2BOpportunityScheduleCreatedd,
        RE_CreateOpportunity,
        RE_RelatedClientAccount,
        RE_RevenuePeriodLength,
        RE_Success,
        RE_RequiredFieldsMissing,
        RE_Month,
        RE_CreateB2BOpportunityTitle,
        RE_Price
    }

    get periodOptions(){
        return [
            { label: '12', value: '12' },
            { label: '24', value: '24' },
            { label: '36', value: '36' },
        ];
    }

    get currProperty(){
        return this.selectedProperty;
    }

    get currAccount(){
        return this.selectedAccount;
    }

    connectedCallback(){
        getPremises()
        .then(result => {
            for(const list of result){
                const option = {
                    label: list.Name,
                    value: list.Id
                };
                this.selectOptions = [ ...this.selectOptions, option ];
                }
                
        })
        .catch( error=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: this.label.RE_Error,
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        });    
        getAccounts()
        .then(result => {
            for(const list of result){
                const option = {
                    label: list.Name,
                    value: list.Id
                };
                this.accountOptions = [ ...this.accountOptions, option ];
                }
                
        })
        .catch( error=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: this.label.RE_Error,
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        });    
    }

    handlePeriodChange(event) {
        this.selectedPeriod = event.target.value;
    }

    handleAccountChange(event){
        this.selectedAccountId = event.detail.value;
        this.selectedAccount = event.target.options.find(opt => opt.value === event.detail.value).label;
    }

    handlePropertyChange(event){
        this.selectedPropertyId = event.detail.value;
        this.selectedProperty = event.target.options.find(opt => opt.value === event.detail.value).label;
        getProductPrice({ productId: this.selectedPropertyId})
        .then(result => {
            this.price = result[0].expr0;
            if(this.price==undefined){
                getStandardProductPrice({ productId: this.selectedPropertyId})
                .then(result => {
                    this.price = result.UnitPrice;
                })
                .catch( error=>{     
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: this.label.RE_Error,
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                });
            }
        })
        .catch( error=>{
           
        });
      }

      createOffer() {
        createB2BOffer({ productId: this.selectedPropertyId, accountId: this.selectedAccountId, months: this.selectedPeriod, price: this.price})
            .then(result => {
                this.selectedPeriod = null;
                this.selectedProperty = null;
                this.selectedPropertyId = null;
                this.selectedAccount = null;
                this.selectedAccountId = null;
                this.price=0.0;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: this.label.RE_Success,
                        message: this.label.RE_B2BOpportunityScheduleCreatedd,
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: this.label.RE_Error,
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }
}