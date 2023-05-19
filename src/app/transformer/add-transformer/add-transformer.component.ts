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
  selector: 'app-add-transformer',
  templateUrl: './add-transformer.component.html',
  styleUrls: ['./add-transformer.component.css']
})

export class AddTransformerComponent implements OnInit {
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
  constructor( public dialogRef: MatDialogRef<AddTransformerComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
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
      'transformerMakeBy': [null, [Validators.required]],
      'serialnumber': [null, [Validators.required]],
      'manufacturingDate': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'installationDate': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'kwhreading': '',
      'kvarhreading':'',
      'kvarating':'',
      'transformertype':'',
      'ctratio':'',
      'ptratio':'',
      'voltagestandard':'',
      'state':'',
      'volthv':[0],
      'voltlv':[0],
      'amperehv':[0],
      'amperelv':[0],
      'oil':[0],
      'winding':[0],
      'oilvolume':[0],
      'ratedLoad':[1],
      'multfact':''
    });

    this.parameters = this.formBuilder.group({
      'oiltemperature': [true],
      'oillevel': [true],
      'windingtemperature': [true],
      'windingtemperaturebycal':[true],
      'ambienttemperature': [true],
      'humidity': [true],
      'vibration': [true],
      'devicelocation': [true],
      'tapposition':[true],
      'lugtemp':[true],
      'pvrstatus':[true],
      'osrstatus':[true],
      'buchholzstatus':[true],
      'otistatus':[true],
      'wtistatus':[true],
      // 'lugTemperatureR': [true],
      // 'lugTemperatureY': [true],
      // 'lugTemperatureB': [true],
      'electricalbasicparameters': [true],
      'averageVoltage': [true],
      'rPhN': [true],
      'yPhN': [true],
      'bPhN': [true],
      'ryVoltage': [true],
      'ybVoltage': [true],
      'brVoltage': [true],
      'l1': [true],
      'l2': [true],
      'l3': [true],
      'ln': [true],
      'i1': [true],
      'i2': [true],
      'i3': [true],
      'r1': [true],
      'r2': [true],
      'r3': [true],
      'rPowerFactor': [true],
      'yPowerFactor': [true],
      'bPowerFactor': [true],
      'avgPowerFactor': [true],
      'rActivePower': [true],
      'yActivePower': [true],
      'bActivePower': [true],
      '3PhaseActivePower': [true],
      'rReactivePower': [true],
      'yReactivePower': [true],
      'bReactivePower': [true],
      '3PhaseReactivePower': [true],
      'rApparentPower': [true],
      'yApparentPower': [true],
      'bApparentPower': [true],
      '3PhaseApparentPower': [true],
      'frequency': [true],
      'energyMeterTemperature': [true],
      'vrThd': [true],
      'vyThd': [true],
      'vbThd': [true],
      'irThd': [true],
      'iyThd': [true],
      'ibThd': [true],
      'rpThd': [true],
      'ypThd': [true],
      'bpThd': [true],
      'systemKwh': [true],
      'systemKvarh': [true],
      'systemKvah':[true],
      'kwhimport':[false],
      'kwhexport':[false],
      'kvarhq1':[false],
      'kvarhq2':[false],
      'kvarhq3':[false],
      'kvarhq4':[false],
      'kvahimport':[false],
      'kvahexport':[false],
      'lugtempr' :[true],
      'lugtempy' :[true],
      'lugtempb' :[true],
      //'electricalAdvance': [true],
     // 'demand': [true]
    })

    this.alertParameter = this.formBuilder.group({
      'apOverload':[0],
      'apOverloadEmail':false,
      'apOverloadSms':false,
      'apOverloadFrequency':[1],
      'apOverloadTime':'Minutes',
      'apCriticalload':[0],
      'apCriticalloadEmail':false,
      'apCriticalloadSms':false,
      'apCriticalloadFrequency':[1],
      'apCriticalloadTime':'Minutes',
      'apUnderload': [0],
      'apUnderloadEmail':false,
      'apUnderloadSms':false,
      'apUnderloadFrequency':[1],
      'apUnderloadTime':'Minutes',
      'apHighvolt': [0],
      'apHighvoltEmail':false,
      'apHighvoltSms':false,
      'apHighvoltFrequency':[1],
      'apHighvoltTime':'Minutes',
      'apLowvolt':[0],
      'apLowvoltEmail':false,
      'apLowvoltSms':false,
      'apLowvoltFrequency':[1],
      'apLowvoltTime':'Minutes',
      'apOiltemperature': [0],
      'apOiltemperatureEmail':false,
      'apOiltemperatureSms':false,
      'apOiltemperatureFrequency':[1],
      'apOiltemperatureTime':'Minutes',
      'apWindingtemperature': [0],
      'apWindingtemperatureEmail':false,
      'apWindingtemperatureSms':false,
      'apWindingtemperatureFrequency':[1],
      'apWindingtemperatureTime':'Minutes',
      'apVunbalance':[0],
      'apVunbalanceEmail':false,
      'apVunbalanceSms':false,
      'apVunbalanceFrequency':[1],
      'apVunbalanceTime':'Minutes',
      'apIunbalance':[0],
      'apIunbalanceEmail':false,
      'apIunbalanceSms':false,
      'apIunbalanceFrequency':[1],
      'apIunbalanceTime':'Minutes',
      'apLowPowerfactor': [0],
      'apLowPowerfactorEmail':false,
      'apLowPowerfactorSms':false,
      'apLowPowerfactorFrequency':[1],
      'apLowPowerfactorTime':'Minutes',
      'apOillevel': [5],
      'apOillevelEmail':false,
      'apOillevelSms':false,
      'apOillevelFrequency':[1],
      'apOillevelTime':'Minutes',
      'apPRVStatus': [0],
      'apPRVStatusEmail':false,
      'apPRVStatusSms':false,
      'apPRVStatusFrequency':[1],
      'apPRVStatusTime':'Minutes',
      'apOSRStatus': [0],
      'apOSRStatusEmail':false,
      'apOSRStatusSms':false,
      'apOSRStatusFrequency':[1],
      'apOSRStatusTime':'Minutes',
      'apBuchholzStatus': [0],
      'apBuchholzStatusEmail':false,
      'apBuchholzStatusSms':false,
      'apBuchholzStatusFrequency':[1],
      'apBuchholzStatusTime':'Minutes',
      'apOTIStatus': [0],
      'apOTIStatusEmail':false,
      'apOTIStatusSms':false,
      'apOTIStatusFrequency':[1],
      'apOTIStatusTime':'Minutes',
      'apWTIStatus': [0],
      'apWTIStatusEmail':false,
      'apWTIStatusSms':false,
      'apWTIStatusFrequency':[1],
      'apWTIStatusTime':'Minutes',

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
      //this.descriptionForm.patchValue(this.data.transformerData['description'][0]);

      this.descriptionForm.controls['transformerMakeBy'].setValue(this.data.transformerData['description'][0].transformerMakeBy);
      this.descriptionForm.controls['serialnumber'].setValue(this.data.transformerData['description'][0].serialnumber);
      this.descriptionForm.controls['manufacturingDate'].setValue(this.data.transformerData['description'][0].manufacturingDate);
      this.descriptionForm.controls['installationDate'].setValue(this.data.transformerData['description'][0].installationDate);
      this.descriptionForm.controls['kwhreading'].setValue(this.data.transformerData['description'][0].kwhreading);
      this.descriptionForm.controls['kvarhreading'].setValue(this.data.transformerData['description'][0].kvarhreading);
      this.descriptionForm.controls['kvarating'].setValue(this.data.transformerData['description'][0].kvarating);
      this.descriptionForm.controls['transformertype'].setValue(this.data.transformerData['description'][0].transformertype);
      this.descriptionForm.controls['ctratio'].setValue(this.data.transformerData['description'][0].ctratio);
      this.descriptionForm.controls['ptratio'].setValue(this.data.transformerData['description'][0].ptratio);
      this.descriptionForm.controls['voltagestandard'].setValue(this.data.transformerData['description'][0].voltagestandard);
      this.descriptionForm.controls['state'].setValue(this.data.transformerData['description'][0].state===1 ? true: false);
      this.descriptionForm.controls['volthv'].setValue(this.data.transformerData['description'][0].volthv);
      this.descriptionForm.controls['voltlv'].setValue(this.data.transformerData['description'][0].voltlv);
      this.descriptionForm.controls['amperehv'].setValue(this.data.transformerData['description'][0].amperehv);
      this.descriptionForm.controls['amperelv'].setValue(this.data.transformerData['description'][0].amperelv);
      this.descriptionForm.controls['oil'].setValue(this.data.transformerData['description'][0].oil);
      this.descriptionForm.controls['winding'].setValue(this.data.transformerData['description'][0].winding);
      this.descriptionForm.controls['oilvolume'].setValue(this.data.transformerData['description'][0].oilvolume);
      this.descriptionForm.controls['ratedLoad'].setValue(this.data.transformerData['description'][0].ratedLoad);
      this.descriptionForm.controls['multfact'].setValue(this.data.transformerData['description'][0].multfact);

      this.dtmuDevice.controls['deviceCategory'].setValue(this.data.transformerData['description'][0].deviceCategory);
      this.dtmuDevice.controls['deviceModel'].setValue(this.data.transformerData['description'][0].deviceModel);
      this.dtmuDevice.controls['deviceId'].setValue(this.data.transformerData['description'][0].deviceId);
      this.dtmuDevice.controls['heartBeat'].setValue(this.data.transformerData['description'][0].heartBeat);
      this.dtmuDevice.controls['name'].setValue(this.data.transformerData['description'][0].name);
      this.dtmuDevice.controls['passcode'].setValue(this.data.transformerData['description'][0].passcode);
      this.dtmuDevice.controls['remoteController'].setValue(this.data.transformerData['description'][0].remoteController);
      this.dtmuDevice.controls['onoffNotify'].setValue(this.data.transformerData['description'][0].onoffNotify);
      console.log("Parameters Data",this.data.transformerData['parameterConfig']);
     // this.dtmuDevice.patchValue(this.data.transformerData['description'][0]);
      this.parameters.controls['oiltemperature'].setValue(this.data.transformerData['parameterConfig'][0].oiltemperature==='1'? true: false)
      this.parameters.controls['oillevel'].setValue(this.data.transformerData['parameterConfig'][0].oillevel==='1'? true: false)
      this.parameters.controls['windingtemperature'].setValue(this.data.transformerData['parameterConfig'][0].windingtemperature==='1'? true: false)
      this.parameters.controls['windingtemperaturebycal'].setValue(this.data.transformerData['parameterConfig'][0].windingtemperaturebycal==='1'? true: false)
      this.parameters.controls['ambienttemperature'].setValue(this.data.transformerData['parameterConfig'][0].ambienttemperature==='1'? true: false)
      this.parameters.controls['humidity'].setValue(this.data.transformerData['parameterConfig'][0].humidity==='1'? true: false)
      this.parameters.controls['vibration'].setValue(this.data.transformerData['parameterConfig'][0].vibration==='1'? true: false)
      this.parameters.controls['devicelocation'].setValue(this.data.transformerData['parameterConfig'][0].devicelocation==='1'? true: false)
      this.parameters.controls['tapposition'].setValue(this.data.transformerData['parameterConfig'][0].tapposition==='1'? true: false)
      this.parameters.controls['lugtemp'].setValue(this.data.transformerData['parameterConfig'][0].lugtemp==='1'? true: false)
      this.parameters.controls['pvrstatus'].setValue(this.data.transformerData['parameterConfig'][0].pvrStatus==='1'? true: false)
      this.parameters.controls['osrstatus'].setValue(this.data.transformerData['parameterConfig'][0].osrStatus==='1'? true: false)
      this.parameters.controls['buchholzstatus'].setValue(this.data.transformerData['parameterConfig'][0].buchholzStatus==='1'? true: false)
      this.parameters.controls['otistatus'].setValue(this.data.transformerData['parameterConfig'][0].otiStatus==='1'? true: false)
      this.parameters.controls['wtistatus'].setValue(this.data.transformerData['parameterConfig'][0].wtiStatus==='1'? true: false)
      this.parameters.controls['lugtempr'].setValue(this.data.transformerData['parameterConfig'][0].lugtempr==='1'? true: false)
      this.parameters.controls['lugtempy'].setValue(this.data.transformerData['parameterConfig'][0].lugtempr==='1'? true: false)
      this.parameters.controls['lugtempb'].setValue(this.data.transformerData['parameterConfig'][0].lugtempr==='1'? true: false)
      this.parameters.controls['averageVoltage'].setValue(this.data.transformerData['parameterConfig'][0].averageVoltage==='1'? true: false)
      this.parameters.controls['rPhN'].setValue(this.data.transformerData['parameterConfig'][0].rPhN==='1'? true: false)
      this.parameters.controls['yPhN'].setValue(this.data.transformerData['parameterConfig'][0].yPhN==='1'? true: false)
      this.parameters.controls['bPhN'].setValue(this.data.transformerData['parameterConfig'][0].bPhN==='1'? true: false)
      this.parameters.controls['ryVoltage'].setValue(this.data.transformerData['parameterConfig'][0].ryVoltage==='1'? true: false)
      this.parameters.controls['ybVoltage'].setValue(this.data.transformerData['parameterConfig'][0].ybVoltage==='1'? true: false)
      this.parameters.controls['brVoltage'].setValue(this.data.transformerData['parameterConfig'][0].brVoltage==='1'? true: false)
      this.parameters.controls['l1'].setValue(this.data.transformerData['parameterConfig'][0].l1==='1'? true: false)
      this.parameters.controls['l2'].setValue(this.data.transformerData['parameterConfig'][0].l2==='1'? true: false)
      this.parameters.controls['l3'].setValue(this.data.transformerData['parameterConfig'][0].l3==='1'? true: false)
      this.parameters.controls['ln'].setValue(this.data.transformerData['parameterConfig'][0].ln==='1'? true: false)
      this.parameters.controls['i1'].setValue(this.data.transformerData['parameterConfig'][0].i1==='1'? true: false)
      this.parameters.controls['i2'].setValue(this.data.transformerData['parameterConfig'][0].i2==='1'? true: false)
      this.parameters.controls['i3'].setValue(this.data.transformerData['parameterConfig'][0].i3==='1'? true: false)
      this.parameters.controls['r1'].setValue(this.data.transformerData['parameterConfig'][0].r1==='1'? true: false)
      this.parameters.controls['r2'].setValue(this.data.transformerData['parameterConfig'][0].r2==='1'? true: false)
      this.parameters.controls['r3'].setValue(this.data.transformerData['parameterConfig'][0].r3==='1'? true: false)
      this.parameters.controls['rPowerFactor'].setValue(this.data.transformerData['parameterConfig'][0].rPowerFactor==='1'? true: false)
      this.parameters.controls['yPowerFactor'].setValue(this.data.transformerData['parameterConfig'][0].yPowerFactor==='1'? true: false)
      this.parameters.controls['bPowerFactor'].setValue(this.data.transformerData['parameterConfig'][0].bPowerFactor==='1'? true: false)
      this.parameters.controls['avgPowerFactor'].setValue(this.data.transformerData['parameterConfig'][0].avgPowerFactor==='1'? true: false)
      this.parameters.controls['rActivePower'].setValue(this.data.transformerData['parameterConfig'][0].rActivePower==='1'? true: false)
      this.parameters.controls['yActivePower'].setValue(this.data.transformerData['parameterConfig'][0].yActivePower==='1'? true: false)
      this.parameters.controls['bActivePower'].setValue(this.data.transformerData['parameterConfig'][0].bActivePower==='1'? true: false)
      this.parameters.controls['3PhaseActivePower'].setValue(this.data.transformerData['parameterConfig'][0]['3PhaseActivePower']==='1'? true: false)
      this.parameters.controls['rReactivePower'].setValue(this.data.transformerData['parameterConfig'][0].rReactivePower==='1'? true: false)
      this.parameters.controls['yReactivePower'].setValue(this.data.transformerData['parameterConfig'][0].yReactivePower==='1'? true: false)
      this.parameters.controls['bReactivePower'].setValue(this.data.transformerData['parameterConfig'][0].bReactivePower==='1'? true: false)
      this.parameters.controls['3PhaseReactivePower'].setValue(this.data.transformerData['parameterConfig'][0]['3PhaseReactivePower']==='1'? true: false)
      this.parameters.controls['rApparentPower'].setValue(this.data.transformerData['parameterConfig'][0]['rApparentPower']==='1'? true: false)
      this.parameters.controls['yApparentPower'].setValue(this.data.transformerData['parameterConfig'][0]['yApparentPower']==='1'? true: false)
      this.parameters.controls['bApparentPower'].setValue(this.data.transformerData['parameterConfig'][0]['bApparentPower']==='1'? true: false)
      this.parameters.controls['3PhaseApparentPower'].setValue(this.data.transformerData['parameterConfig'][0]['3PhaseApparentPower']==='1'? true: false)
      this.parameters.controls['frequency'].setValue(this.data.transformerData['parameterConfig'][0].frequency==='1'? true: false)
      this.parameters.controls['energyMeterTemperature'].setValue(this.data.transformerData['parameterConfig'][0].energyMeterTemperature==='1'? true: false)
      this.parameters.controls['vrThd'].setValue(this.data.transformerData['parameterConfig'][0].vrThd==='1'? true: false)
      this.parameters.controls['vyThd'].setValue(this.data.transformerData['parameterConfig'][0].vyThd==='1'? true: false)
      this.parameters.controls['vbThd'].setValue(this.data.transformerData['parameterConfig'][0].vbThd==='1'? true: false)
      this.parameters.controls['irThd'].setValue(this.data.transformerData['parameterConfig'][0].irThd==='1'? true: false)
      this.parameters.controls['iyThd'].setValue(this.data.transformerData['parameterConfig'][0].iyThd==='1'? true: false)
      this.parameters.controls['ibThd'].setValue(this.data.transformerData['parameterConfig'][0].ibThd==='1'? true: false)
      this.parameters.controls['rpThd'].setValue(this.data.transformerData['parameterConfig'][0].rpThd==='1'? true: false)
      this.parameters.controls['ypThd'].setValue(this.data.transformerData['parameterConfig'][0].ypThd==='1'? true: false)
      this.parameters.controls['bpThd'].setValue(this.data.transformerData['parameterConfig'][0].bpThd==='1'? true: false)
      this.parameters.controls['systemKwh'].setValue(this.data.transformerData['parameterConfig'][0].systemKwh==='1'? true: false)
      this.parameters.controls['systemKvarh'].setValue(this.data.transformerData['parameterConfig'][0].systemKvarh==='1'? true: false)
      this.parameters.controls['systemKvah'].setValue(this.data.transformerData['parameterConfig'][0].systemKvah==='1'? true: false)
      this.parameters.controls['kwhimport'].setValue(this.data.transformerData['parameterConfig'][0].kwhimport==='1'? true: false)
      this.parameters.controls['kwhexport'].setValue(this.data.transformerData['parameterConfig'][0].kwhexport==='1'? true: false)
      this.parameters.controls['kvarhq1'].setValue(this.data.transformerData['parameterConfig'][0].kvarhq1==='1'? true: false)
      this.parameters.controls['kvarhq2'].setValue(this.data.transformerData['parameterConfig'][0].kvarhq2==='1'? true: false)
      this.parameters.controls['kvarhq3'].setValue(this.data.transformerData['parameterConfig'][0].kvarhq3==='1'? true: false)
      this.parameters.controls['kvarhq4'].setValue(this.data.transformerData['parameterConfig'][0].kvarhq4==='1'? true: false)
      this.parameters.controls['kvahimport'].setValue(this.data.transformerData['parameterConfig'][0].kvahimport==='1'? true: false)
      this.parameters.controls['kvahexport'].setValue(this.data.transformerData['parameterConfig'][0].kvahexport==='1'? true: false)


      //this.parameters.controls['oiltemperature'].setValue(this.data[1][0].oiltemperature==='1'? true: false)
     // this.parameters.patchValue(this.data[1][0]);
     // console.log('AP OVERLOAD:', Object.keys(this.alertParameter.controls).length/9);
     // let index = 0;

     if(this.data.transformerData['healthindexparameter'] != ''){
      this.healthindexParameter.controls['oilTemp'].setValue(this.data.transformerData['healthindexparameter'][0].oilTemp);
      this.healthindexParameter.controls['load'].setValue(this.data.transformerData['healthindexparameter'][0].load);
      this.healthindexParameter.controls['WindingTemp'].setValue(this.data.transformerData['healthindexparameter'][0].WindingTemp);
      this.healthindexParameter.controls['age'].setValue(this.data.transformerData['healthindexparameter'][0].age);
      this.healthindexParameter.controls['oilLevel'].setValue(this.data.transformerData['healthindexparameter'][0].oilLevel);
      this.healthindexParameter.controls['Repaired'].setValue(this.data.transformerData['healthindexparameter'][0].Repaired);
      this.healthindexParameter.controls['PF'].setValue(this.data.transformerData['healthindexparameter'][0].PF);
      this.healthindexParameter.controls['Harmonics'].setValue(this.data.transformerData['healthindexparameter'][0].Harmonics);
      this.healthindexParameter.controls['Humidity'].setValue(this.data.transformerData['healthindexparameter'][0].Humidity);
      this.healthindexParameter.controls['CurrentUnbalance'].setValue(this.data.transformerData['healthindexparameter'][0].CurrentUnbalance);
      this.healthindexParameter.controls['VoltageUnbalance'].setValue(this.data.transformerData['healthindexparameter'][0].VoltageUnbalance);
  }
  console.log("sjdfiofuhdsufhuihuudfhuids",this.data.transformerData['alertParameters']);
     this.alertParameter.setValue({
      apOverload:this.data.transformerData['alertParameters'][0].parameterValue,
      apOverloadEmail:this.data.transformerData['alertParameters'][0].email==='1'? true: false,
      apOverloadSms:this.data.transformerData['alertParameters'][0].sms==='1'? true: false,
      apOverloadFrequency:this.data.transformerData['alertParameters'][0].frequency,
      apOverloadTime:this.data.transformerData['alertParameters'][0].timeValue,
      apCriticalload:this.data.transformerData['alertParameters'][15].parameterValue,
      apCriticalloadEmail:this.data.transformerData['alertParameters'][15].email==='1'? true: false,
      apCriticalloadSms:this.data.transformerData['alertParameters'][15].sms==='1'? true: false,
      apCriticalloadFrequency:this.data.transformerData['alertParameters'][15].frequency,
      apCriticalloadTime:this.data.transformerData['alertParameters'][15].timeValue,
      apUnderload: this.data.transformerData['alertParameters'][1].parameterValue,
      apUnderloadEmail:this.data.transformerData['alertParameters'][1].email==='1'? true: false,
      apUnderloadSms:this.data.transformerData['alertParameters'][1].sms==='1'? true: false,
      apUnderloadFrequency:this.data.transformerData['alertParameters'][1].frequency,
      apUnderloadTime:this.data.transformerData['alertParameters'][1].timeValue,
      apHighvolt: this.data.transformerData['alertParameters'][2].parameterValue,
      apHighvoltEmail:this.data.transformerData['alertParameters'][2].email==='1'? true: false,
      apHighvoltSms:this.data.transformerData['alertParameters'][2].sms==='1'? true: false,
      apHighvoltFrequency:this.data.transformerData['alertParameters'][2].frequency,
      apHighvoltTime:this.data.transformerData['alertParameters'][2].timeValue,
      apLowvolt:this.data.transformerData['alertParameters'][3].parameterValue,
      apLowvoltEmail:this.data.transformerData['alertParameters'][3].email==='1'? true: false,
      apLowvoltSms:this.data.transformerData['alertParameters'][3].sms==='1'? true: false,
      apLowvoltFrequency:this.data.transformerData['alertParameters'][3].frequency,
      apLowvoltTime:this.data.transformerData['alertParameters'][3].timeValue,
      apOiltemperature: this.data.transformerData['alertParameters'][4].parameterValue,
      apOiltemperatureEmail:this.data.transformerData['alertParameters'][4].email==='1'? true: false,
      apOiltemperatureSms:this.data.transformerData['alertParameters'][4].sms==='1'? true: false,
      apOiltemperatureFrequency:this.data.transformerData['alertParameters'][4].frequency,
      apOiltemperatureTime:this.data.transformerData['alertParameters'][4].timeValue,
      apWindingtemperature: this.data.transformerData['alertParameters'][5].parameterValue,
      apWindingtemperatureEmail:this.data.transformerData['alertParameters'][5].email==='1'? true: false,
      apWindingtemperatureSms:this.data.transformerData['alertParameters'][5].sms==='1'? true: false,
      apWindingtemperatureFrequency:this.data.transformerData['alertParameters'][5].frequency,
      apWindingtemperatureTime:this.data.transformerData['alertParameters'][5].timeValue,
      apVunbalance:this.data.transformerData['alertParameters'][6].parameterValue,
      apVunbalanceEmail:this.data.transformerData['alertParameters'][6].email==='1'? true: false,
      apVunbalanceSms:this.data.transformerData['alertParameters'][6].sms==='1'? true: false,
      apVunbalanceFrequency:this.data.transformerData['alertParameters'][6].frequency,
      apVunbalanceTime:this.data.transformerData['alertParameters'][6].timeValue,
      apIunbalance:this.data.transformerData['alertParameters'][7].parameterValue,
      apIunbalanceEmail:this.data.transformerData['alertParameters'][7].email==='1'? true: false,
      apIunbalanceSms:this.data.transformerData['alertParameters'][7].sms==='1'? true: false,
      apIunbalanceFrequency:this.data.transformerData['alertParameters'][7].frequency,
      apIunbalanceTime:this.data.transformerData['alertParameters'][7].timeValue,
      apLowPowerfactor: this.data.transformerData['alertParameters'][8].parameterValue,
      apLowPowerfactorEmail:this.data.transformerData['alertParameters'][8].email==='1'? true: false,
      apLowPowerfactorSms:this.data.transformerData['alertParameters'][8].sms==='1'? true: false,
      apLowPowerfactorFrequency:this.data.transformerData['alertParameters'][8].frequency,
      apLowPowerfactorTime:this.data.transformerData['alertParameters'][8].timeValue,
      apOillevel: this.data.transformerData['alertParameters'] ? this.data.transformerData['alertParameters'][9].parameterValue: 5,
      apOillevelEmail:this.data.transformerData['alertParameters'] && this.data.transformerData['alertParameters'][9].email==='1'? true: false,
      apOillevelSms:this.data.transformerData['alertParameters'] && this.data.transformerData['alertParameters'][9].sms==='1'? true: false,
      apOillevelFrequency:this.data.transformerData['alertParameters'] ? this.data.transformerData['alertParameters'][9].frequency: 0,
      apOillevelTime:this.data.transformerData['alertParameters']  ? this.data.transformerData['alertParameters'][9].timeValue: 'Minutes',
      apPRVStatus:this.data.transformerData['alertParameters'][10].parameterValue,
      apPRVStatusEmail:this.data.transformerData['alertParameters'][10].email==='1'? true: false,
      apPRVStatusSms:this.data.transformerData['alertParameters'][10].sms==='1'? true: false,
      apPRVStatusFrequency:this.data.transformerData['alertParameters'][10].frequency,
      apPRVStatusTime:this.data.transformerData['alertParameters'][10].timeValue,
      apOSRStatus:this.data.transformerData['alertParameters'][11].parameterValue,
      apOSRStatusEmail:this.data.transformerData['alertParameters'][11].email==='1'? true: false,
      apOSRStatusSms:this.data.transformerData['alertParameters'][11].sms==='1'? true: false,
      apOSRStatusFrequency:this.data.transformerData['alertParameters'][11].frequency,
      apOSRStatusTime:this.data.transformerData['alertParameters'][11].timeValue,
      apBuchholzStatus:this.data.transformerData['alertParameters'][12].parameterValue,
      apBuchholzStatusEmail:this.data.transformerData['alertParameters'][12].email==='1'? true: false,
      apBuchholzStatusSms:this.data.transformerData['alertParameters'][12].sms==='1'? true: false,
      apBuchholzStatusFrequency:this.data.transformerData['alertParameters'][12].frequency,
      apBuchholzStatusTime:this.data.transformerData['alertParameters'][12].timeValue,
      apOTIStatus:this.data.transformerData['alertParameters'][13].parameterValue,
      apOTIStatusEmail:this.data.transformerData['alertParameters'][13].email==='1'? true: false,
      apOTIStatusSms:this.data.transformerData['alertParameters'][13].sms==='1'? true: false,
      apOTIStatusFrequency:this.data.transformerData['alertParameters'][13].frequency,
      apOTIStatusTime:this.data.transformerData['alertParameters'][13].timeValue,
      apWTIStatus:this.data.transformerData['alertParameters'][14].parameterValue,
      apWTIStatusEmail:this.data.transformerData['alertParameters'][14].email==='1'? true: false,
      apWTIStatusSms:this.data.transformerData['alertParameters'][14].sms==='1'? true: false,
      apWTIStatusFrequency:this.data.transformerData['alertParameters'][14].frequency,
      apWTIStatusTime:this.data.transformerData['alertParameters'][14].timeValue,

    });


      //this.alertParameter.patchValue(this.data.transformerData['alertParameters'][0]);
      //this.altertNotification.patchValue(this.data.transformerData['alertNotifications'][0]);
      console.log("kihfeforehfoiheriohoir",this.data.transformerData['alertNotifications']);
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
     // this.descriptionForm.controls['serialNo'].setValue(this.data[0][0].serialnumber);
      //this.descriptionForm


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

  onSubmit(descroptionValues, parametersValues,healthindexParametervalues, alertParametersValues, altertNotificationValues, dtmuDeviceValues) {
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
        console.log('MOMENT DATE: ',moment(descroptionValues.manufacturingDate).format('YYYY-MM-DD'))
        descroptionValues.manufacturingDate = typeof(descroptionValues.manufacturingDate) === 'object' ? moment(descroptionValues.manufacturingDate).format('YYYY-MM-DD') : descroptionValues.manufacturingDate.substr(0,10);
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
      }
      this.formData.parameters = parametersValues;

      console.log('ALERT PARAMETERS:', alertParametersValues);

      this.formData.alertParameter = [{"apOverload":alertParametersValues.apOverload, "email":alertParametersValues.apOverloadEmail,"sms":alertParametersValues.apOverloadSms, "frequency":alertParametersValues.apOverloadFrequency, "timeValue":alertParametersValues.apOverloadTime},
      {"apUnderload":alertParametersValues.apUnderload,"email":alertParametersValues.apUnderloadEmail,"sms":alertParametersValues.apUnderloadSms, "frequency":alertParametersValues.apUnderloadFrequency, "timeValue":alertParametersValues.apUnderloadTime},
      {"apHighvolt":alertParametersValues.apHighvolt,"email":alertParametersValues.apHighvoltEmail,"sms":alertParametersValues.apHighvoltSms, "frequency":alertParametersValues.apHighvoltFrequency, "timeValue":alertParametersValues.apHighvoltTime},
      {"apLowvolt":alertParametersValues.apLowvolt,"email":alertParametersValues.apLowvoltEmail,"sms":alertParametersValues.apLowvoltSms, "frequency":alertParametersValues.apLowvoltFrequency, "timeValue":alertParametersValues.apLowvoltTime},
      {"apOiltemperature": alertParametersValues.apOiltemperature,"email":alertParametersValues.apOiltemperatureEmail,"sms":alertParametersValues.apOiltemperatureSms, "frequency":alertParametersValues.apOiltemperatureFrequency, "timeValue":alertParametersValues.apOiltemperatureTime},
      {"apWindingtemperature": alertParametersValues.apWindingtemperature,"email":alertParametersValues.apWindingtemperatureEmail,"sms":alertParametersValues.apWindingtemperatureSms, "frequency":alertParametersValues.apWindingtemperatureFrequency, "timeValue":alertParametersValues.apWindingtemperatureTime},
      {"apVunbalance":alertParametersValues.apVunbalance,"email":alertParametersValues.apVunbalanceEmail,"sms":alertParametersValues.apVunbalanceSms, "frequency":alertParametersValues.apVunbalanceFrequency, "timeValue":alertParametersValues.apVunbalanceTime},
      {"apIunbalance":alertParametersValues.apIunbalance,"email":alertParametersValues.apIunbalanceEmail,"sms":alertParametersValues.apIunbalanceSms, "frequency":alertParametersValues.apIunbalanceFrequency, "timeValue":alertParametersValues.apIunbalanceTime},
      {"apLowPowerfactor":alertParametersValues.apLowPowerfactor,"email":alertParametersValues.apLowPowerfactorEmail,"sms":alertParametersValues.apLowPowerfactorSms, "frequency":alertParametersValues.apLowPowerfactorFrequency, "timeValue": alertParametersValues.apLowPowerfactorTime}];

//      if(alertParametersValues.apOillevel && alertParametersValues.apOillevelEmail && alertParametersValues.apOillevelSms && alertParametersValues.apOillevelTime && alertParametersValues.apOillevelFrequency) {
        this.formData.alertParameter.push({"apOillevel":alertParametersValues.apOillevel,"email":alertParametersValues.apOillevelEmail,"sms":alertParametersValues.apOillevelSms, "frequency":alertParametersValues.apOillevelFrequency, "timeValue": alertParametersValues.apOillevelTime})
//      }
this.formData.alertParameter.push({"apPRVStatus":alertParametersValues.apPRVStatus,"email":alertParametersValues.apPRVStatusEmail,"sms":alertParametersValues.apPRVStatusSms,"frequency":alertParametersValues.apPRVStatusFrequency,"timeValue": alertParametersValues.apPRVStatusTime});
this.formData.alertParameter.push({"apOSRStatus":alertParametersValues.apOSRStatus,"email":alertParametersValues.apOSRStatusEmail,"sms":alertParametersValues.apOSRStatusSms,"frequency":alertParametersValues.apOSRStatusFrequency,"timeValue": alertParametersValues.apOSRStatusTime});
this.formData.alertParameter.push({"apBuchholzStatus":alertParametersValues.apBuchholzStatus,"email":alertParametersValues.apBuchholzStatusEmail,"sms":alertParametersValues.apBuchholzStatusSms,"frequency":alertParametersValues.apBuchholzStatusFrequency,"timeValue": alertParametersValues.apBuchholzStatusTime});
this.formData.alertParameter.push({"apOTIStatus":alertParametersValues.apOTIStatus,"email":alertParametersValues.apOTIStatusEmail,"sms":alertParametersValues.apOTIStatusSms,"frequency":alertParametersValues.apOTIStatusFrequency,"timeValue": alertParametersValues.apOTIStatusTime});
this.formData.alertParameter.push({"apWTIStatus":alertParametersValues.apWTIStatus,"email":alertParametersValues.apWTIStatusEmail,"sms":alertParametersValues.apWTIStatusSms,"frequency":alertParametersValues.apWTIStatusFrequency,"timeValue": alertParametersValues.apWTIStatusTime});
this.formData.alertParameter.push({"apCriticalload":alertParametersValues.apCriticalload, "email":alertParametersValues.apCriticalloadEmail,"sms":alertParametersValues.apCriticalloadSms, "frequency":alertParametersValues.apCriticalloadFrequency, "timeValue":alertParametersValues.apCriticalloadTime});
      this.formData.alertNotification = altertNotificationValues;
      this.formData.healthindexParameter = healthindexParametervalues;
      console.log("Health Index Parameter:",this.formData.healthindexParameter);
      console.log('FORM DATA:', this.formData);

      if(this.frequencyError && this.frequencyError.length > 0) {
       // return alert(this.frequencyError);
        this.toastr.error(this.frequencyError);
        return;
      }

       this.transformerMangService.saveTransformerData(this.formData).subscribe((response) => {
         this.ngxLoader.stop();
           console.log("RESPONSE:", response);
            this.close(response);
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
