import { LightningElement, api, wire } from 'lwc';
import getProductImage from "@salesforce/apex/RE_photoGalleryController.getProductImage";


export default class DefaultPhoto extends LightningElement {
    @api recordId;
    @api photoUrl;

   imageUrl = '';

    @wire(getProductImage, { pId: '$recordId' })
  wiredResult({ data, error }) {
    if (data) {
      this.imageUrl = data;
      if(this.imageUrl==null||this.imageUrl=='undefined'){
        this.imageUrl='/resource/1669234517000/RE_NoImage';
      }
    }
    if (error) {
      console.log(error);
    }
  }

}