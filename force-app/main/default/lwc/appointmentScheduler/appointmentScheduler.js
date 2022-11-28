import { LightningElement,track,wire, api } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getModalHeader from '@salesforce/apex/RE_FullCalendarController.getModalHeader';
import getAgentInfo from '@salesforce/apex/RE_FullCalendarController.getAgentInfo';
import getPropertyDetails from '@salesforce/apex/RE_FullCalendarController.getPropertyDetails';
import getEvents from '@salesforce/apex/RE_FullCalendarController.getEvents';
import createEvent from '@salesforce/apex/RE_FullCalendarController.createEvent';
import Id from '@salesforce/user/Id';

import RE_Cancel from "@salesforce/label/c.RE_Cancel";
import RE_Save from "@salesforce/label/c.RE_Save";
import RE_Schedule from "@salesforce/label/c.RE_Schedule";

export default class AppointmentScheduler extends LightningElement {
    @api recordId;
    showModal = false;
    editMode = true;
    dateValue = '';
    @track hoursValue;
    @track modalHeader='';
    selectedOption = '';
    @track property = {};
    @track today;
    @track apartmentAgent = '';
    @track displayedHours = [];
    userId = Id;
    occupiedHours = [];
    enableSubmit = false;

    label={
      RE_Cancel,
      RE_Schedule,
      RE_Save
    }

    @api show() {
      this.showModal = true;
    }
    closeModal() {
      this.showModal = false;
    }

    allHours = [
      "9:00-9:30",
      "9:30-10:00",
      "10:00-10:30",
      "10:30-11:00",
      "11:00-11:30",
      "11:30-12:00",
      "12:00-12:30",
      "12:30-13:00",
      "13:00-13:30",
      "13:30-14:00",
      "14:00-14:30",
      "14:30-15:00"
    ];

    get options() {
      return [
          { label: '9:00 - 9:30', value: 'option1' },
          { label: '9:30 - 10:00', value: 'option2' },
          { label: '10:00 - 10:30', value: 'option3' },
          { label: '10:30 - 11:00', value: 'option4' },
          { label: '11:00 - 11:30', value: 'option5' },
          { label: '11:30 - 12:00', value: 'option6' },
          { label: '12:00 - 12:30', value: 'option7' },
          { label: '12:30 - 13:00', value: 'option8' },
          { label: '13:00 - 13:30', value: 'option9' },
          { label: '13:30 - 14:00', value: 'option10' },
          { label: '14:00 - 14:30', value: 'option11' },
          { label: '14:30 - 15:00', value: 'option12' },
          { label: '15:00 - 15:30', value: 'option13' },
          { label: '15:30 - 16:00', value: 'option14' },
          { label: '16:00 - 16:30', value: 'option15' },
          { label: '16:30 - 17:00', value: 'option16' },
      ];
  }

  get todaysDate() {
    var today = new Date();
    return today.toISOString();
  }

  connectedCallback(){
     getAgentInfo({recordId: this.recordId})
      .then((data) => {
        let name = data.FirstName;
        let surname = data.LastName;
        this.apartmentAgent = name + ' '+ surname;
      })
      .catch((error) => {
        const evt = new ShowToastEvent({
          title: RE_Error_Occured,
          message: error["body"]["message"],
          variant: "error"
        });
        this.dispatchEvent(evt);
      });
    getModalHeader({recordId: this.recordId})
    .then(result=>{
        this.modalHeader=result;
    })
    .catch(error => {
        const toastEvent = new ShowToastEvent({
            title: this.label.RE_Error,
            message: error["body"]["message"],
            variant: "error"
          });
            this.dispatchEvent(toastEvent);
    });
    getPropertyDetails({recordId: this.recordId})
    .then(data => {
      this.property = data;
      this.error = null;
    })
    .catch(error => {
      this.error = error;

    }); 
}

  switchToEditMode(){
    this.editMode=true;
  }

  switchToViewMode(){
    this.editMode=false;
  }

  handleChange(event){
    this.selectedOption = event.detail.value;
    this.hoursValue = event.target.options.find(opt => opt.value === event.detail.value).label;
    this.enableSubmit = true;
  }

  handleDateChange(event){
    this.dateValue = event.target.value;

    const newDate = new Date();
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const d = newDate.getDate();

    if (new Date(this.dateValue) <= newDate) {
      this.displayedHours = [];
      this.enableSubmit = false;
      return;
    }

    if (
      new Date(this.dateValue).getDay() == 0 ||
      new Date(this.dateValue).getDay() == 6
    ) {
      this.displayedHours = [];
      return;
    }
    this.getOccupiedHours();
  }

  
  get getHours() {
    return this.displayedHours;
  }
  
  handleSave(event){
    createEvent({option: this.selectedOption, selectedDate: this.dateValue, propertyId: this.recordId, customerId: this.userId})
    .then(data => {
      this.error = null;
    })
    .catch(error => {
      this.error = error;

    });
    }

    getOccupiedHours() {
      this.occupiedHours = [];
      getEvents({recordId: this.recordId})
        .then((data) => {  
          for (let record of data) {
            if (this.dateValue == record.StartDateTime.split("T")[0]) {
              for (let h of this.allHours) {
                if (
                  record.EndDateTime.split("T")[1]
                    .replace(":00.000Z", "")
                    .replace(":", "")
                    .replace("09", "9") == h.split("-")[1].replace(":", "") &&
                  record.StartDateTime.split("T")[1]
                    .replace(":00.000Z", "")
                    .replace(":", "")
                    .replace("09", "9") == h.split("-")[0].replace(":", "")
                ) {
                  this.occupiedHours.push(h);
                }
              }
            }
          }
  
          this.filterHours();
        })
  
        .catch((error) => {
          const evt = new ShowToastEvent({
            title: RE_Error_Occured,
            message: error["body"]["message"],
            variant: "error"
          });
          this.dispatchEvent(evt);
        });
    }

    filterHours() {
      let temp = [];
      for (let h of this.allHours) {
        let pushHour = true;
        for (let oHour of this.occupiedHours) {
          if (oHour == h) {
            pushHour = false;
          }
        }
        if (pushHour) {
          temp.push({ label: h, value: h });
        }
      }
      this.displayedHours = temp;
    }

    }