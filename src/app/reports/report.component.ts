import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ReportService } from '../services/report.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CustomDateComponent } from './customdate/custom-date.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TransformerManagerService } from '../services/transformerManager.service';
import * as _ from "lodash";
import { count } from 'console';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
    reportColumns: any;
    commonColumns = ["Transformer Id", "Deviceid", "DATE"]
    // physicalParams: any = ["Transformer Id", "Deviceid", "DATE", "Winding_Temperature", "Ambient_Temperature", "Humidity", "Oil_Temperature", "Oil_Level"];
    physicalParams: any;
    dataSource;
    typeFilter:any;
    data: any;
    filter: any = {};
    TapPositionFilter: any ={};
    transformerIds: any = [];
    paramFilter: string;
    timeFilter: string;
    idFilter: string;
    timeOptions: any = ['Today', 'Yesterday', 'This Week', 'This Month', 'Last Month', 'Custom'];
    parametersOption: any = ['All', 'Physical Parameters', "Electrical Parameters"];
    reportData : any = [];
    transformerParam: string;
    electricalParams = [];
    allParameters = [];
    public counter : any;
    public  TapPositionData : any = [];
    windingtemprature: any[] = [];
    gradient : any;
    kvarating:any;
     customeSelectedDate:any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    constructor(private reportService: ReportService, private matDialog: MatDialog,
        private ngxLoader: NgxUiLoaderService, private route: ActivatedRoute, private transMngSer: TransformerManagerService) { }

    async ngOnInit() {
        if (this.route.snapshot.queryParams['transformerId']) {
            this.transformerParam = this.route.snapshot.queryParams['transformerId'];
            this.ngxLoader.start();
            this.transformerIds = await this.getDdlData();
            if(this.transformerIds.length > 0) {
                this.idFilter = this.transformerParam;
                this.timeFilter = 'Today';
                this.filter.transformerId = _.cloneDeep(this.transformerParam).split('[')[0];
                this.filters('date', 'Today');
            } else {
                this.ngxLoader.stop();
            }

        }
        else {
            this.ngxLoader.start();
            this.transformerIds = await this.getDdlData();
            if(this.transformerIds.length > 0) {
                if(this.idFilter) {
                    this.transformerParam = this.idFilter;
                } else {
                    this.transformerParam = this.transformerIds[0];
                    this.idFilter = this.transformerParam;
                }

                this.filter.transformerId = _.cloneDeep(this.transformerParam).split('[')[0];
               // var todayFilter: any = {};
               // todayFilter = await this.filters('date', 'Today');
               // console.log('TODAY FILTER:', todayFilter);
               // this.filter = {...this.filter, ...todayFilter};
                this.timeFilter = 'Today';
                this.filters('date', 'Today');
            } else {
                this.ngxLoader.stop();
            }

        }



        // this.ngxLoader.start();
        // this.transformerId = await this.getDdlData();
        //console.log('TRANSFORMER ID:',this.transformerId[0]);
        // console.log('API IS CALLED NOW');
        // this.reportService.getReportData(this.filter).toPromise().then(async (response: any) => {
        //     this.reportColumns = this.report1Columns;
        //     this.ngxLoader.stop();
        //     console.log('Response:', response.reportData);
        //     this.dataSource = new MatTableDataSource(response.reportData);
        //     this.data = response.reportData;
        //     this.dataSource.paginator = this.paginator;
        //     this.dataSource.sort = this.sort;
        // })
    }

    getDdlData() {
        return new Promise((resolve, reject) => {
            this.transMngSer.getTransformerData(JSON.parse(localStorage.getItem('userData')).roleid, JSON.parse(localStorage.getItem('userData')).userid, 'x``z').toPromise().then((response: any) => {
                 if(response.data.length > 0)
                 {
                    resolve(response.data.map(a => a.serialnumber + "[" + a.sitename + "]"));
                 }
                resolve([]);
            });
        })
    }

    async filters(type: string, param: string) {

        try {
            console.log(type, param);
            // if(this.transformerParam) {
            //     this.filter.transformerId = param;
            // }
            if (type === 'transformerId') {
                this.idFilter = param;
                // this.filter = ;
                //this.filter.transformerId = param
                this.transformerParam = param;
                this.filter.transformerId = _.cloneDeep(this.transformerParam).split('[')[0];
                this.fetchReportData(this.filter);
            } else if (type === 'date') {
                this.timeFilter = param;
              //  if (Object.keys(this.filter).length > 0) {

                    var filter: any = await this.formatDate(param);
                    //this.filter = this.filter + filter;
                    if (filter.filter === 'This Week' || filter.filter === 'This Month' || filter.filter === 'Last Month') {
                        if (this.filter && this.filter.date) {
                            delete this.filter.date;
                        }
                        this.filter.startDate = filter.startDate;
                        this.filter.endDate = filter.endDate;
                        this.filter.filter = filter.filter;
                    }
                    else if (filter.filter === 'Today' || filter.filter === 'Yesterday') {
                        if (this.filter && this.filter.startDate && this.filter.endDate) {
                            delete this.filter.startDate;
                            delete this.filter.endDate;
                        }
                        this.filter.filter = filter.filter
                        this.filter.date = filter.date;
                        this.fetchReportData(this.filter);
                    }

                    else if (filter.filter === 'Custom') {
                        if (this.filter && this.filter.date) {
                            delete this.filter.date;
                        }
                        if(filter.startDate && filter.endDate) {
                            this.filter.startDate = filter.startDate;
                        this.filter.endDate = filter.endDate;
                        this.filter.filter = filter.filter;
                        }

                    }
                    if(filter.startDate && filter.endDate) {
                    this.fetchReportData(this.filter);
                    }
                    //this.filter = this.filter + '&' + `date=${date}` + '&' + `filter=${param}`;
              //  }


            } else if (type === 'parameters') {
                this.paramFilter = param;
                if (param === 'Physical Parameters') {
                    this.typeFilter = type;
                    this.reportColumns = this.physicalParams;
                    // this.dataSource = new MatTableDataSource(this.data);;
                    // this.dataSource.paginator = this.paginator;
                    // this.dataSource.sort = this.sort;
                }
                else if (param === 'All') {
                    this.reportColumns = this.allParameters;
                } else if (param === 'Electrical Parameters') {
                    this.reportColumns = this.electricalParams;
                } else {
                    this.reportColumns = this.allParameters;
                }
            }


        } catch (error) {
            console.log('ERROR:', error);
        }


    }

    formatDate(param) {
        return new Promise((resolve, reject) => {
            if (param === 'Today') {
                var d = new Date(),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;
                resolve({ 'date': [year, month, day].join('-'), 'filter': param })
                // return [year, month, day].join('-');
            } else if (param === 'Yesterday') {
                var d = new Date(),
                    month = '' + (d.getMonth() + 1),
                    day = '' + (d.getDate() - 1),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;
                resolve({ 'date': [year, month, day].join('-'), 'filter': param });
                //return [year, month, day].join('-');
            } else if (param === 'Last Month') {
                resolve({ 'startDate': moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'), 'endDate': moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'), 'filter': param })
                // resolve('&' + `startDate=${[year, month, day].join('-')}` + '&' + `endDate=${[year, month, 30].join('-')}` +  '&' + `filter=${param}`);
                // resolve({'startDate':[year, month, day].join('-'), 'endDate':[year, month, 30].join('-')});
            }
            else if (param === 'This Month') {
                resolve({ 'startDate': moment().startOf('month').format('YYYY-MM-DD'), 'endDate': moment().endOf('month').format('YYYY-MM-DD'), 'filter': param });
                // resolve('&' + `startDate=${[year, month, day].join('-')}` + '&' + `endDate=${[year, month, 30].join('-')}` +  '&' + `filter=${param}`);

            } else if (param === 'This Week') {
                resolve({ 'startDate': moment().startOf('week').format('YYYY-MM-DD'), 'endDate': moment().endOf('week').format('YYYY-MM-DD'), 'filter': param })
                //  resolve('&' + `startDate=${[year, month, startDate].join('-')}` + '&' + `endDate=${[year, month, day].join('-')}` +  '&' + `filter=${param}`);
            }
            else if (param === 'Custom') {
                const dialogConfig = new MatDialogConfig();
                let dialogRef = this.matDialog.open(CustomDateComponent, {
                    autoFocus: false,
                    height: '350px', width: '450px', data: { "details": "", "action": "Add",selectedDate:this.customeSelectedDate}
                });


                dialogRef.afterClosed().subscribe(value => {
                    console.log("Value=======",value);
                    this.customeSelectedDate=value;
                    resolve({ 'startDate': value.startDate, 'endDate': value.endDate, 'filter': param })
                });
            }
        })
    }

    async exportToPdf() {
        try {
            const widths = new Array(this.reportColumns.length).fill('1%');
            console.log('WIDTHS:', widths, this.reportColumns);
               this.reportData = await this.formatData(this.data);
               console.log('Report data length:', this.reportData[0].length)
               console.log('Formatted Data:', this.reportData[0]);
               console.log('DATA TO BIND:', this.reportData);
              var docDefinition = {
                  info: {
                      title: 'Transformer Report',
                    },
                  pageOrientation: 'landscape',
                  pageSize: '4A0',
                  content: [
                    {
                      table: {
                        // headers are automatically repeated if the table spans over multiple pages
                        // you can declare how many rows should be treated as headers
                        headerRows: 1,

                       // widths: [ '1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%', '1.5%' ],
                      width: widths,
                       //   body: [
                      //      "serialnumber", "DATE", "Winding_Temperature", "Ambient_Temperature", "Humidity", "Oil_Temperature", "Oil_Level", "R_Ph_N", "Y_Ph_N", "B_Ph_N", "Average_Voltage", "RY_Voltage", "YB_Voltage", "BR_Voltage", "L1", "L2", "L3", "LN", "I1", "I2", "I3", "R1", "R2", "R3", "R_Power_Factor", "Y_Power_Factor", "B_Power_Factor", "Avg_Power_Factor", "R_Active_Power", "Y_Active_Power", "B_Active_Power", "3_Phase_Active_Power", "R_Reactive_Power", "Y_Reactive_Power", "B_Reactive_Power", "3_Phase_Reactive_Power", "R_apparent_Power", "Y_apparent_Power", "B_apparent_Power", "3_Phase_Apparent_Power", "Fequency", "Energy_Meter_Temprature", "VR_THD", "VY_THD", "VB_THD", "IR_THD", "IY_THD", "IB_THD", "RP_THD", "YP_THD", "BP_THD", "System_kwh", "System_kvArh", "Deviceid", "Parameter1", "Parameter2", "Parameter3", "Parameter4", "Parameter5", "Parameter6", "Parameter7", "Parameter8", "Parameter9", "Parameter10" ],
                      //     [ "serialnumber", "DATE", "Winding_Temperature", "Ambient_Temperature", "Humidity", "Oil_Temperature", "Oil_Level", "R_Ph_N", "Y_Ph_N", "B_Ph_N", "Average_Voltage", "RY_Voltage", "YB_Voltage", "BR_Voltage", "L1", "L2", "L3", "LN", "I1", "I2", "I3", "R1", "R2", "R3", "R_Power_Factor", "Y_Power_Factor", "B_Power_Factor", "Avg_Power_Factor", "R_Active_Power", "Y_Active_Power", "B_Active_Power", "3_Phase_Active_Power", "R_Reactive_Power", "Y_Reactive_Power", "B_Reactive_Power", "3_Phase_Reactive_Power", "R_apparent_Power", "Y_apparent_Power", "B_apparent_Power", "3_Phase_Apparent_Power", "Fequency", "Energy_Meter_Temprature", "VR_THD", "VY_THD", "VB_THD", "IR_THD", "IY_THD", "IB_THD", "RP_THD", "YP_THD", "BP_THD", "System_kwh", "System_kvArh", "Deviceid", "Parameter1", "Parameter2", "Parameter3", "Parameter4", "Parameter5", "Parameter6", "Parameter7", "Parameter8", "Parameter9", "Parameter10" ],
                      //    // [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
                      //   ]
                      body: this.reportData,
                      }
                    }
                  ]
                };


                  this.ngxLoader.start();
                  pdfMake.createPdf(docDefinition).download();
                  this.ngxLoader.stop();


        } catch (error) {
          console.log('ERROR:', error);
        }
      // const widths = [ '1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%','1.5%', '1.5%','1.5%' ];

    }


    formatData(data) {
        return new Promise((resolve,reject) => {
            var dataArr = [];
            var elementCols = Object.keys(data[0]);
            var diffCols = elementCols.filter(x => !this.reportColumns.includes(x))
            dataArr.push(this.reportColumns);
            data.forEach(async element => {

                delete element['Parameter 2'];
                delete element['Parameter 3'];
                delete element['Parameter 4'];
                delete element['Parameter 5'];
                delete element['Parameter 6'];
                delete element['Parameter 7'];
                delete element['Parameter 8'];
                delete element['Parameter 9'];
                delete element['Parameter 10'];
                element = await this.deleteDynamicColumns(element, diffCols);
                let rowValues = [];
                this.reportColumns.forEach(col => {
                    rowValues.push(element[col]);
                });
              console.log('RE ARRANGED COLS:', rowValues );
               // delete element['Energy_Meter_Temprature'];
               //  dataArr.push(Object.values(element));
                dataArr.push(rowValues);
            });
             var finalArr = dataArr.filter(x => !Object.keys(x).includes(diffCols.join(",")));
            resolve(dataArr);
        })
    }

    deleteDynamicColumns(element, cols) {
        return new Promise((resolve,reject) => {
            cols.forEach(col => {
              delete element[col];
            });
            resolve(element);
        })
    }
    fetchReportData(filter) {
        this.ngxLoader.start();

        console.log("Filters Data",filter);
        this.windingtemprature = [];
        this.transMngSer.getTransformerDetails({transformerId: filter.transformerId, deletedFlag:'D'}).subscribe((response:any) => {
            this.gradient =  response.details.message.description[0]['kwhreading'];
          this.kvarating = response.details.message.description[0]['kvarating'];
         
        this.reportService.getReportData(filter).toPromise().then(async (response: any) => {
           // this.transformerIds = await this.getDdlData();
            this.allParameters = this.commonColumns.concat(response.physicalParams, response.electricalParam);
           
            this.physicalParams = this.commonColumns.concat(response.physicalParams);
          
            this.electricalParams = this.commonColumns.concat(response.electricalParam);
            if (this.paramFilter === 'Physical Parameters') {
                this.reportColumns = this.commonColumns.concat(response.physicalParams);
            } else if (this.paramFilter === 'Electrical Params') {
                if (response.electricalParam.length > 0) {
                    this.reportColumns = this.commonColumns.concat(response.electricalParam);
                } else {
                    this.reportColumns = [];
                }
            }
            else if (this.paramFilter === 'All') {
                this.reportColumns = this.commonColumns.concat(response.physicalParams, response.electricalParam);
            } else {
                if(response && response.physicalParams && response.electricalParam && response.reportData && response.reportData.length > 0) {
                    this.reportColumns = this.commonColumns.concat(response.physicalParams, response.electricalParam);
                    console.log("Winding Report Data",this.reportColumns);
                  

                } else {
                    this.reportColumns = [];
                }
            }
            
            if(response && response.reportData && response.reportData.length > 0) {
              this.windingtemprature = [];
                this.dataSource = new MatTableDataSource(response.reportData);
                
                   const columnLength =response.reportData.length;
                   for(let i=0; i<columnLength; i++){
                     if(response.reportData[i]['Oil_Temperature'] !== 0 ){
                        var addition: number = Number(response.reportData[i]['L1'])+Number(response.reportData[i]['L2'])+Number(response.reportData[i]['L3']);
                        var LoadPercentage: number = ((addition/3)/Number(this.kvarating))*100;
                        var windingTemprature: number =  Number(response.reportData[i]['Oil_Temperature'])+((this.gradient*LoadPercentage)/100);
                        this.windingtemprature.push(windingTemprature.toFixed(2));
                        
                     } else {
                        this.windingtemprature.push(0);
                     }
                   }
                   console.log("Addition",this.gradient);
                
                   console.log("Winding Temprature", this.windingtemprature);
                   console.log("DATA FOR REPORTS 123",response.reportData[0]['Humidity']);
                   var element = [];

                   let i = 0;
                   response.reportData.forEach(object => {
                    object.Winding_Temp_By_Cal = this.windingtemprature[i];
                    i++;
                    if(object.Buchholz_Status == 0){
                        object.Buchholz_Status = "Healthy";
                    }
                    if(object.PRV_Status == 0){
                        object.PRV_Status = "Healthy";
                    }
                    if(object.OSR_Status == 0) {
                        object.OSR_Status = "Healthy";
                    }
                     if(object.OTI_Status == 0){
                        object.OTI_Status = "Healthy";
                     }
                     if(object.WTI_Status == 0){
                        object.WTI_Status = "Healthy";
                     }
                     if(object.Buchholz_Status == 1){
                        object.Buchholz_Status = "Oprated";
                    }
                    if(object.PRV_Status == 1){
                        object.PRV_Status = "Oprated";
                    }
                    if(object.OSR_Status == 1) {
                        object.OSR_Status = "Oprated";
                    }
                     if(object.OTI_Status == 1){
                        object.OTI_Status = "Oprated";
                     }
                     if(object.WTI_Status == 1){
                        object.WTI_Status = "Oprated";
                     }
                  });
                  this.ngxLoader.stop();
                   console.log('REPORT DATA:', response.reportData);
                    this.data = response.reportData;
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    //Code for Tap_Position Counter by Rakesh Bhamare
                    let datalength = response.reportData.length;
                        let parameterlength = response.physicalParams.length;
                        let tap: string[] = [];
                        for(let i= 0 ; i<= parameterlength ; i++){
                            if(response.physicalParams[i] == 'Tap_Position' ){
                                for (let j = 1; j <= datalength; j++) {
                                    if(response.reportData[j-1]['Tap_Position'] != response.reportData[j]['Tap_Position']){
                                        tap.push(response.reportData[j-1]['Tap_Position']);
                                        this.counter = tap.length+1;
                                    } else {

                                    }
                                }
                            }  else {
                                this.counter = 0;
                            }
                        } //end
            } else {
                this.dataSource = [];
                this.data = [];
                this.ngxLoader.stop();
            }
        })
    })

    }

    generateDataArray(data: any) {
        var reportData: any = [];
        var rowdata: any;
        return new Promise((resolve, reject) => {
            data.forEach(element => {
                rowdata = Object.values(element);
            });
            resolve(rowdata);
        })
    }

    refreshData() {
        this.ngOnInit();
    }

}
