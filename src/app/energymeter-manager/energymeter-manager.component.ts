import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material'
import { AddUpdateEnergymeterComponent } from 'src/app/energymeter-manager/add-update-energymeter/add-update-energymeter.component';
import { TransformerManagerService } from 'src/app/services/transformerManager.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationDailogComponent } from 'src/app/confirmation-dailog/confirmation-dailog.component';

@Component({
  selector: 'app-energymeter-manager',
  templateUrl: './energymeter-manager.component.html',
  styleUrls: ['./energymeter-manager.component.scss']
})
export class EnergymeterManagerComponent implements OnInit {

  displayedColumns: string[] = ['serialnumber','sitename', 'deviceId', 'actions', 'state'];
  dataSource;
  deviceMaster: any;
  roleID = JSON.parse(localStorage.getItem('userData')).roleid;

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,  {static:true}) sort: MatSort;

  constructor(private matDialog: MatDialog, private transformerMangSer: TransformerManagerService, private ngxLoader: NgxUiLoaderService) {}

  ngOnInit() {
   this.getEnergyMeterData();
   console.log(JSON.parse(localStorage.getItem('userData')));

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
}

getEnergyMeterData() {
    this.ngxLoader.start();
    this.transformerMangSer.getEnergyMeterData(JSON.parse(localStorage.getItem('userData')).roleid,JSON.parse(localStorage.getItem('userData')).userid,'transformerManager').subscribe((response:any) => {
      if(response && response.hasOwnProperty('code') && response.code === '1')
      {
        this.ngxLoader.stop();
        console.log(response);
        this.dataSource =  new MatTableDataSource(response.data);;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else{
        this.ngxLoader.stop();
      }

    })

  }

  editData(serialnumber: string) {
    this.ngxLoader.start();
    console.log('serial number:', serialnumber);
    this.transformerMangSer.getEnergyMeterDetails({energyMeterId: serialnumber, deletedFlag:'D'}).subscribe((response:any) => {
      console.log('TransformerDetails:', response);
      this.ngxLoader.stop();
      this.openDialog(response.details.message);
    })
  }


  deleteData(serialnumber:string) {
    console.log('SERIAL NUMBER:', serialnumber);
    this.ngxLoader.start();
    let dialogRef = this.matDialog.open(ConfirmationDailogComponent);
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.transformerMangSer.deleteTransformer({'action': 'delete','data':{'deleteFlag': 'D', 'serialnumber': serialnumber}}).subscribe((response:any) => {
          this.ngxLoader.stop();
          console.log('Response:', response);
          this.getEnergyMeterData();
        })
      }
    });

  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  openDialog(transformerData? :any) {
    let action: string;

    let dialogRef: any;
    if(!transformerData) {
      transformerData='Add';

    }
    this.ngxLoader.start();
    this.transformerMangSer.getDeviceDdl().toPromise().then((response: any) => {
      console.log('Response:', response);
      console.log("data++++",transformerData)
      this.ngxLoader.stop();
      if(transformerData && transformerData !== "Add"){
        response.data.deviceId.push(transformerData.description[0].deviceId);
      }
      this.deviceMaster = response.data

      const dialogConfig = new MatDialogConfig();
    dialogConfig.data = "some data";
    dialogRef = this.matDialog.open(AddUpdateEnergymeterComponent,{autoFocus: false, height:'600px',width:'650px'
    , data: {'transformerData' : transformerData, 'dropDownData' : this.deviceMaster}}  );

    dialogRef.afterClosed().subscribe((response) => {
      console.log('Close MODAL');

      this.getEnergyMeterData();
    })

    })


  }

}

