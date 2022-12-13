import { LightningElement, api } from "lwc";
import saveImageAsDefault from "@salesforce/apex/RE_setDefaultController.saveImageAsDefault";
import deleteImage from "@salesforce/apex/RE_photoGalleryController.deleteImage";
import { ShowToastEvent } from "lightning/platformShowToastEvent";


export default class FilePreviewCard extends LightningElement {
  @api file;
  @api recordId;
  @api thumbnail;

  get iconName() {
    if (this.file.Extension) {
      if (this.file.Extension === "pdf") {
        return "doctype:pdf";
      }
      if (this.file.Extension === "ppt") {
        return "doctype:ppt";
      }
      if (this.file.Extension === "xls") {
        return "doctype:excel";
      }
      if (this.file.Extension === "csv") {
        return "doctype:csv";
      }
      if (this.file.Extension === "txt") {
        return "doctype:txt";
      }
      if (this.file.Extension === "xml") {
        return "doctype:xml";
      }
      if (this.file.Extension === "doc") {
        return "doctype:word";
      }
      if (this.file.Extension === "zip") {
        return "doctype:zip";
      }
      if (this.file.Extension === "rtf") {
        return "doctype:rtf";
      }
      if (this.file.Extension === "psd") {
        return "doctype:psd";
      }
      if (this.file.Extension === "html") {
        return "doctype:html";
      }
      if (this.file.Extension === "gdoc") {
        return "doctype:gdoc";
      }
    }
    return "doctype:image";
  }

  filePreview() {
    console.log("###Click");
    const showPreview = this.template.querySelector("c-file-preview-modal");
    showPreview.show();
  }

  setDefault() {
    console.log("###default" + this.file.ContentDocumentId + "record"+ this.recordId);
    if(this.file.Title != null){

        saveImageAsDefault({recordId: this.recordId, contentDocumentId: this.file.ContentDocumentId, versionId: this.file.Id})
        .then(data => {
           
        if(data){
            const evt = new ShowToastEvent({
                title: 'Main photo has been changed',
                message: 'Please refresh the page to see the result. If you don\'t see the changes, wait a minute and refresh the page again.',
                variant: 'success',
            });
        this.dispatchEvent(evt);
        }
        else{
            const evt = new ShowToastEvent({
                title: 'Something went wrong',
                message: 'Main photo could not be changed. Please refresh the page and try again.',
                variant: 'error',
            });
            this.dispatchEvent(evt);
        }
        });   
     }
  }

  fileDelete(){
    console.log( this.file.ContentDocumentId);
    deleteImage({imageId: this.file.ContentDocumentId})
    .then(()=>{
      console.log('udało sie');
   })
   .catch((error)=>{
       console.log(error);
});

}
}