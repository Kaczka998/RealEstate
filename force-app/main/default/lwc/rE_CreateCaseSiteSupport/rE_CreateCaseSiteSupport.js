import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProperties from '@salesforce/apex/RE_CustomCaseFormController.getProperties';
import createCase from '@salesforce/apex/RE_CustomCaseFormController.createCase';
import Id from '@salesforce/user/Id';

import RE_Error from '@salesforce/label/c.RE_Error';
import RE_Success from '@salesforce/label/c.RE_Success';
import RE_CaseCreated from '@salesforce/label/c.RE_CaseCreated';
import RE_CreateCase from '@salesforce/label/c.RE_CreateCase';
import RE_Description from '@salesforce/label/c.RE_Description';
import RE_Property_Name from '@salesforce/label/c.RE_Property_Name';
import RE_ContactUs from '@salesforce/label/c.RE_ContactUs';
import RE_Type from '@salesforce/label/c.RE_Type';
import RE_RequiredFieldsMissing from '@salesforce/label/c.RE_RequiredFieldsMissing';

export default class RE_CreateCaseSiteSupport extends LightningElement {
    @track selectOptions = [];
    @track currProperty;
    userId = Id;
    selectedProperty;
    selectedPropertyId;
    description; 
    propertyList;

    label = {
        RE_Error,
        RE_ContactUs,
        RE_CreateCase,
        RE_Description,
        RE_Property_Name,
        RE_Type,
        RE_CaseCreated,
        RE_Success,
        RE_RequiredFieldsMissing
    }

    get typeOptions(){
        return [
            { label: 'Renovations', value: 'Renovations' },
            { label: 'Payments', value: 'Payments' }
        ];
    }

    get currProperty(){
        return this.selectedProperty;
    }

    connectedCallback(){
        getProperties()
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
            this.propertyList = null;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: this.label.RE_Error,
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        });    
    }

    handleTypeChange(event) {
        this.selectedType = event.target.value;
    }

    handleDescriptionChange(event){
        this.description = event.target.value;
    }

    handlePropertyChange(event){
        this.selectedPropertyId = event.detail.value;
        this.selectedProperty = event.target.options.find(opt => opt.value === event.detail.value).label;
      }

    createCaseHandler() {
        if(!this.selectedType||!this.currProperty){
            if(!this.currProperty){
                let prop = this.template.querySelector('.inputProperty');
                prop.reportValidity();
            }
            if(!this.selectedType){
                let type = this.template.querySelector('.inputType');
                type.reportValidity();
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: this.label.RE_Error,
                    message: this.label.RE_RequiredFieldsMissing,
                    variant: 'error',
                }),
            );
            return; 
        }
        console.log('nie przerwało');
        const property = {
            Id: this.selectedPropertyId,
            Name: this.selectedProperty
        }
        createCase({ caseType: this.selectedType, property: property, userId: this.userId, description: this.description})
            .then(result => {
                this.selectedType = null;
                this.selectedProperty = null;
                this.selectedPropertyId = null;
                this.description = null;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: this.label.RE_Success,
                        message: this.label.RE_CaseCreated,
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