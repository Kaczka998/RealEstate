import { LightningElement, api } from "lwc";

export default class FilePreviewCard extends LightningElement {
  @api file;
  @api recordId;
  @api thumbnail;

 
  filePreview() {
    console.log("###Click");
    const showPreview = this.template.querySelector("c-product-photo-gallery-preview-modal");
    showPreview.show();
  }

}