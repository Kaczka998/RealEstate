import { LightningElement, api, wire, track } from "lwc";
import getPricebookDetails from "@salesforce/apex/PricebookManagerController.getPricebookDetails";
import {refreshApex} from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import NAME_FIELD from '@salesforce/schema/Pricebook2.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Pricebook2.Description';
import IS_ACTIVE_FIELD from '@salesforce/schema/Pricebook2.IsActive';
import START_FIELD from '@salesforce/schema/Pricebook2.Start_Date__c';
import END_FIELD from '@salesforce/schema/Pricebook2.End_Date__c';

import RE_Product from "@salesforce/label/c.RE_Product";
import RE_Description from "@salesforce/label/c.RE_Description";
import RE_Edit from "@salesforce/label/c.RE_Edit";
import RE_Pricebook from "@salesforce/label/c.RE_Pricebook";
import RE_Cancel from "@salesforce/label/c.RE_Cancel";
import RE_AddProducts from "@salesforce/label/c.RE_AddProducts";
import RE_CancelAddProducts from "@salesforce/label/c.RE_CancelAddProducts";
import RE_CancelEditDetails from "@salesforce/label/c.RE_CancelEditDetails";
import RE_Save from "@salesforce/label/c.RE_Save";
import RE_Success from "@salesforce/label/c.RE_Success";
import RE_Error from "@salesforce/label/c.RE_Error";
import RE_PricebookEdited from "@salesforce/label/c.RE_PricebookEdited";
import RE_PricebookNotEdited from "@salesforce/label/c.RE_PricebookNotEdited";

const columns = [
    { label: RE_Product, fieldName: "Name", editable: false },
    { label: RE_Description, fieldName: "Description", editable: false }
  ];
  
export default class PricebookEditModal extends LightningElement {
  @api recordId;
  @api getIdFromParent;
  
  @track priceBook;
  
  label={
    RE_Edit,
    RE_Pricebook,
    RE_Cancel,
    RE_AddProducts,
    RE_CancelAddProducts,
    RE_CancelEditDetails,
    RE_Save,
    RE_Success,
    RE_Error,
    RE_PricebookEdited,
    RE_PricebookNotEdited
  }

  nameField = NAME_FIELD;
  descriptionField = DESCRIPTION_FIELD;
  startField = START_FIELD;
  endField = END_FIELD;
  activeField = IS_ACTIVE_FIELD;
  columns = columns;
  showFrame = false;
  editMode = false;
  showProducts = false;

  _wiredMarketData;

  get showModal() {
    return typeof this.getIdFromParent === 'undefined' ? false : true;
  }

  set ShowModal(value) {
    this.getIdFromParent = undefined;
  }

  set showProducts(value) {
    this.showProducts = value;
  }

  set editMode(value){
    this.editMode = value;
  }

  @wire(getPricebookDetails, { priceBookId: '$getIdFromParent'})
  wiredResult(wiredResult) {
    const { data, error } = wiredResult;
    this._wiredMarketData = wiredResult;
      if (data) {
        this.priceBook = data;
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

  handleRefreshProducts(event){  
    if(event.detail){ 
      this.template.querySelector("c-products-in-pricebook").refreshList();
    }
  }

  closeModal() {
    this.showProducts = false;
    this.editMode = false;
    this.ShowModal = false;
    const refreshEvent = new CustomEvent ("refresheditpricebooks",{detail: "refresh"});
      this.dispatchEvent(refreshEvent);
  }
  
  switchToEditMode(){
    this.editMode=true;
    this.showProducts = false;
  }

  switchToViewMode(){
    this.editMode=false;
  }
  
  handleSuccess(event){
    refreshApex(this._wiredMarketData);
    const toastEvent = new ShowToastEvent({
      title: this.label.RE_Success,
      message: this.label.RE_PricebookEdited,
      variant: "success"
    });
    this.dispatchEvent(toastEvent);
  }

  handleError(event){
    let message = event.detail.message;
    const toastEvent = new ShowToastEvent({
      title: this.label.RE_Error,
      message: this.label.RE_PricebookNotEdited+' '+ message,
      variant: "error"
    });
    this.dispatchEvent(toastEvent);
  }

  addProducts(){
        this.showProducts=true;
  }

  hideProducts(){
    this.showProducts=false;
  }

}