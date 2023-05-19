import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material'
//import { AddTransformerComponent } from '../add-transformer/add-transformer.component';
import { DeviceMasterService } from '../../services/device-master.service';
import { AddDeviceComponent } from '../add-device/add-device.component';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationDailogComponent } from 'src/app/confirmation-dailog/confirmation-dailog.component';


@Component({
  selector: 'app-device-master',
  templateUrl: './devicemaster.component.html',
  styleUrls: ['./devicemaster.component.css']
})

export class DeviceManagerComponent implements OnInit {
  subscription: Subscription;

  displayedColumns: string[] = ['deviceId', 'deviceModel', 'deviceCategory', 'firmwareversion','hardwareversion', 'passcode', 'actions'];
  dataSource;
  currentUserData = JSON.parse(localStorage.getItem('userData'));

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,  {static:true}) sort: MatSort;
  constructor(private matDialog: MatDialog, private deviceManagerSer: DeviceMasterService, private toastr: ToastrService,private ngxLoader: NgxUiLoaderService) {}

    ngOnInit() {
        this.getDeviceData();
    }

    getDeviceData() {
      this.ngxLoader.start();
      let deviceType = "trafo"
      if(this.currentUserData.dashboard == 2){
        deviceType = "ems";
      }
        this.deviceManagerSer.getDeviceData(deviceType).subscribe((response:any) => {
          console.log("Devicesss+++",response);
          if(response && response.code === '1')
          {
            this.ngxLoader.stop();
            this.dataSource =  new MatTableDataSource(response.deviceList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          else {
            this.ngxLoader.stop();
            this.toastr.error('Error Occurred');
          }
          
        }, (error) => {
          this.ngxLoader.stop();
          this.toastr.error('Error Occurred');
        });
      
      }

      async getInfo(deviceId: string) {
        let data = await this.getDeviceById(deviceId);
        data[0].action === 'Info';
        this.openDialog(data);
      }

      async editDevice(deviceId:string) {
          let data = await this.getDeviceById(deviceId);
          this.openDialog(data);
          
      }

      getDeviceById(deviceId: string) {
         ;
         let data = this.deviceManagerSer.getDeviceById({"deletedFlag": "D", "deviceId": deviceId}).toPromise().then((response :any)=> {
          console.log("Details Response:", response);
         
          return response.deviceDetails;
        })
        return data;
        
       
      }

      public doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
      }

      deleteData(deviceId: string){
        let dialogRef = this.matDialog.open(ConfirmationDailogComponent);
        dialogRef.afterClosed().subscribe((response) => {
          if (response) {
            this.deviceManagerSer.deleteData({"deletedFlag": "D", "deviceId": deviceId}).subscribe((response:any) =>{
              console.log('Response of Delete data:', response);
              this.getDeviceData();
             })
          }
        });
       
      }

      openDialog(details: any) {
        var action:'';
        let dialogRef:any;
        const dialogConfig = new MatDialogConfig();
        console.log('EDIT DETAILS:', details);
        dialogConfig.data = "some data";
       if(details === "Add") {
         dialogRef = this.matDialog.open(AddDeviceComponent,{autoFocus: false,
          height:'600px',width:'650px', data: {"details":"", "action":"Add"}}  );
       }
       else if (details.action && details.action === 'Info') {
        dialogRef = this.matDialog.open(AddDeviceComponent,{autoFocus: false,
          maxHeight: '100vh', data: {"details":details, "action":"Info"}}  )
       }
       else {
         dialogRef = this.matDialog.open(AddDeviceComponent,{autoFocus: false,
          height:'600px',width:'650px', data: {"details":details, "action":"Edit"}}  );
          
       }
       
      dialogRef.afterClosed().subscribe((response) => {
        console.log('Close MODAL', response);
        if(response && response === "Add") {
          this.toastr.success('Device Added Successfully');
        }
        else if(response && response === 'Edit') {
          this.toastr.success('Device Updated Successfully');
        }
        
        
        this.ngOnInit();
      })
    }
}