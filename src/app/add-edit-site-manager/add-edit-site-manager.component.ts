import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from "lodash";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
import { GlobalService } from '../services/global.service';
import { SiteManagerService } from '../services/site-manager.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-site-manager',
  templateUrl: './add-edit-site-manager.component.html',
  styleUrls: ['./add-edit-site-manager.component.css']
})
export class AddEditSiteManagerComponent implements OnInit {

  form: FormGroup;
  showUserAdmin: boolean = false;
  showUser: boolean = false;
  isnewZone: boolean = false;
  isnewLocation: boolean = false;
  disableUserAdminflag: boolean = false;
  useradminList = [];
  userList = [];
  userListData = [];
  transformerList = [];
  assignedtoList = [];
  countryList = [];
  stateList = [];
  cityList = [];
  zoneList = [];
  locationList = [];

  selectedZone;
  selectedLocation;

  /* edit Site varaible */
  editSiteData;
  siteList = [];
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddEditSiteManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private sitemanagerService: SiteManagerService,
    private globalService: GlobalService, private toastr: ToastrService, private ngxLoader: NgxUiLoaderService) {
    console.log("data=========", data)
    this.ngxLoader.startLoader('add-edit-site');
    this.sitemanagerService.getSiteList(JSON.parse(localStorage.getItem('userData'))).subscribe((response: any) => {
      if (response && response.code === '1') {
        this.siteList = response.result;
      }
    });
    /*this.sitemanagerService.getTransformerList(this.data.currentUserData).subscribe((response: any) => {
      if (response && response.code === '1') {
        this.transformerList = response.result;
      }
    });
     this.sitemanagerService.getUserListSite().subscribe((response: any) => {
      if (response && response.code === '1') {
        this.userList = response.result;
      }
    }); */

    forkJoin
      ([
        this.globalService.golbalMaster('country'),
        this.globalService.golbalMaster('role'),
        this.sitemanagerService.getUserListSite(),
        this.sitemanagerService.getTransformerList(this.data.currentUserData),
        this.sitemanagerService.getEnergyMeterList(this.data.currentUserData)
      ])
      .subscribe(
        (response: any) => {
          this.countryList = response[0].result;
          this.assignedtoList = response[1].result;
          this.userList = response[2].result;
          if(this.data.currentUserData.dashboard == 2){
            this.transformerList = response[4].result
          } else {
            this.transformerList = response[3].result;
          }
          this.assignedtoList = _.remove(this.assignedtoList, (o: any) => {
            return o.id !== 1;
          });
          this.ngxLoader.stopLoader('add-edit-site');
          if (this.data.type === 'edit') {
            this.ngxLoader.startLoader('add-edit-site');
            this.editSiteData = this.data.editSiteData;
            this.transformerList.push({ id: this.editSiteData.transformerid })
            this.setFormValue(this.editSiteData);
          }
        });

  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      transformer: new FormControl(null, [Validators.required]),
      assignedto: new FormControl(null, [Validators.required]),
      useradmin: new FormControl(null, [Validators.required]),
      user: new FormControl(null, []),
      country: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      zone: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      zonetext: new FormControl('', [Validators.maxLength(100)]),
      locationtext: new FormControl('', [Validators.maxLength(100)]),
      latitude: new FormControl('', [Validators.required]),
      longitude: new FormControl('', [Validators.required]),
      cost:new FormControl('', [Validators.required]),
    });
  }

  setFormValue(data) {
    console.log("edit data=====", data);
    if (this.data.currentUserData.roleid !== 1) {
      this.disableUserAdminflag=true;
    }else{
      this.disableUserAdminflag=false;
    }
    var useradmin = [];
    if (this.transformerList.length == 0) {
      this.transformerList.push({ id: data.transformerid });
    }
    let transformer = _.filter(this.transformerList, (o: any) => {
      return o.id === data.transformerid
    });
    if(this.data.currentUserData.dashboard == 2){
      transformer[0].deviceid = transformer[0].id;
    }
    let assignedto = _.filter(this.assignedtoList, (o: any) => {
      return o.id == data.assignedto
    });
    this.assignedtoSelection(assignedto[0]);
    let country = _.filter(this.countryList, (o: any) => {
      return o.id == data.country
    });
    this.countrySelection(country[0]);
    console.log("transformer=====", transformer)
    this.form.patchValue({
      name: data.sitename,
      transformer: transformer[0],
      assignedto: assignedto[0],
      country: country[0],
      zonetext: '',
      locationtext: '',
      latitude: data.latitude,
      longitude: data.longitude,
      cost:data.cost
    });
    this.ngxLoader.stopLoader('add-edit-site');
    console.log("AFTER EDIT BINDING==", this.form)
  }

  assignedtoSelection(assignedTo) {
    console.log('assignedTo====', this.userList, assignedTo);
    this.showUserAdmin = true;
    this.showUser = false;
    if (assignedTo.id === 2) {
      this.useradminList = _.filter(this.userList, (o: any) => {
        return o.role_id == assignedTo.id;
      });
      if (this.data.type === 'edit') {
        let useradmin = _.filter(this.useradminList, (o: any) => {
          return o.id == this.data.editSiteData.useradmin
        });
        console.log('useradmin==2==', useradmin);
        this.form.controls['useradmin'].setValue(useradmin[0]);
      }
    } else {
      this.showUser = true;
      if (this.data.currentUserData.roleid === 2) {
        this.useradminList = _.filter(this.userList, (o: any) => {
          return o.id == this.data.currentUserData.userid;
        });
        console.log('useradmin==2=if=', this.useradminList);
        this.form.controls['useradmin'].setValue(this.useradminList[0]);
        this.userAdminSelection(this.useradminList[0]);
      } else {
        this.useradminList = _.filter(this.userList, (o: any) => {
          return o.role_id === 2;
        });
        if (this.data.type === 'edit') {
          let useradmin = _.filter(this.useradminList, (o: any) => {
            return o.id == this.data.editSiteData.useradmin
          });
          console.log('useradmin==2=edit=', useradmin);
          this.form.controls['useradmin'].setValue(useradmin[0]);
          this.userAdminSelection(useradmin[0]);
        }
      }
    }
  }

  userAdminSelection(useradmin) {
    this.userListData = _.filter(this.userList, (o: any) => {
      return o.role_id != 2 && o.utility_id == useradmin.utility_id;
    });
    if (this.data.type === 'edit') {
      let user = _.filter(this.userListData, (o: any) => {
        return o.id == this.editSiteData.user
      });
      this.form.controls['user'].setValue(user[0]);
    }
    console.log(' this.userListData ====', this.userList, 'data==', this.userListData);
  }

  countrySelection(country) {
    this.stateList = [];
    this.cityList = [];
    this.zoneList = [];
    this.locationList = [];
    this.globalService.getStateList(country).subscribe((response: any) => {
      if (response && response.code === '1') {
        this.stateList = response.result;
        if (this.data.type === 'edit') {
          let state = _.filter(this.stateList, (o: any) => {
            return o.id == this.editSiteData.state
          });
          this.form.controls['state'].setValue(state[0]);
          this.stateSelection(state[0]);
        }
      }
    });
  }

  stateSelection(state) {
    this.cityList = [];
    this.zoneList = [];
    this.locationList = [];
    this.globalService.getCityList(state).subscribe((response: any) => {
      if (response && response.code === '1') {
        this.cityList = response.result;
        if (this.data.type === 'edit') {
          let city = _.filter(this.cityList, (o: any) => {
            return o.id == this.editSiteData.city
          });
          this.form.controls['city'].setValue(city[0]);
          this.citySelection(city[0]);
        }
      }
    });
  }

  citySelection(city) {
    this.zoneList = [];
    this.locationList = [];
    this.globalService.getZoneList(city).subscribe((response: any) => {
      if (response && response.code === '1') {
        this.zoneList = response.result;
        if (this.data.type === 'edit') {
          let zone = _.filter(this.zoneList, (o: any) => {
            return o.id == this.editSiteData.zone
          });
          this.form.controls['zone'].setValue(zone[0]);
          this.zoneSelection(zone[0]);
        }
      }
    });
  }

  zoneSelection(zone) {
    this.locationList = [];
    this.globalService.getSiteLocationList(zone).subscribe((response: any) => {
      if (response && response.code === '1') {
        this.locationList = response.result;
        if (this.data.type === 'edit') {
          let location = _.filter(this.locationList, (o: any) => {
            return o.id == this.editSiteData.location
          });
          this.form.controls['location'].setValue(location[0]);
        }
      }
    });
  }

  addZone() {
    this.isnewZone = true;
    this.selectedZone = null;
    this.form.controls['zone'].setValue(null);

    this.form.get('zone').setValidators(null);
    this.form.get('zonetext').setValidators([Validators.required]);
    this.form.get('zone').updateValueAndValidity();
    this.form.get('zonetext').updateValueAndValidity();
  }
  removeZone() {
    this.isnewZone = false;
    this.form.controls['zonetext'].setValue('');

    this.form.get('zonetext').setValidators(null);
    this.form.get('zone').setValidators([Validators.required]);
    this.form.get('zone').updateValueAndValidity();
    this.form.get('zonetext').updateValueAndValidity();
  }

  addLocation() {
    this.isnewLocation = true;
    this.selectedLocation = null;
    this.form.controls['location'].setValue(null);

    this.form.get('location').setValidators(null);
    this.form.get('locationtext').setValidators([Validators.required]);
    this.form.get('location').updateValueAndValidity();
    this.form.get('locationtext').updateValueAndValidity();
  }
  removeLocation() {
    this.isnewLocation = false;
    this.form.controls['locationtext'].setValue('');

    this.form.get('locationtext').setValidators(null);
    this.form.get('location').setValidators([Validators.required]);
    this.form.get('location').updateValueAndValidity();
    this.form.get('locationtext').updateValueAndValidity();
  }

  submit(formData) {
    formData = formData.value;
    if (formData.zonetext) {
      let checkDuplicateZone = _.filter(this.zoneList, (o: any) => {
        return o.name === formData.zonetext
      });
      if (checkDuplicateZone.length > 0) {
        this.toastr.error('Zone Already Exist');
        return;
      }
    }
    if (formData.locationtext) {
      let checkDuplicateLocation = _.filter(this.locationList, (o: any) => {
        return o.name === formData.locationtext
      });
      if (checkDuplicateLocation.length > 0) {
        this.toastr.error('Location Already Exist');
        return;
      }
    }

    if (this.data.type === 'add') {
      let checkDuplicateSite = _.filter(this.siteList, (o: any) => {
        return o.sitename === formData.name
      });
      if (checkDuplicateSite.length > 0) {
        this.toastr.error('Site Already Exist');
        return;
      } else {
        this.payloadSiteManager(formData, 'add');
      }
    } else {
      let checkDuplicateSite = _.filter(this.siteList, (o: any) => {
        return o.name === formData.name && o.id != this.editSiteData.id;
      });
      if (checkDuplicateSite.length > 0) {
        this.toastr.error('Site Already Exist');
        return;
      } else {
        this.payloadSiteManager(formData, 'edit');
      }
    }
  }

  payloadSiteManager(formData, type) {
    console.log("formData============", formData)
    let id;
    if(this.data.currentUserData.dashboard == 2){
      id = formData.transformer.deviceid
    } else {
      id = formData.transformer.id
    }
    let payload = {
      "sitename": (formData.name).trim(),
      "assignedto": formData.assignedto.id,
      "useradmin": formData.useradmin.id,
      "user": formData.user && typeof (formData.user) === 'object' && formData.assignedto.id === 3 ? formData.user.id : null,
      "country": formData.country.id,
      "state": formData.state.id,
      "city": formData.city.id,
      "zonename": (formData.zonetext).trim() ? (formData.zonetext).trim() : '',
      "zone": formData.zone ? formData.zone.id : null,
      "locationname": (formData.locationtext).trim() ? (formData.locationtext).trim() : '',
      "location": formData.location ? formData.location.id : null,
      "latitude": formData.latitude,
      "longitude": formData.longitude,
      "transformerid": id,
      "cost":formData.cost
    };
    console.log("form++++", payload)
    this.ngxLoader.startLoader('add-edit-site');
    if (type === 'add') {
      this.sitemanagerService.addSite(payload).subscribe((response: any) => {
        this.ngxLoader.stopLoader('add-edit-site');
        this.toastr.success('Site Added Successfully');
        console.log("response==", response)
        this.close();
      })
    } else {
      this.sitemanagerService.updateSiteData(payload, this.editSiteData.id).subscribe((response: any) => {
        this.ngxLoader.stopLoader('add-edit-site');
        this.toastr.success('Site Updated Successfully');
        console.log("response==", response)
        this.close();
      })
    }
  }

  close() {
    this.dialogRef.close();
  }
}
