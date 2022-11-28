import { LightningElement, wire, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getUrlsFromContentDistribution from "@salesforce/apex/RE_photoGalleryController.getUrlsFromContentDistribution";

export default class RE_ProductPhotoGallery extends LightningElement {
    @track fileList;
    @api recordId;
    @track files = [];

    @wire(getUrlsFromContentDistribution, { recordId: "$recordId" })
    fileResponse(value) {
      this.wiredActivities = value;
      const { data, error } = value;
      this.fileList = "";
      this.files = [];
      if (data) {
        this.fileList = data;
        for (let i = 0; i < this.fileList.length; i++) {
          let file = {
            Id: this.fileList[i].Id,
            Name: this.fileList[i].Name,
            Extension: this.fileList[i].FileExtension,
            ContentDocumentId: this.fileList[i].ContentDocumentId,
            ContentDocument: this.fileList[i].ContentDocument,
            CreatedDate: this.fileList[i].CreatedDate,
            Url: this.fileList[i].ContentDownloadUrl
          };
          this.files.push(file);
        }
      } else if (error) {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error loading Files",
            message: error.body.message,
            variant: "error"
          })
        );
      }
    }
  }