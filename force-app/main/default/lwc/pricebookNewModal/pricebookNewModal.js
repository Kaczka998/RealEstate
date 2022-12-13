import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Pricebook2.Description';
import IS_ACTIVE_FIELD from '@salesforce/schema/Pricebook2.IsActive';
import START_FIELD from '@salesforce/schema/Pricebook2.Start_Date__c';
import END_FIELD from '@salesforce/schema/Pricebook2.End_Date__c';

import RE_Cancel from "@salesforce/label/c.RE_Cancel";
import RE_Save from "@salesforce/label/c.RE_Save";
import RE_PricebookCreated from "@salesforce/label/c.RE_PricebookCreated";
import RE_Success from "@salesforce/label/c.RE_Success";
import RE_New from "@salesforce/label/c.RE_New";
import RE_Pricebook from "@salesforce/label/c.RE_Pricebook";
import RE_PricebookNotCreated from "@salesforce/label/c.RE_PricebookNotCreated";

export default class PricebookNewModal extends LightningElement {
  @api recordId;

  @track productList
  
  refreshPricebooks;  

  nameField = NAME_FIELD;
  descriptionField = DESCRIPTION_FIELD;
  startField = START_FIELD;
  endField = END_FIELD;
  activeField = IS_ACTIVE_FIELD;

  label={
    RE_Cancel,
    RE_Save,
    RE_PricebookCreated,
    RE_Success,
    RE_New,
    RE_Pricebook,
    RE_PricebookNotCreated
  }

  showSecond = false;
  showNew = true;
  showModal = false;
  
  @api show() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.showSecond = false;
  }

  handleSuccess(event) {
    const evt = new ShowToastEvent({
        title: this.label.RE_Success,
        message: this.label.RE_PricebookCreated,
        variant: 'success',
    });
    this.dispatchEvent(evt);
      
    this.refreshPricebooks = event.detail;
    const refreshEvent = new CustomEvent ("refreshpricebooks",{detail: this.refreshPricebooks});
    this.dispatchEvent(refreshEvent);

    this.showModal = false;
    this.showSecond = false;
  }

  handleError(event){
    let message = event.detail.message;
    const toastEvent = new ShowToastEvent({
      title: this.label.RE_Error,
      message: this.label.RE_PricebookNotCreated +' '+ message,
      variant: "error"
    });
    this.dispatchEvent(toastEvent);
  }
}