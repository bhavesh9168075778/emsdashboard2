import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
//import { AddTransformerComponent } from '../add-transformer/add-transformer.component';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationDailogComponent } from 'src/app/confirmation-dailog/confirmation-dailog.component';
import { ReportService } from '../services/report.service';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit {
    columns: any = ["Time Stamp", "Transformer Id", "Status", "Threshold Value", "Actual Value"];
    parameterType: any = ['All','Oil Temperature', 'Oil Level', 'Winding Temperature', 'I Unbalance', 'V Unbalance', 'Low Volt', 'High Volt', 'Low Power Factor', 'Overload', 'Underload']
    reportColumns:any = [];
    transformerIds: any = [];
    status: any = [];
    alertLogs: any = [];
    idFilter: any;
    transformerData: any = [];
    paramFilter: any;
    dataSource;
    filteredData: any = [];
    public paramSelect = 'All';
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    constructor(private reportSer: ReportService, public dialogRef: MatDialogRef<AlertComponent>){}
    ngOnInit( ) {
       this.reportSer.getAlertsData(JSON.parse(localStorage.getItem('userData')).roleid,JSON.parse(localStorage.getItem('userData')).userid).toPromise().then(async (res:any) => {
           console.log('ALERT BOX DATA:', res);
           this.paramFilter = this.paramSelect;
          //  this.parameterType = res.physicalParams;
          this.alertLogs = res.reportData ;
           this.transformerIds = res.reportData.map(a => a["Transformer Id"]);
           this.transformerIds = [...new Set(this.transformerIds)]; 
           this.status = res.reportData.map(a => a["Status"]);
           console.log('FILTERS:', this.transformerIds, this.status);
           this.reportColumns = this.columns;
           this.dataSource = new MatTableDataSource(res.reportData);
           //this.data = res.reportData;
           this.dataSource.paginator = this.paginator;
           this.dataSource.sort = this.sort;
       })
    }


    closeModal() {
      this.dialogRef.close();
    }
    

    filters(type:string, param:string) {
       this.filteredData  =  this.alertLogs;
      if(type === 'transformerId') {
        if(param !== 'All' && this.paramFilter !== 'All'){
          this.idFilter = param;
          this.filteredData = this.alertLogs.filter(x => x["Transformer Id"] === param);
          this.transformerData = this.filteredData;
          this.filteredData = this.filteredData.filter(x => x['Status'] === param);
        } else if(param !== 'All' && this.paramFilter === 'All') {
          this.filteredData = this.alertLogs.filter(x => x["Transformer Id"] === param);
          this.transformerData = this.filteredData;
         
        } else {
          this.filteredData = this.alertLogs;
          this.transformerData = this.filteredData;
        }
        
      } 
      else if(type === 'param') {
        if(param !== 'All') {
          this.paramFilter = param;
          this.paramSelect = param;
          // if(this.idFilter) {
          //   // this.filteredData = this.alertLogs.filter(x => x["Transformer Id"] === this.idFilter);
          //   this.filteredData = this.transformerData;
          //   this.filteredData = this.filteredData.filter(x => x['Status'] === param);
          // } else {
            this.filteredData = this.transformerData.filter(x => x['Status'] === param)
          // }
         
        } else if(param === 'All') {
          this.filteredData = this.transformerData;
        }
      }

      this.reportColumns = this.columns;
           this.dataSource = new MatTableDataSource(this.filteredData);
           //this.data = res.reportData;
           this.dataSource.paginator = this.paginator;
           this.dataSource.sort = this.sort;
    }
}