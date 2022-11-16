import { LightningElement, api, wire, track } from "lwc";
import getPricebookDetails from "@salesforce/apex/PricebookManagerController.getPricebookDetails";

import RE_Pricebook from "@salesforce/label/c.RE_Pricebook";
import RE_Details from "@salesforce/label/c.RE_Details";
import RE_Cancel from "@salesforce/label/c.RE_Cancel";
import RE_Success from "@salesforce/label/c.RE_Success";
import RE_Error from "@salesforce/label/c.RE_Error";

export default class PricebookDetailsModal extends LightningElement {
  @api recordId;
  @api getIdFromParent;
  
  @track priceBook;

  showFrame = false;
  showEdit = true;

  label = {
    RE_Pricebook,
    RE_Details,
    RE_Cancel,
    RE_Error,
    RE_Success
  }

  get showModal() {
    return typeof this.getIdFromParent === 'undefined' ? false : true;
  }
  
  set ShowModal(value) {
    this.getIdFromParent = undefined;
  }

  @wire(getPricebookDetails, { priceBookId: '$getIdFromParent'})
  wiredResult({ data, error }) {
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

  closeModal() {
    this.ShowModal = false;
  }

  addProducts(){
    this.showProducts=true;
  }
}