import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DeviceMasterService } from '../../services/device-master.service';
import { Observable, Subject } from 'rxjs';
import { FileUploader  } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';


var URL = 'https://api.trafobola.com/api/v1/crc';
var URL2 = 'https://api.trafobola.com/api/v1/firmware';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {
  private subject = new Subject<any>();
  deviceForm: FormGroup
   readOnly: Boolean
   isEdit = false;
  formData:any= {};
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image'
  });
  public firmwareUploader: FileUploader = new FileUploader({
    url: URL2,
    itemAlias: 'image'
  });
DeviceID=this.data.details.deviceId;
  constructor( public dialogRef: MatDialogRef<AddDeviceComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
               private formBuilder: FormBuilder, private toastr: ToastrService,private deviceMasterSer: DeviceMasterService){ }

  ngOnInit() {

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
  
      this.toastr.success('File successfully uploaded!');
    };
    this.firmwareUploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.firmwareUploader.onCompleteItem = (item: any, status: any) => {
  
      this.toastr.success('File successfully uploaded!');
    };
    console.log('MODAL DATA:',this.data)
   
    this.createForm();
  }

  
  createForm() {
   // let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.deviceForm = this.formBuilder.group({
      'deviceId': [null, [Validators.required]],
      'deviceModel': [null, [Validators.required]],
      'deviceCategory': [null, [Validators.required]],
      'firmwareversion':[null, [Validators.required]],
      'hardwareversion':[null, [Validators.required]],
      /* 'version': [null, [Validators.required]], */
      'passcode': [null, [Validators.required]],
      
    });

    if(this.data && this.data.details && this.data.details.length > 0) {
     
    
      console.log('IS EDIT:', this.readOnly, this.data.action);
      this.deviceForm.patchValue(this.data.details[0]);
      if(this.data.action && (this.data.action === 'Info' || this.data.action === 'Edit')) {
         this.readOnly = true;
      } else {
        this.readOnly = false;
      }
    }
  }

  close(action) {
    this.dialogRef.close(action);
    this.dialogRef.afterClosed().subscribe(value => {
      console.log(`Dialog sent: ${JSON.stringify(this.formData)}`); 
    });

    console.log('CLOSE');
  }

  public errorHandling = (control: string, error: string) => {
    console.log('Control:',this.deviceForm.controls[control])
    console.log( this.deviceForm.controls[control].hasError(error));
    return this.deviceForm.controls[control].hasError(error)
  }
  DownloadCRC(deviceid){
    this.deviceMasterSer.downloadCrc(deviceid).subscribe(data=>{
      
      console.log("ksjfjksdbsdfjsd",data)
        let downloadURL = window.URL.createObjectURL(data);
        saveAs(downloadURL);
    
      })
  }
  downloadFrimware(deviceid){
    this.deviceMasterSer.downloadFrimware(deviceid).subscribe(data=>{
      console.log("ksjfjksdbsdfjsd",data)
      let downloadURL = window.URL.createObjectURL(data);
      saveAs(downloadURL);
      })
  }
  onSubmit(deviceValues) {
    let result:any;
    console.log('Device Values:', deviceValues);
    deviceValues.deletedFlag = "A",
    deviceValues.createdBy = JSON.parse(localStorage.getItem('userData')).userid;
  var today = new Date();
  var date='';
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  date = yyyy + '-' + mm + '-' + dd;

  deviceValues.createdDate = Date.now().toString();
 // var metaData = {'deletedFlag':'A','createdBy':'Rahil', 'createdDate':date};
  deviceValues.createdDate  = date;
 // console.log('METADATA:', {...deviceValues,...metaData});
  //this.formData.action = "Add";
  this.formData = deviceValues;
  
  console.log('FORM DATA:', this.formData);
   if(this.data.action === 'Add')
   {
    this.deviceMasterSer.saveDeviceData(this.formData).subscribe((response) => {
      console.log("RESPONSE:", response);
      this.close('Add')
  }) 
  } else if(this.data.action === 'Edit') {
    this.deviceMasterSer.updateDeviceData(this.formData).toPromise().then((response) => {
      console.log("RESPONSE:", response);
      this.close('Edit')
  })
  }
    

  }

 
  
}
