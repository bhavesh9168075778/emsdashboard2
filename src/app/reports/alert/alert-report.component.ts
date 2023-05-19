import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ReportService } from '../../services/report.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as moment from 'moment';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomDateComponent } from '../customdate/custom-date.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TransformerManagerService } from 'src/app/services/transformerManager.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-alert-report',
    templateUrl: './alert-report.component.html',
    styleUrls: ['./alert-report.component.css']
})
export class AlertReportComponent implements OnInit {
    parameters : any = ['All','Oil Temperature', 'Oil Level', 'Winding Temperature', 'I Unbalance', 'V Unbalance', 'Under Voltage', 'Over Voltage', 'Low Power Factor', 'Overload', 'Underload']
    reportColumns : any;
    report1Columns: any = ["Time Stamp", "Transformer Id", "Status", "Threshold Value", "Actual Value"];
  //  physicalParams: any = ["serialnumber", "DATE", "Winding_Temperature", "Ambient_Temperature", "Humidity", "Oil_Temperature", "Oil_Level"];
    public parameter: any;
    reportData: any = [];
    statusFilterData:any= [];
    dataSource;
    data: any;
    filter: any = {};
    transformerId: any = [];
    sitename: any = [];
    selectedId: string;
    selectedSite: any;
    paramFilter: string;
    timeFilter: string;
    idFilter: string;
    siteFilter: string;
    city: string;
    location: string;
    reportDataArr: any = [];
    ddlData: any = [];
    timeOptions: any = ['Today', 'Yesterday', 'This Week', 'This Month', 'Last Month', 'Custom'];
    parametersOption: any = ['All', 'Physical Parameters', 'Electrical Basic Parameters', 'Demand'];
    customeSelectedDate:any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    constructor(private reportService: ReportService, private matDialog: MatDialog,  private ngxLoader: NgxUiLoaderService, private transMngSer: TransformerManagerService) { }

    async ngOnInit() {
        this.ngxLoader.start();
        this.transformerId = await this.getDdlData();
        this.sitename = this.ddlData.map(a=>a.sitename);
        this.selectedId = this.transformerId[0];
        if(this.transformerId.length > 0) {
            this.timeFilter = 'Today';
            this.filters('date', 'Today');
            this.filter.transformerId = this.transformerId[0].split('[')[0];
        } 

       this.selectedSite = this.ddlData.filter(a => a.serialnumber === this.selectedId);
       this.city = this.selectedSite[0].City;
       this.location = this.selectedSite[0].Location;
       this.selectedSite = this.selectedSite[0].sitename;
      
       console.log('selected site:', this.selectedSite);
        // this.city = '';
        // this.location = '';
        // if(this.transformerId.length > 0) {
        //     this.reportService.getAlertReportData({'transformerId':this.transformerId[0]}).toPromise().then(async (response: any) => {
        //         this.reportColumns = this.report1Columns;
        //         this.ngxLoader.stop();
        //         if(response && response.reportData && response.reportData.length > 0) {
        //             this.city = response.reportData[0].City;
        //             this.location = response.reportData[0].Location;
        //         }
        //         console.log('Response:', response.reportData, this.transformerId.value);
                
        //         this.dataSource = new MatTableDataSource(response.reportData);;
        //         this.dataSource.paginator = this.paginator;
        //         this.dataSource.sort = this.sort;
        //     })
        // }
        // else {
        //     this.ngxLoader.stop();
        // }
       
    }

    getDistinctSite() {
        return new Promise((resolve, reject) => {
            this.reportService.getDistinctSite().toPromise().then((response: any) => {
                console.log(response);
                resolve(response.data);
            })
        })
    }

    getDdlData() {
        return new Promise((resolve, reject) => {
            this.transMngSer.getTransformerData(JSON.parse(localStorage.getItem('userData')).roleid,JSON.parse(localStorage.getItem('userData')).userid, 'report').toPromise().then((response: any) => {
                console.log('DDL:', response.data);
                if(response.data.length > 0) {
                    this.ddlData = response.data;
                    resolve(response.data.map(a => a.serialnumber + "[" + a.sitename + "]"));
                } else {
                    resolve([]);
                }
               
            });
        })
    }

    filterbyParam(param) {
        if(param === 'All') {
            this.statusFilterData = this.data;
        }
        else {
            this.statusFilterData = this.data;
            this.statusFilterData = this.statusFilterData.filter(x =>x.Status === param);
        }
       
        this.dataSource = new MatTableDataSource(this.statusFilterData);
       // this.data = response.reportData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

   async filters(type: string, param: string) {
        console.log('PARAMS:', this.parameter);
        if (type === 'transformerId') {
            this.idFilter = param;
           // this.filter = ;
            //this.filter.transformerId = param 
            this.filter.transformerId = param.split('[')[0];
            this.selectedId = param;
            this.selectedSite = this.ddlData.filter(a => a.serialnumber === this.selectedId.split('[')[0]);
            this.city = this.selectedSite[0].City;
            this.location = this.selectedSite[0].Location;
            this.selectedSite = this.selectedSite[0].sitename;
            this.fetchReportData(this.filter);
        } else if (type === 'date') {
            this.timeFilter = param;
          //  if (Object.keys(this.filter).length > 0) {
               
                var filter: any  = await this.formatDate(param);

                 console.log('DATE FILTERS:', filter);
                 //this.filter = this.filter + filter;
                 if(filter.filter === 'This Week' || filter.filter === 'This Month' || filter.filter === 'Last Month') {
                     if(this.filter && this.filter.date)
                     {
                         delete this.filter.date;
                     }
                     this.filter.startDate = filter.startDate;
                     this.filter.endDate = filter.endDate;
                     this.filter.filter = filter.filter;
                 }
                 else if(filter.filter === 'Today' || filter.filter === 'Yesterday') {
                     if(this.filter && this.filter.startDate && this.filter.endDate)
                     {
                        delete this.filter.startDate;
                        delete this.filter.endDate;
                     }
                     
                     this.filter.date = filter.date;
                     this.filter.filter = filter.filter;
                     this.fetchReportData(this.filter);
                 }
                 else if(filter.filter === 'Custom') {
                    if(this.filter && this.filter.date)
                    {
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
         //   }
           

        } else if(type === 'sitename') {
            this.siteFilter  = param;
            this.filter.sitename = param;
            const findValues = this.ddlData.filter(a => a.sitename === param);
            this.city = findValues[0].City;
            this.location = findValues[0].Location;
       
           
            this.fetchReportData(this.filter);
        }
       
        console.log('FIILTERS:', this.filter);

       

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
                resolve({'date':[year, month, day].join('-'), 'filter': param})
               // return [year, month, day].join('-');
            } else if(param === 'Yesterday') {
                var d = new Date(),
                    month = '' + (d.getMonth() + 1),
                    day = '' + (d.getDate() - 1),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;
                resolve({'date':[year, month, day].join('-'), 'filter':param});
                //return [year, month, day].join('-');
            } else if(param === 'Last Month') {
                resolve({ 'startDate': moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'), 'endDate': moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'), 'filter': param })
            }
            else if(param === 'This Month') {
                resolve({ 'startDate': moment().startOf('month').format('YYYY-MM-DD'), 'endDate': moment().endOf('month').format('YYYY-MM-DD'), 'filter': param });
            } else if(param === 'This Week') {
                resolve({ 'startDate': moment().startOf('week').format('YYYY-MM-DD'), 'endDate': moment().endOf('week').format('YYYY-MM-DD'), 'filter': param })
            }

            else if(param === 'Custom') {
                console.log('Custom filter:', param)
                const dialogConfig = new MatDialogConfig();
                let dialogRef = this.matDialog.open(CustomDateComponent, {autoFocus: false,
                    height:'350px',width:'450px', data: {"details":"", "action":"Add",selectedDate:this.customeSelectedDate}});
               

                    dialogRef.afterClosed().subscribe(value => {
                        this.customeSelectedDate=value;
                         resolve({'startDate':value.startDate, 'endDate':value.endDate, 'filter':param})
                      });
            }
        })
    }

    async exportToPdf() {

        
        this.reportData = await this.formatData(this.data);
        console.log('Formatted Data:', this.reportData);
        var docDefinition = {
            info: {
                title: 'Transformer Report',
              },
            pageOrientation: 'portait',
            pageSize: 'A0',
            content: [
              {
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers
                  headerRows: 1,
                 
                  widths: [ '10%', '10%', '10%', '10%', '10%'],
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
        
           // const documentDefinition = { content: 'This is for testing.' };
            pdfMake.createPdf(docDefinition).download();


    }

    formatData(data) {
        return new Promise((resolve,reject) => {
            var dataArr = [];
            dataArr.push(this.reportColumns);
            data.forEach(element => {
                delete element.City;
                delete element.Location;
                dataArr.push(Object.values(element));
            });

            resolve(dataArr);
        })
    }

    fetchReportData(filter) {
        this.ngxLoader.start();
        // this.city = '';
        // this.location = ''; 
        this.reportService.getAlertReportData(filter).toPromise().then(async (response: any) => {
            this.transformerId = await this.getDdlData();
            console.log('Response:', response.reportData, this.transformerId.value);
            this.reportColumns = this.report1Columns;
            // if(response && response.reportData && response.reportData.length > 0) {
            //     this.city = response.reportData[0].City;
            //     this.location = response.reportData[0].Location;
            // }

            
            this.ngxLoader.stop();
            this.dataSource = new MatTableDataSource(response.reportData);
            this.data = response.reportData;
            //this.parameters = response.physicalParams,
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
    }

    generateDataArray(data: any) {
        var reportData : any = [];
        var rowdata: any;
        return new Promise((resolve, reject) => {
            data.forEach(element => {
              rowdata = Object.values(element);
              console.log('ROW DATA:', rowdata);
              
                
                
            });

            resolve(rowdata);
        })
    }

    refreshData() {
        this.ngOnInit();
    }
}