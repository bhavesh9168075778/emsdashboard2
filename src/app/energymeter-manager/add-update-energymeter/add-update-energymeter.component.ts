
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TransformerManagerService } from 'src/app/services/transformerManager.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var jQuery: any;
function hello() {
  var kva   = (<HTMLInputElement>document.getElementById("kva")).value;
 var vlv   = (<HTMLInputElement>document.getElementById("vlv")).value;
 var a = (parseInt(kva)*1000);
 var b =(1.732*parseInt(vlv));
 var c=a/b;
 let RatedValue = c.toFixed(2);
 (<HTMLInputElement>document.getElementById("rtl")).value=String(RatedValue);

}

@Component({
  selector: 'app-add-update-energymeter',
  templateUrl: './add-update-energymeter.component.html',
  styleUrls: ['./add-update-energymeter.component.scss']
})
export class AddUpdateEnergymeterComponent implements OnInit {

  descriptionForm: FormGroup
  parameters: FormGroup
  alertParameter: FormGroup
  healthindexParameter:FormGroup
  altertNotification: FormGroup
  dtmuDevice: FormGroup
  formData:any= {};
  uploadedFiles: Array < File > ;
  //selected = '1234';
  DeviceCategory = ['Power', 'Solar', 'Distribution'];
  DeviceId = ['K001H20','K001H22','K001H22'];
  DeviceModel = ['A10', 'A20', 'A30'];
  Frequency = ['Minutes','Days','Hours'];
  frequencyError: any;
  frequencyMsg: any = {};
  deviceMaster: any;

  action: string;
  userId = JSON.parse(localStorage.getItem('userData')).roleid;
  constructor( public dialogRef: MatDialogRef<AddUpdateEnergymeterComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
               private formBuilder: FormBuilder, private http: HttpClient,private toastr: ToastrService, private transformerMangService: TransformerManagerService, private ngxLoader: NgxUiLoaderService){ }

  async ngOnInit() {
 
    console.log('DATA:',this.data)
    if(this.data.transformerData === 'Add') {

           console.log('CONDITION SATISFIED');
           this.action = "Add";
           this.deviceMaster = this.data.dropDownData;
           console.log('DEVICE MASTER:', this.deviceMaster);
           this.createForm();


   } else {
     this.action = 'Update';
    this.deviceMaster = this.data.dropDownData;
    this.createForm();
   }


  }


  async createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.descriptionForm = this.formBuilder.group({
      'meterDescription': [null, [Validators.required]],
      'meterName': [null, [Validators.required]],
      'meterModel': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'installationDate': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'manufacturer': '',
      'meterSerialNumber':'',
      'ctratio':'',
      'ptratio':'',
      'assetDescription':'',
      'assetName':'',
      'assetModel':'',
      'assetManufacturer':'',
      'assetSerialNumber':'',
      'assetRatedCurrent':''
    });

    this.parameters = this.formBuilder.group({
      'pf': [true],
      'L1':[true],
      'L2':[true],
      'L3':[true],
      'activepower':[true],
      'reactivepower':[true],
      'apparentpower':[true],
      'kvArhI':[true],
      'kvArhE':[true],
      'kvAh':[true],
      'kwh':[true],
      'latestkwh':[true]
    })

    this.alertParameter = this.formBuilder.group({
      'apLowPowerfactor': [0],
      'apLowPowerfactorEmail':false,
      'apLowPowerfactorSms':false,
      'apLowPowerfactorFrequency':[1],
      'apLowPowerfactorTime':'Minutes',
    })

    this.altertNotification = this.formBuilder.group({
      'email1':[null, [Validators.required, Validators.email]],
      'email2': [null, [Validators.email]],
      'email3': [null, [Validators.email]],
      'email4': [null, [Validators.email]],
      'email5': [null, [Validators.email]],
      'phoneNo1': [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      'phoneNo2': [null, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      'phoneNo3': [null, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      'phoneNo4': [null, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      'phoneNo5': [null, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    })
    this.healthindexParameter = this.formBuilder.group({
      'oilTemp':[null, [Validators.required,]],
      'load': [null, [Validators.required]],
      'WindingTemp': [null, [Validators.required]],
      'age': [null, [Validators.required]],
      'oilLevel': [null, [Validators.required]],
      'Repaired':[null, [Validators.required]],
      'PF': [null, [Validators.required]],
      'Harmonics': [null, [Validators.required]],
      'Humidity': [null, [Validators.required]],
      'CurrentUnbalance':[null, [Validators.required]],
      'VoltageUnbalance':[null, [Validators.required]]

    })

    console.log('CREATE DTMU DEVICE MASTER:');
    var deviceCategory = this.deviceMaster.deviceCategory;
    var deviceModel = this.deviceMaster.deviceModel;
    var deviceId = this.deviceMaster.deviceId
    this.dtmuDevice = this.formBuilder.group({
      'deviceCategory':[this.deviceMaster.deviceCategory, [Validators.required]],
      'deviceModel':[this.deviceMaster.deviceModel, [Validators.required]],
      'deviceId': [this.deviceMaster.deviceId, [Validators.required]],
      'heartBeat': ['', [Validators.required]],
      'name': ['', [Validators.required]],
      'passcode': ['', [Validators.required]],
      'remoteController': false,
      'onoffNotify':false

    })

    if(this.data &&this.data.transformerData && this.data.transformerData !== 'Add' && Object.keys(this.data.transformerData).length > 0) {
      console.log('Description form values:',this.data.transformerData['description'][0]);
      
      //Description
      this.descriptionForm.controls['meterDescription'].setValue(this.data.transformerData['description'][0].meterDescription);
      this.descriptionForm.controls['meterName'].setValue(this.data.transformerData['description'][0].meterName);
      this.descriptionForm.controls['meterModel'].setValue(this.data.transformerData['description'][0].meterModel);
      this.descriptionForm.controls['manufacturer'].setValue(this.data.transformerData['description'][0].manufacturer);
      this.descriptionForm.controls['installationDate'].setValue(this.data.transformerData['description'][0].installationDate);
      this.descriptionForm.controls['meterSerialNumber'].setValue(this.data.transformerData['description'][0].meterSerialNumber);
      this.descriptionForm.controls['ctratio'].setValue(this.data.transformerData['description'][0].ctratio);
      this.descriptionForm.controls['ptratio'].setValue(this.data.transformerData['description'][0].ptratio);
      this.descriptionForm.controls['assetDescription'].setValue(this.data.transformerData['description'][0].assetDescription);
      this.descriptionForm.controls['assetName'].setValue(this.data.transformerData['description'][0].assetName);
      this.descriptionForm.controls['assetModel'].setValue(this.data.transformerData['description'][0].assetModel);
      this.descriptionForm.controls['assetManufacturer'].setValue(this.data.transformerData['description'][0].assetManufacturer);
      this.descriptionForm.controls['assetSerialNumber'].setValue(this.data.transformerData['description'][0].assetSerialNumber);
      this.descriptionForm.controls['assetRatedCurrent'].setValue(this.data.transformerData['description'][0].assetRatedCurrent);

      //Device

      this.dtmuDevice.controls['deviceCategory'].setValue(this.data.transformerData['description'][0].deviceCategory);
      this.dtmuDevice.controls['deviceModel'].setValue(this.data.transformerData['description'][0].deviceModel);
      this.dtmuDevice.controls['deviceId'].setValue(this.data.transformerData['description'][0].deviceId);
      this.dtmuDevice.controls['heartBeat'].setValue(this.data.transformerData['description'][0].heartBeat);
      this.dtmuDevice.controls['name'].setValue(this.data.transformerData['description'][0].name);
      this.dtmuDevice.controls['passcode'].setValue(this.data.transformerData['description'][0].passcode);
      this.dtmuDevice.controls['remoteController'].setValue(this.data.transformerData['description'][0].remoteController ==='1'? true: false);
      this.dtmuDevice.controls['onoffNotify'].setValue(this.data.transformerData['description'][0].onoffNotify ==='1'? true: false);
  
      //parameter

      this.parameters.controls['pf'].setValue(this.data.transformerData['parameterConfig'][0].pf==='1'? true: false)
      this.parameters.controls['kwh'].setValue(this.data.transformerData['parameterConfig'][0].kwh==='1'? true: false)
      this.parameters.controls['L1'].setValue(this.data.transformerData['parameterConfig'][0].l1==='1'? true: false)
      this.parameters.controls['L2'].setValue(this.data.transformerData['parameterConfig'][0].l2==='1'? true: false)
      this.parameters.controls['L3'].setValue(this.data.transformerData['parameterConfig'][0].l3==='1'? true: false)
      this.parameters.controls['activepower'].setValue(this.data.transformerData['parameterConfig'][0]['3phase_active_power']==='1'? true: false)
      this.parameters.controls['reactivepower'].setValue(this.data.transformerData['parameterConfig'][0]['3phase_reactive_power']==='1'? true: false)
      this.parameters.controls['activepower'].setValue(this.data.transformerData['parameterConfig'][0]['3phase_active_power']==='1'? true: false)
      this.parameters.controls['apparentpower'].setValue(this.data.transformerData['parameterConfig'][0]['3phase_apparent_power']==='1'? true: false)
      this.parameters.controls['kvArhI'].setValue(this.data.transformerData['parameterConfig'][0].System_kvArh_I ==='1'? true: false)
      this.parameters.controls['kvArhE'].setValue(this.data.transformerData['parameterConfig'][0].System_kvArh_E ==='1'? true: false)
      this.parameters.controls['kvAh'].setValue(this.data.transformerData['parameterConfig'][0].System_kvAh ==='1'? true: false)
      this.parameters.controls['latestkwh'].setValue(this.data.transformerData['parameterConfig'][0].latestkwh ==='1'? true: false)

      
     //alert Parameter
  
     this.alertParameter.setValue({
      apLowPowerfactor: this.data.transformerData['alertParameters'][0].parameterValue,
      apLowPowerfactorEmail:this.data.transformerData['alertParameters'][0].email==='1'? true: false,
      apLowPowerfactorSms:this.data.transformerData['alertParameters'][0].sms==='1'? true: false,
      apLowPowerfactorFrequency:this.data.transformerData['alertParameters'][0].frequency,
      apLowPowerfactorTime:this.data.transformerData['alertParameters'][0].timeValue,
    });

      //alert Notification

      this.altertNotification.controls['email1'].setValue(this.data.transformerData['alertNotifications'][0].email1);
      this.altertNotification.controls['email2'].setValue(this.data.transformerData['alertNotifications'][0].email2);
      this.altertNotification.controls['email3'].setValue(this.data.transformerData['alertNotifications'][0].email3);
      this.altertNotification.controls['email4'].setValue(this.data.transformerData['alertNotifications'][0].email4);
      this.altertNotification.controls['email5'].setValue(this.data.transformerData['alertNotifications'][0].email5);
      this.altertNotification.controls['phoneNo1'].setValue(this.data.transformerData['alertNotifications'][0].phoneNo1);
      this.altertNotification.controls['phoneNo2'].setValue(this.data.transformerData['alertNotifications'][0].phoneNo2);
      this.altertNotification.controls['phoneNo3'].setValue(this.data.transformerData['alertNotifications'][0].phoneNo3);
      this.altertNotification.controls['phoneNo4'].setValue(this.data.transformerData['alertNotifications'][0].phoneNo4);
      this.altertNotification.controls['phoneNo5'].setValue(this.data.transformerData['alertNotifications'][0].phoneNo5);

    }


  }
 getData(){
  hello()
 }

  getDeviceDdl()
 {
  this.transformerMangService.getDeviceDdl().toPromise().then((response:any) => {

    //this.deviceMaster = response;
   // console.log('RESPONSE:', this.deviceMaster);
   console.log('Responses fetched:', response)
    return response;
   //console.log('VALUES :', Object.keys(response.message[0]).map(function (key) { return response.message[0][key]; }));
  })

 }

 close(response) {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(value => {
      console.log(`Dialog sent:`, response);
    });

  }

  public errorHandling = (control: string, error: string) => {
    console.log('Control:',this.descriptionForm.controls[control])
    console.log( this.descriptionForm.controls[control].hasError(error));
    return this.descriptionForm.controls[control].hasError(error)
  }

  onSubmit(descroptionValues, parametersValues, alertParametersValues, altertNotificationValues, dtmuDeviceValues) {
      this.ngxLoader.start();
   // if(this.descriptionForm.valid && this.parameters.valid && this.alertParameter.valid && this.altertNotification.valid && this.dtmuDevice.valid ){
      descroptionValues.deleteFlag = "A",
      descroptionValues.createdBy = JSON.parse(localStorage.getItem('userData')).userid;
      var today = new Date();
      var date='';
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      date = yyyy + '-' + mm + '-' + dd;

      descroptionValues.createdDate = Date.now().toString();
      var id= {'id': descroptionValues.serialnumber};
      var metaData = {'createdBy':JSON.parse(localStorage.getItem('userData')).userid, 'createdDate':date,'deleteFlag':'A'};
      this.formData.action = this.action;
      if(this.action === 'Update') {
        console.log(this.descriptionForm.errors, this.altertNotification.errors);
        console.log('FORM VALIDATIONS :', this.descriptionForm, this.parameters, this.alertParameter, this.altertNotification, this.dtmuDevice);
        this.formData.serialnumber = descroptionValues.serialnumber;
        descroptionValues.installationDate = typeof(descroptionValues.installationDate) === 'object' ? moment(descroptionValues.installationDate).format('YYYY-MM-DD') :  descroptionValues.installationDate.substr(0,10);
      }
      else {
        console.log(this.descriptionForm.errors, this.altertNotification.errors);
        console.log('FORM VALIDATIONS :', this.descriptionForm, this.parameters, this.alertParameter, this.altertNotification, this.dtmuDevice);
        if(!this.descriptionForm.valid || !this.parameters.valid || !this.alertParameter.valid || !this.altertNotification.valid || !this.dtmuDevice.valid || (this.frequencyError && this.frequencyError.length > 0 )) {
          if(!this.frequencyError) {
            this.toastr.error('Please Enter Valid and Mandatory Values');
            return
          // return alert('Please Enter Valid and Mandatory Values');

          } else if(this.frequencyError && this.frequencyError.length > 0) {
            this.toastr.error(this.frequencyError);
            return;
          //  return alert(this.frequencyError);
          }

        }
      }

      dtmuDeviceValues.remoteController=dtmuDeviceValues.remoteController ? 1 :0;
      dtmuDeviceValues.onoffNotify=dtmuDeviceValues.onoffNotify ? 1 :0;
      this.formData.description = {...id, ...descroptionValues, ...dtmuDeviceValues, ...metaData};
      if(this.action === 'Update') {
        delete this.formData.description.id;
        delete this.formData.description.serialnumber;
        delete this.formData.description['createdBy'];
        delete this.formData.description['createdDate'];

      }
      this.formData.parameters = parametersValues;

      console.log('ALERT PARAMETERS:', alertParametersValues);

      this.formData.alertParameter = [{"apLowPowerfactor":alertParametersValues.apLowPowerfactor,"email":alertParametersValues.apLowPowerfactorEmail,"sms":alertParametersValues.apLowPowerfactorSms, "frequency":alertParametersValues.apLowPowerfactorFrequency, "timeValue": alertParametersValues.apLowPowerfactorTime}];

      this.formData.alertNotification = altertNotificationValues;
      console.log('FORM DATA:', this.formData);

      if(this.frequencyError && this.frequencyError.length > 0) {
       // return alert(this.frequencyError);
        this.toastr.error(this.frequencyError);
        return;
      }

       this.transformerMangService.saveEMSData(this.formData).subscribe((response) => {
         
           console.log("RESPONSE:", response);
           if(response.hasOwnProperty("message")){
            this.close(response);
            this.toastr.success("Data Inserted");
           } else {
            this.toastr.error("No added");
           }
           this.ngxLoader.stop();
       })

    // }
    // else {
    //   alert('Please Enter Valid and Mandatory Values');
    // }
  // console.log('FORM VALUES:', descroptionValues);
  // console.log('PARAm VALUES:', parametersValues);
  // console.log('PARAm VALUES:', alertParametersValues);
  // console.log('ALTAER NOTIFICATION VALUES:', altertNotificationValues);
  // console.log('PARAm VALUES:', dtmuDeviceValues);

  }

  checkFrequency(event:any, frequency, time) {
    console.log("CHECK FREQUENCY:", event.target.value, frequency, time);
    console.log(this.alertParameter);
    console.log(this.alertParameter.value[time]);
    if(this.alertParameter.value[time] === 'Minutes') {
      if(event.target.value >  31  || event.target.value < 1) {
       // this.alertParameter.controls.frequency.setValidators([Validators.minLength(1), Validators.maxLength(31)]);
        this.frequencyMsg[frequency] = 'Frequency value should be between 1-31';
        this.frequencyError = 'There are Errors in Alert Parameters Form'
      } else {
        this.frequencyMsg[frequency] = '';
        this.frequencyError = ''
      }
    } else if(this.alertParameter.value[time] === 'Hours') {
      if(event.target.value >  11  || event.target.value < 1) {
       // this.alertParameter.controls.frequency.setValidators([Validators.minLength(1), Validators.maxLength(31)]);
        this.frequencyMsg[frequency] = 'Frequency value should be between 1-11';
        this.frequencyError = 'There are Errors in Alert Parameters Form'
      } else {
        this.frequencyMsg[frequency] = '';
        this.frequencyError = ''
      }
    } else if(this.alertParameter.value[time] === 'Minutes') {
      if(event.target.value >  59  || event.target.value < 1) {
       // this.alertParameter.controls.frequency.setValidators([Validators.minLength(1), Validators.maxLength(31)]);
        this.frequencyMsg[frequency] = 'Frequency value should be between 1-59';
        this.frequencyError = 'There are Errors in Alert Parameters Form'
      } else {
        this.frequencyMsg[frequency] = '';
        this.frequencyError = ''
      }
    }
  }
}
