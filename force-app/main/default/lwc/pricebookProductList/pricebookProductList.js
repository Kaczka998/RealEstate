import { LightningElement, track, wire, api } from 'lwc';
import getProducts from "@salesforce/apex/RE_productController.getProducts";
import addProductsToPricebook from "@salesforce/apex/PricebookManagerController.addProductsToPricebook";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import RE_RecordType from "@salesforce/label/c.RE_RecordType";
import RE_AddSelected from "@salesforce/label/c.RE_AddSelected";
import RE_All from "@salesforce/label/c.RE_All";
import RE_Business_Premises from "@salesforce/label/c.RE_Business_Premises";
import RE_Apartments from "@salesforce/label/c.RE_Apartments";
import RE_Name from "@salesforce/label/c.RE_Name";
import RE_Description from "@salesforce/label/c.RE_Description";
import RE_ProductsAdded from "@salesforce/label/c.RE_ProductsAdded";
import RE_Success from "@salesforce/label/c.RE_Success";
import RE_Error from "@salesforce/label/c.RE_Error";
import RE_ProductsNotAdded from "@salesforce/label/c.RE_ProductsNotAdded";
import RE_AvailableProducts from "@salesforce/label/c.RE_AvailableProducts";

const columns = [
    { label: RE_Name, fieldName: "Name", editable: false },
    { label: RE_Description, fieldName: "Description", editable: false }
  ];

const options = [
    { label: RE_All, value: "" },
    { label: RE_Business_Premises, value: "0127Q000000EtwF" },
    { label: RE_Apartments, value: "0127Q000000EtwK" }
  ];

export default class PricebookProductList extends LightningElement {
    @api pricebookId;
    @api recodTypeValue = "";
    
    @track products;

    refreshProducts;

    label={
      RE_AvailableProducts,
      RE_RecordType,
      RE_AddSelected,
      RE_ProductsAdded,
      RE_Success,
      RE_Error,
      RE_ProductsNotAdded
    }

    columns=columns;
    options = options;

  @wire(getProducts, { recordType: "$recodTypeValue", pricebookId: '$pricebookId'})
  wiredResult({ data, error }) {
    if (data) {
      this.products = data;
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

  handleTypeChange(event) {
    this.recodTypeValue = event.detail.value;
  }

  handleclick(){
    var el = this.template.querySelector('lightning-datatable');
    var selected = el.getSelectedRows();
    const arr=[];
    selected.forEach(element => {
        arr.push(element.Id);
    });
    addProductsToPricebook({pricebookId: this.pricebookId, productId: JSON.stringify(arr)})
    .then(data => {
      this.error = null;
      const event = new ShowToastEvent({
        title: this.label.RE_Success,
        message: this.label.RE_ProductsAdded,
        variant: "success"
      });
      this.dispatchEvent(event);

    this.refreshProducts = true;
      const refreshEvent = new CustomEvent ("refreshproducts",{detail: this.refreshProducts});
      this.dispatchEvent(refreshEvent);
    })
    .catch(error => {
      this.error = error;
      let message = '';
      if(error.body.fieldErrors.length>0){
        message = error.body.fieldErrors[0].message;
      }
      if(error.body.pageErrors.length>0){
        message = error.body.pageErrors[0].message;
      }
      const event = new ShowToastEvent({
        title: this.label.RE_Error,
        message: this.label.RE_ProductsNotAdded + message,
        variant: "error",
        mode: "dismissible"
      });
      this.dispatchEvent(event);
    });
  }
}