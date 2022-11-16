import { LightningElement, api } from "lwc";
import saveImageAsDefault from "@salesforce/apex/RE_setDefaultController.saveImageAsDefault";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class PreviewFileModal extends LightningElement {
  @api url;
  @api fileExtension;
  @api recordId;
  @api thumbnail;
  @api file;
  showFrame = false;
  showModal = false;
  @api show() {
    console.log("###showFrame : " + this.fileExtension);
    if (this.fileExtension === "pdf") this.showFrame = true;
    else this.showFrame = false;
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  setDefault() {
    console.log("###default" + this.thumbnail + "record"+ this.recordId);
    if(this.file.Title != null){

        saveImageAsDefault({recordId: this.recordId, url: this.thumbnail})
        .then(data => {          
        if(data){
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success!",
              message: "Main Photo Of Product Saved Successfully.",
              variant: "success"
            })
          );
        }
        else{
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!",
              message: "Main Photo Of Product Not Saved.",
              variant: "success"
            })
          );
        }
        });   
     }
  }
}