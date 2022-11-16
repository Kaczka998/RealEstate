import { LightningElement, track, wire, api } from 'lwc';
import getPricebookEntriess from "@salesforce/apex/RE_productController.getPricebookEntriess";
import updatePrice from "@salesforce/apex/RE_productController.updatePrice";
import applyToSelected from "@salesforce/apex/RE_productController.applyToSelected";
import deleteSelected from "@salesforce/apex/RE_productController.deleteSelected";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';

import RE_Name from "@salesforce/label/c.RE_Name";
import RE_Price from "@salesforce/label/c.RE_Price";
import RE_Discount from "@salesforce/label/c.RE_Discount";
import RE_Increment from "@salesforce/label/c.RE_Increment";
import RE_DeleteSelected from "@salesforce/label/c.RE_DeleteSelected";
import RE_InputPlaceholder from "@salesforce/label/c.RE_InputPlaceholder";
import RE_Error from "@salesforce/label/c.RE_Error";
import RE_Success from "@salesforce/label/c.RE_Success";
import RE_PriceChanged from "@salesforce/label/c.RE_PriceChanged";
import RE_PriceNotChanged from "@salesforce/label/c.RE_PriceNotChanged";

const columns = [
    { label: RE_Name, fieldName: "Name", editable: false },
    { label: RE_Price, fieldName: "UnitPrice",type: "currency", typeAttributes:{currencyCode: "USD"}, editable: true  }
  ];
  
export default class ProductsInPricebookListEdit extends LightningElement {
  @api pricebookId;;
    
  @track products;
  @track percentValue;
  @track cellValue;
  @track entryId;

  label={
    RE_Discount,
    RE_Increment,
    RE_DeleteSelected,
    RE_InputPlaceholder,
    RE_Success,
    RE_Error,
    RE_PriceChanged,
    RE_PriceNotChanged
  }

  _wiredMarketData;

  selectedProducts=[];

  columns=columns;

  @wire(getPricebookEntriess, { pricebookId: '$pricebookId'})
  wiredResult(wireResult) {
    const { data, error } = wireResult;
    this._wiredMarketData = wireResult;
    if (data) { 
      this.products = data;
    }
    else if (error) {
      console.log(error);
      const toastEvent = new ShowToastEvent({
        title: this.label.RE_Error,
        message: error["body"]["message"],
        variant: "error"
      });
        this.dispatchEvent(toastEvent);
    }
  }

  handleSelect(event){
    const selectedRows = event.detail.selectedRows;
    this.selectedProducts=[];
    for(let i=0; i< selectedRows.length; i++){
      this.selectedProducts.push(selectedRows[i]);
    }          
  }

  handlePercentChange(event){
    this.percentValue = event.target.value;
  }

  handleSave(event) {
    const drafts = [];
    const indexes = [];
    const draftedProducts =[];
    for(let i=0; i<event.target.draftValues.length;i++){
      drafts.push(event.target.draftValues[i].UnitPrice);
      const id = event.target.draftValues[i].id;
      const productIndex = id.substring(4, 5);
      indexes.push(productIndex);      
    }
    for(let i=0; i<indexes.length; i++){
      const p = this.products[indexes[i]].Id;
      draftedProducts.push(p);        
    }
    updatePrice({entries: draftedProducts, prices: drafts})
      .then(() => {
        this.error = null;
        const event = new ShowToastEvent({
          title: this.label.RE_Success,
          message: this.label.RE_PriceChanged,
          variant: "success"
        });
          this.dispatchEvent(event);
      return refreshApex(this._wiredMarketData);         
      })
      .catch(error => {
        this.error = error;
        let message= error.body.fieldErrors.UnitPrice[0].message;
        console.log(error);
        const event = new ShowToastEvent({
          title: this.label.RE_Error,
          message: this.label.RE_PriceNotChanged+' '+ message,
          variant: "error"
        });
          this.dispatchEvent(event);
      });
      return refreshApex(this._wiredMarketData);         
  }

  discount(){
    applyToSelected({products: this.selectedProducts, priceChange: this.percentValue, action: 'discount'})
    .then(() => {
      this.error = null;
      const event = new ShowToastEvent({
        title: this.label.RE_Success,
        message: this.label.RE_PriceChanged,
        variant: "success"
      });
        this.dispatchEvent(event);
      return refreshApex(this._wiredMarketData);               
    })
    .catch(error => {
      this.error = error;
      const event = new ShowToastEvent({
        title: this.label.RE_Error,
        message: this.label.RE_PriceNotChanged+' '+ error,
        variant: "error"
      });
        this.dispatchEvent(event);
      });
  }

  increment(){
    applyToSelected({products: this.selectedProducts, priceChange: this.percentValue, action: 'increment'})
    .then(data => {
      this.error = null;
      const event = new ShowToastEvent({
        title: this.label.RE_Success,
        message: this.label.RE_PriceChanged,
        variant: "success"
      });
        this.dispatchEvent(event);
      return refreshApex(this._wiredMarketData);                   
    })
    .catch(error => {
      this.error = error;
      const event = new ShowToastEvent({
        title: this.label.RE_Error,
        message: this.label.RE_PriceNotChanged+' '+ error,
        variant: "error"
      });
        this.dispatchEvent(event);
      });
  }

  deleteProducts(){
    deleteSelected({products: this.selectedProducts})
    .then(() => {
      this.error = null;
      const event = new ShowToastEvent({
        title: this.label.RE_Success,
        message: this.label.RE_PriceChanged,
        variant: "success"
      });
        this.dispatchEvent(event);
      return refreshApex(this._wiredMarketData);                   
    })
    .catch(error => {
      this.error = error;
      const event = new ShowToastEvent({
        title: this.label.RE_Error,
        message: this.label.RE_PriceNotChanged+' '+ error,
        variant: "error"
      });
        this.dispatchEvent(event);
    });
  }
}