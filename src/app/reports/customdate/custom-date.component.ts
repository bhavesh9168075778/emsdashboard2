import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from 'moment';

@Component({
    selector: "app-custome-date",
    templateUrl: './custom-date.component.html',
    styleUrls: ['./custom-date.component.css']
  })
  export class CustomDateComponent {
    fromdate: Date;
    todate : Date;
    constructor( public dialogRef: MatDialogRef<CustomDateComponent>,@Inject(MAT_DIALOG_DATA) private data: any,){}

    ngOnInit() {
      console.log("data=======",this.data)
      if(this.data && this.data.selectedDate){
        this.fromdate=this.data.selectedDate.startDate;
        this.todate=this.data.selectedDate.endDate;
      }
    }

    apply() {
      if(this.fromdate && this.todate)
      {
        console.log('Selected Dates:', moment(this.fromdate).format('YYYY-MM-DD'),moment(this.todate).format('YYYY-MM-DD'));
        //this.dialogRef.close({'startDate':this.fromdate.toISOString().slice(0,10), 'endDate':this.todate.toISOString().slice(0,10) });
        this.dialogRef.close({'startDate':moment(this.fromdate).format('YYYY-MM-DD'), 'endDate':moment(this.todate).format('YYYY-MM-DD') });
      }
      else {
    //     var d = new Date(),
    //     month = '' + d.getMonth(),
    //     day = '' + d.getDate(),
    //     year = d.getFullYear();

    // if (month.length < 2)
    //     month = '0' + month;
    // if (day.length < 2)
    //     day = '0' + day;
  //  resolve({'date':[year, month, day].join('-'), 'filter': param})
        this.dialogRef.close({'startDate':null,'endDate':null })
      }
      }
      
  }