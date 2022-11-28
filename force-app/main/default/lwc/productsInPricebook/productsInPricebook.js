import { LightningElement, track, wire, api } from 'lwc';
import getPricebookEntriess from "@salesforce/apex/RE_productController.getPricebookEntriess";
import {refreshApex} from '@salesforce/apex';

import RE_Name from "@salesforce/label/c.RE_Name";
import RE_Price from "@salesforce/label/c.RE_Price";
import RE_ProductsInPricebook from "@salesforce/label/c.RE_ProductsInPricebook";
import RE_Error from "@salesforce/label/c.RE_Error";

const columns = [
    { label: RE_Name, fieldName: "Name", editable: false },
    { label: RE_Price, fieldName: "UnitPrice", type: "currency", typeAttributes:{currencyCode: "USD"}, editable: false }
  ];

export default class ProductsInPricebook extends LightningElement {
  @api pricebookId;;
    
  @track products;

  _wiredResults;

  label={
    RE_ProductsInPricebook,
    RE_Error
  }

  columns=columns;

  @api refreshList() {
    return refreshApex(this._wiredResults);    
  }

  @wire(getPricebookEntriess, { pricebookId: '$pricebookId'})
  wiredResult(result) {
    const {data,error} = result;
    this._wiredResults = result;
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
}