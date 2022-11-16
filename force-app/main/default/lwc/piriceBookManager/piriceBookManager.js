import { LightningElement, api, wire, track } from "lwc";
import getPricebooks from "@salesforce/apex/PricebookManagerController.getPricebooks";
import deletePricebook from "@salesforce/apex/PricebookManagerController.deletePricebook";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';

import RE_Edit from "@salesforce/label/c.RE_Edit";
import RE_Details from "@salesforce/label/c.RE_Details";
import RE_Delete from "@salesforce/label/c.RE_Delete";
import RE_New from "@salesforce/label/c.RE_New";
import RE_Name from "@salesforce/label/c.RE_Name";
import RE_StartDate from "@salesforce/label/c.RE_StartDate";
import RE_Description from "@salesforce/label/c.RE_Description";
import RE_EndDate from "@salesforce/label/c.RE_EndDate";
import RE_Active from "@salesforce/label/c.RE_Active";
import RE_Pricebooks from "@salesforce/label/c.RE_Pricebooks";
import RE_PricebookDeleted from "@salesforce/label/c.RE_PricebookDeleted";
import RE_PricebookNotDeleted from "@salesforce/label/c.RE_PricebookNotDeleted";
import RE_Success from "@salesforce/label/c.RE_Success";
import RE_Error from "@salesforce/label/c.RE_Error";

const actions = [
    { label: RE_Edit, name: 'edit' },
    { label: RE_Details, name: 'details' },
    { label: RE_Delete, name: 'delete' }
];

const columns = [
  { label: RE_Name, fieldName: "Name", editable: false },
  { label: RE_Description, fieldName: "Description", editable: false },
  { label: RE_StartDate, fieldName: "Start_Date__c", editable: false },
  { label: RE_EndDate, fieldName: "End_Date__c", editable: false },
  { label: RE_Active, type: 'boolean', fieldName: "IsActive", editable: false },
  { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'right' } }
];

export default class PriceBookManager extends LightningElement {
  @api objectApiName;
  @api recordId;
  @api priceBookId;
  @api pricebookAdded;

  @track prriceBookInfo;

  showEdit = false;
  showDetails = false;
  columns = columns;
  
  label = {
    RE_New,
    RE_Pricebooks,
    RE_PricebookDeleted,
    RE_PricebookNotDeleted,
    RE_Success,
    RE_Error
  }
   
  @api show() {
    this.showModal = true;
  }

  @wire(getPricebooks, {})
  wiredResult(wireResult){
  const { data, error } = wireResult;
  this._wiredMarketData = wireResult;
    if (data) {
      this.prriceBookInfo = data;
    }
    if (error) {
      console.log(error);
      const toastEvent = new ShowToastEvent({
        title: this.label.RE_Error,
        message: error["body"]["message"],
            variant: "error"
    });
    this.dispatchEvent(toastEvent);
    }
  }

  refreshPricebooksHandler(event){
    if(event.detail){
      refreshApex(this._wiredMarketData);  
    }
  }

  handleRowAction(event) {
    const action = event.detail.action;
    const row = event.detail.row;
    switch (action.name) {
        case 'edit':
            this.priceBookId = row.Id;
            this.showEdit = true;
            this.showDetails = false;
            break;
        case 'details':
            this.priceBookId = row.Id;
            this.showEdit = false;
            this.showDetails = true;
            break;
        case 'delete':
            this.priceBookId = row.Id;
            this.showEdit = false;
            this.showDetails = false;
            deletePricebook({pricebookId: this.priceBookId})
            .then(() => {
              this.error = null;
              const event = new ShowToastEvent({
                title: this.label.RE_Success,
                message: this.label.RE_PricebookDeleted,
                    variant: "success"
            });
            this.dispatchEvent(event);
            return refreshApex(this._wiredMarketData);         
            })
            .catch(error => {
              this.error = error;
              const event = new ShowToastEvent({
                title: this.label.RE_Error,
                message: this.label.RE_PricebookNotDeleted +' '+ error["body"]["message"],
                variant: "error"
            });
            this.dispatchEvent(event);
            });
            break;
        }
    }
  createNew(){
    this.pricebookAdded = false;
    const showNew = this.template.querySelector("c-pricebook-new-modal");
    showNew.show();
  }

}