import { LightningElement, api, track } from 'lwc';
import getPropertiesData from '@salesforce/apex/RE_SearchEngineController.getPropertiesData';

import RE_Search from '@salesforce/label/c.RE_Search';
import RE_Clear from '@salesforce/label/c.RE_Clear';
import RE_ShowFilters from '@salesforce/label/c.RE_ShowFilters';
import RE_HideFilters from '@salesforce/label/c.RE_HideFilters';
import RE_NoRecords from '@salesforce/label/c.RE_NoRecords';
import RE_EnterPropName from '@salesforce/label/c.RE_EnterPropName';
import RE_EnterLocation from '@salesforce/label/c.RE_EnterLocation';
import RE_PropertyAreaMin from '@salesforce/label/c.RE_PropertyAreaMin';
import RE_PropertyAreaMax from '@salesforce/label/c.RE_PropertyAreaMax';
import RE_ParkingSpaces from '@salesforce/label/c.RE_ParkingSpaces';
import RE_ParkingSpacesHelp from '@salesforce/label/c.RE_ParkingSpacesHelp';
import RE_Toilet from '@salesforce/label/c.RE_Toilet';
import RE_Additional from '@salesforce/label/c.RE_Additional';
import RE_Kitchen from '@salesforce/label/c.RE_Kitchen';
import RE_KitchenHelp from '@salesforce/label/c.RE_KitchenHelp';
import RE_Facilities from '@salesforce/label/c.RE_Facilities';
import RE_FacilitiesHelp from '@salesforce/label/c.RE_FacilitiesHelp';

const toiletOptions = [
    { label: 'Shared Toilet', value: 'Shared toilet' },
    { label: 'Internal Toilet', value: 'Internal toilet' }
  ];

const additionalOptions = [
    { label: 'Conference Room', value: 'Conference_Room' },
    { label: 'Callboxes', value: 'Callboxes' }
  ];

  const recordType = 'Premises';

export default class PropertiesSearchB extends LightningElement {
    @api propertyList;
    @api productsCount;
    @track additional;
    @track additionalOptions = additionalOptions;
    @track allValues = [];
    paramsWrapper;
    recordType = recordType;
    searchKey='';
    searchCity;
    areaMin;
    areaMax;
    isKitchen=false;
    toilet;
    isFacility=false;
    parkMin;
    filters = false;
    pageNumber = 1;
    limitV = 5;
    offsetV = 0;
    isLoading=false;
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
        RE_ParkingSpaces,
        RE_ParkingSpacesHelp,
        RE_Toilet,
        RE_Additional,
        RE_Kitchen,
        RE_KitchenHelp,
        RE_Facilities,
        RE_FacilitiesHelp
    }

    toiletOptions = toiletOptions;

    connectedCallback(){
        this.updatePage();
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

    handelIsKitchen(event){
        this.isKitchen = !this.isKitchen;
    }

    handleToiletChange(event){
        this.toilet = event.target.value;
    }

    handelIsFacility(event){
        this.isFacility = !this.isFacility;
    }

    handelParkMin(event){
        this.parkMin = event.target.value;
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

    handelClear(event){
        this.clearAll();
    }

    clearAll(){
        this.searchKey = '';
        this.areaMin = null;
        this.areaMax = null;
        this.isKitchen = false;
        this.toilet = '';
        this.isFacility = false;
        this.parkMin = null;
        this.additional = '';
        this.allValues = [];
        this.searchCity = '';
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
        this.offsetV = (this.pageNumber-1) * this.limitV;
        this.paramsWrapper = {
            name: this.searchKey,
            areaMin: this.areaMin,
            areaMax: this.areaMax,
            isKitchen: this.isKitchen,
            isFacilities: this.isFacility,
            parkingSpaces: this.parkMin,
            additional: this.allValues,
            toilet: this.toilet,
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
    }

    last() {
        this.pageNumber = Math.ceil((this.propertyList.length-4)/5)+1;
        this.updatePage()
    }

    previous() {
        this.pageNumber = Math.max(1, this.pageNumber - 1)
        this.updatePage()
    }

    next() {
        this.pageNumber = Math.min(Math.ceil((this.propertyList.length-4)/5)+1, this.pageNumber + 1)
        this.updatePage()
      }
}