import { LightningElement, api, track} from 'lwc';
import getPropertiesData from '@salesforce/apex/RE_SearchEngineController.getPropertiesData';
import getProductsCount from '@salesforce/apex/RE_SearchEngineController.getProductsCount';
import FORM_FACTOR from '@salesforce/client/formFactor';

import RE_Search from '@salesforce/label/c.RE_Search';
import RE_Clear from '@salesforce/label/c.RE_Clear';
import RE_ShowFilters from '@salesforce/label/c.RE_ShowFilters';
import RE_HideFilters from '@salesforce/label/c.RE_HideFilters';
import RE_NoRecords from '@salesforce/label/c.RE_NoRecords';
import RE_EnterPropName from '@salesforce/label/c.RE_EnterPropName';
import RE_EnterLocation from '@salesforce/label/c.RE_EnterLocation';
import RE_PropertyAreaMin from '@salesforce/label/c.RE_PropertyAreaMin';
import RE_PropertyAreaMax from '@salesforce/label/c.RE_PropertyAreaMax';
import RE_GaragingSpaces from '@salesforce/label/c.RE_GaragingSpaces';
import RE_Bathroom from '@salesforce/label/c.RE_Bathroom';
import RE_RoomsHelp from '@salesforce/label/c.RE_RoomsHelp';
import RE_Rooms from '@salesforce/label/c.RE_Rooms';
import RE_SwimmingPool from '@salesforce/label/c.RE_SwimmingPool';
import RE_SwimmingPoolHelp from '@salesforce/label/c.RE_SwimmingPoolHelp';
import RE_GaragingSpacesHelp from '@salesforce/label/c.RE_GaragingSpacesHelp';
import RE_Furnished from '@salesforce/label/c.RE_Furnished';

const bathroomOptions = [
    { label: 'Bath', value: 'Bath' },
    { label: 'Shower', value: 'Shower' },
    { label: 'Hydro Massage', value: 'Hydro Massage' },
    { label: 'Sauna', value: 'Sauna' },
    { label: 'Jacuzzi', value: 'Jacuzzi' }
  ];

//   const recordType = 'Apartments';

export default class PropertiesSearchC extends LightningElement {
    @api propertyList;
    @api productsCount;
    @track bathroom;
    @track bathroomOptions = bathroomOptions;
    @track allValues = [];
    paramsWrapper;
    @api recordType;
    searchKey ='';
    areaMin;
    areaMax;
    noRooms;
    garageMin;
    isSwimming;
    isFurnished;
    searchCity;
    filters = false;
    pageNumber = 1;
    limitV = 5;
    isLoading=false;
    offsetV = 0;
    label={
        RE_Search,
        RE_Clear,
        RE_ShowFilters,
        RE_HideFilters,
        RE_NoRecords,
        RE_EnterPropName,
        RE_EnterLocation,
        RE_PropertyAreaMin,
        RE_PropertyAreaMax,
        RE_GaragingSpaces,
        RE_Bathroom,
        RE_RoomsHelp,
        RE_Rooms,
        RE_SwimmingPool,
        RE_SwimmingPoolHelp,
        RE_GaragingSpacesHelp,
        RE_Furnished
    }

    get isMobile() {
        return FORM_FACTOR === 'Small';
    }

    connectedCallback(){
        this.updatePage();
        getProductsCount({recordType: this.recordType})
        .then(result=>{
            this.productsCount=result;
        })
        .catch(error => {
            console.log(error);
            const toastEvent = new ShowToastEvent({
                title: this.label.RE_Error,
                message: 'propertyCount ' + error["body"]["message"],
                variant: "error"
              });
                this.dispatchEvent(toastEvent);
        })  
    }

    handelSearchKey(event){
        this.searchKey = event.target.value;
    }

    handelAreaMin(event){
        this.areaMin = event.target.value;
    }

    handelAreaMax(event){
        this.areaMax = event.target.value;
    }

    handelIsSwimming(event){
        this.isSwimming = !this.isSwimming;
    }

    handelSearchCity(event){
        this.searchCity = event.target.value;
    }

    handleChange(event){
        if(!this.allValues.includes(event.target.value)){
            this.allValues.push(event.target.value);
        }
    }

    handleRemove(event){
        const valueRemoved = event.target.name;
        this.allValues.splice(this.allValues.indexOf(valueRemoved), 1);
    }

    handelIsFurnished(event){
        this.isFurnished = !this.isFurnished;
    }

    handelGarageMin(event){
        this.garageMin = event.target.value;
    }

    handelNoRooms(event){
        this.noRooms = event.target.value;
    }

    handelClear(event){
        this.clearAll();
    }

    clearAll(){
        this.searchKey = '';
        this.areaMin = null;
        this.areaMax = null;
        this.isSwimming = false;
        this.bathroom = '';
        this.isFurnished = false;
        this.garageMin = null;
        this.allValues = [];
        this.noRooms = null;
        this.searchCity ='';
    }

    handelShowFilters(){
        this.filters=true;
    }

    handelHideFilters(){
        this.filters=false;
        this.clearAll();
    }

    SearchHandler(){
        this.isLoading = true;
        this.updatePage();
    }

    updatePage(){
        console.log(this.pageNumber);

        this.offsetV = (this.pageNumber-1) * this.limitV;
        console.log(this.offsetV);
        console.log(this.limitV);
        this.paramsWrapper = {
            name: this.searchKey,
            areaMin: this.areaMin,
            areaMax: this.areaMax,
            isSwimming: this.isSwimming,
            bathroom: this.allValues,
            isFurnished: this.isFurnished,
            garageSpaces: this.garageMin,
            noRooms: this.noRooms,
            location: this.searchCity,
            limitV: this.limitV,
            offsetV: this.offsetV
        }
        getPropertiesData({ wrapper: this.paramsWrapper, recordType: this.recordType})
        .then(result => {
                this.propertyList = result;
                this.isLoading = false;

        })
        .catch( error=>{
            this.propertyList = null;
            this.isLoading = false;
        });
     }
 
    first() {
        this.pageNumber = 1;
        this.updatePage()
        if(this.isMobile){
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } 
    }
 
    last() {
        const num = this.productsCount.substring(32, 34);
        this.pageNumber = Math.ceil(num/5);
        this.updatePage()
        if(this.isMobile){
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } 
    }

    previous() {
        this.pageNumber = Math.max(1, this.pageNumber - 1)
        this.updatePage()
        if(this.isMobile){
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } 
    }

    next() {
        this.pageNumber = Math.min(Math.ceil((this.propertyList.length-4)/5)+this.pageNumber, this.pageNumber + 1)
        this.updatePage();
        if(this.isMobile){
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } 
    } 
}