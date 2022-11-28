import { LightningElement, api } from "lwc";

export default class PreviewFileModal extends LightningElement {
  @api recordId;
  @api thumbnail;
  @api file;
  showModal = false;
  @api show() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

}