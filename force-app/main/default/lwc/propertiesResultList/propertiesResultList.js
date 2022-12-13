import { LightningElement, api, track } from 'lwc';

export default class PropertiesResultList extends LightningElement {

@api propertyList;
@api listSize;

@track pageData = [];

pageNumber = 0;
allData=[];

    connectedCallback(){
        this.updatePage(); 
    }

    updatePage(){
        this.allData = [];
        this.propertyList.forEach(element => 
            this.allData.push(element)
            );
       let records = Math.min(this.allData.length, 5);
       this.pageData = this.allData.slice(this.pageNumber, records);
       for(let i=0; i<2; i++){
        console.log(this.pageData[i]);
       }
    }

    first() {
        this.pageNumber = 0;
        this.updatePage()
      }

    last() {
        this.pageNumber = Math.floor((this.propertyList.length-4)/5)
        this.updatePage()
    }
    previous() {
        this.pageNumber = Math.max(0, this.pageNumber - 1)
        this.updatePage()
    }
    next() {
        this.pageNumber = Math.min(Math.floor((this.allData.length-4)/5), this.pageNumber + 1)
        this.updatePage()
      }
}