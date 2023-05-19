import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ReportService } from '../.../../../services/report.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CustomDateComponent } from '../.../../customdate/custom-date.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TransformerManagerService } from '../.../../../services/transformerManager.service';
import { DashboardService } from '../.../../../services/dashboard.service';
import * as _ from "lodash";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-hvlvdiffreport',
  templateUrl: './hvlvdiffreport.component.html',
  styleUrls: ['./hvlvdiffreport.component.scss']
})
export class HvlvdiffreportComponent implements OnInit {
  
    reportColumns: any;
    commonColumns = ["Transformer Id", "Deviceid", "DATE"]
    report1Columns: any = ["Transformer Id", "Deviceid", "DATE", "Winding_Temperature","Winding_Temp_By_Cal", "Ambient_Temperature", "Humidity", "Oil_Temperature", "Oil_Level", "R_Ph_N", "Y_Ph_N", "B_Ph_N", "Average_Voltage", "RY_Voltage", "YB_Voltage", "BR_Voltage", "L1", "L2", "L3", "LN", "I1", "I2", "I3", "R1", "R2", "R3", "R_Power_Factor", "Y_Power_Factor", "B_Power_Factor", "Avg_Power_Factor", "R_Active_Power", "Y_Active_Power", "B_Active_Power", "3_Phase_Active_Power", "R_Reactive_Power", "Y_Reactive_Power", "B_Reactive_Power", "3_Phase_Reactive_Power", "R_apparent_Power", "Y_apparent_Power", "B_apparent_Power", "3_Phase_Apparent_Power", "Fequency", "Device_Temperature", "VR_THD", "VY_THD", "VB_THD", "IR_THD", "IY_THD", "IB_THD", "RP_THD", "YP_THD", "BP_THD", "System_kwh", "System_kvArh"];
    // physicalParams: any = ["Transformer Id", "Deviceid", "DATE", "Winding_Temperature", "Ambient_Temperature", "Humidity", "Oil_Temperature", "Oil_Level"];
    physicalParams: any;
    dataSource;
    typeFilter:any;
    data: any;
    filter: any = {};
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
    windingtemprature: any[] = [];
    customeSelectedDate:any;
    gradient : Number;
    heading:any =[];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    constructor(private reportService: ReportService, private matDialog: MatDialog,
        private ngxLoader: NgxUiLoaderService, private route: ActivatedRoute, private _dashboardService: DashboardService,private transMngSer: TransformerManagerService) { }

    async ngOnInit() {
        if (this.route.snapshot.queryParams['transformerId']) {
            this.transformerParam = this.route.snapshot.queryParams['transformerId'];
            this.ngxLoader.start();
            this.transformerIds = await this.getDdlData();
            console.log("TransformerIds",this.transformerIds);
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
            this.transMngSer.getTransformerData(JSON.parse(localStorage.getItem('userData')).roleid, JSON.parse(localStorage.getItem('userData')).userid, 'report').toPromise().then((response: any) => {
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
        this.dataSource = null;
        console.log('kasdjasduhaiudbijnijnoaskdoansoddjoasd',filter);
        this._dashboardService.getHvLvDiff(filter).subscribe((response: any) => {
          console.log("Downtime Data",response);
          this.heading =Object.keys(response.data[0]);
          console.log("Heading Data",this.heading);
          this.dataSource = new MatTableDataSource(response.data);
         
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.ngxLoader.stop();

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