import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from "lodash";
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
import { GlobalService } from '../services/global.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit {
  hide = true;
  form: FormGroup;

  countryList = [];
  stateList = [];
  stateListData = [];
  cityList = [];
  cityListData = [];
  utilityList = [];
  dashboardList = [];
  utility_id;
  roleid ;
  loginUserResponse;
  hvlvreportaccess;
  updownreportaccess;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private userService: UserService,
    private globalService: GlobalService, private toastr: ToastrService, private ngxLoader: NgxUiLoaderService) {
    console.log("data=========", data)
    this.createForm();
  }

  ngOnInit() {
    this.getAllMasters();
    console.log("liahdoshuihuihiahduishauhsauidhsahda",this.data.editUserData);

    this.roleid = this.data.currentUserData.roleid;
    this.userService.getLoginUserdata(this.data.currentUserData.userid ).subscribe((response: any) => {
      console.log("role_id===response=======", response)
      if (response && response.result.length > 0) {
       this.loginUserResponse = response.result;
       this.hvlvreportaccess =  response.result[0].hvlvreportaccess;
       this.updownreportaccess = response.result[0].updownreportaccess
      }
    })
  }

  getAllMasters() {
    this.ngxLoader.startLoader('add-edit-user');
    forkJoin
      ([
        this.globalService.golbalMaster('country'),
        this.globalService.golbalMaster('utility'),
        this.globalService.golbalMaster('dashboard'),
      ])
      .subscribe(
        (response: any) => {
          this.ngxLoader.stopLoader('add-edit-user');
          this.countryList = response[0].result;
          this.utilityList = response[1].result;
          this.dashboardList = response[2].result;

          if (this.data.type === 'add') {
            this.setUtility();
          }
          if (this.data.type === 'edit') {
            this.setFormValue();
          }
        });
  }

  createForm() {
    this.form = this.fb.group({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      lastName: new FormControl('', [Validators.maxLength(100)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      password: new FormControl('', [Validators.required, , Validators.maxLength(50)]),
      address: new FormControl('', [Validators.required]),
      locality: new FormControl('', [Validators.required, , Validators.maxLength(200)]),
      country: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      timezone:new FormControl('',[Validators.required]),
      dashboard:new FormControl('',[Validators.required]),
      hvlvreportaccess:[false],
      updownreportaccess:[false]
    });
    if (this.data.roleid == 2 && this.data.currentUserData.roleid == 1) {
      this.form.addControl('utilityName', new FormControl('', [Validators.required]));
    } else {
      this.form.addControl('utilityName', new FormControl(null, [Validators.required]));
      this.form.addControl('userAdmin', new FormControl(''));
    }
  }

  setFormValue() {
    this.ngxLoader.startLoader('add-edit-user');
    console.log("liahdoshuihuihiahduishauhsauidhsahda",this.data.editUserData);
    let country = _.filter(this.countryList, (o: any) => {
      return o.id == this.data.editUserData.country_id
    });
    let dashboard = _.filter(this.dashboardList, (o: any) => {
      return o.dashboard_id == this.data.editUserData.dashboard
    });
    console.log("++++++++++++++++++++++++++",dashboard,this.dashboardList,this.countryList);
    this.countrySelection(country[0]);
    /* let state = _.filter(this.stateList, (o: any) => {
      return o.id == this.data.editUserData.state_id
    });
    let city = _.filter(this.cityList, (o: any) => {
      return o.id == this.data.editUserData.city_id
    }); */
    /* Field binding */
    this.form.get('password').setValidators(null);
    this.form.get('password').updateValueAndValidity();

    this.form.controls['firstName'].setValue(this.data.editUserData.first_name);
    this.form.controls['lastName'].setValue(this.data.editUserData.last_name);
    this.form.controls['email'].setValue(this.data.editUserData.email);
    this.form.controls['contact'].setValue(this.data.editUserData.mobile_number);
    //this.form.controls['password'].setValue('nuc1234');
    this.form.controls['address'].setValue(this.data.editUserData.address);
    this.form.controls['locality'].setValue(this.data.editUserData.locality);
    this.form.controls['country'].setValue(country[0]);
    this.form.controls['timezone'].setValue(this.data.editUserData.timezone);
    this.form.controls['hvlvreportaccess'].setValue(this.data.editUserData.hvlvreportaccess ==='1'? true: false)
    this.form.controls['updownreportaccess'].setValue(this.data.editUserData.updownreportaccess ==='1'? true: false);
    this.form.controls['dashboard'].setValue(dashboard[0]);

    
    //this.form.controls['state'].setValue(state[0]);
    //this.form.controls['city'].setValue(city[0]);
    this.setUtility();
  }

  setUtility() {
    if (this.data.roleid == 3 && this.data.currentUserData.roleid == 2) {
      let utility = _.filter(this.utilityList, (o: any) => {
        return o.id == this.data.currentUserData.utility.id
      })
      this.form.controls['utilityName'].setValue(utility[0]);
      this.utility_id=utility[0];
      this.onSelectUtilityChange(utility[0])
    }
    if (this.data.roleid == 2 && this.data.currentUserData.roleid == 1 && this.data.type === 'edit') {
      this.form.controls['utilityName'].setValue(this.data.editUserData.utilityName);
      this.utility_id=this.data.editUserData.utility_id;
    }
    if (this.data.roleid == 3 && this.data.currentUserData.roleid == 1 && this.data.type === 'edit') {
      let utility = _.filter(this.utilityList, (o: any) => {
        return o.id == this.data.editUserData.utility_id;
      })
      this.form.controls['utilityName'].setValue(utility[0]);
      this.utility_id=this.data.editUserData.utility_id;
      this.onSelectUtilityChange(utility[0])
    }
    this.ngxLoader.stopLoader('add-edit-user');
    /* let utility = _.filter(this.utilityList, (o: any) => {
      return o.id == this.data.currentUserData.utility.id
    })
    this.form.controls['utilityName'].setValue(utility[0]); */

  }

  onSelectUtilityChange(utility) {
    this.utility_id=utility.id;
    if (this.data.type === 'edit') {
      this.data.editUserData.utility_id = utility.id;
    }
    this.userService.getUserAdmin({ "utility_id": utility.id, "role_id": 2 }).subscribe((response: any) => {
      console.log("role_id===response=======", response)
      if (response && response.result.length > 0) {
        this.form.controls['userAdmin'].setValue(response.result[0].first_name + " " + response.result[0].last_name);
      }
    })
  }

  countrySelection(country) {
    this.stateList = [];
    this.cityList = [];
    this.globalService.getStateList(country).subscribe((response: any) => {
      if (response && response.code === '1') {
        this.stateList = response.result;
        if (this.data.type === 'edit') {
          let state = _.filter(this.stateList, (o: any) => {
            return o.id == this.data.editUserData.state_id
          });
          this.form.controls['state'].setValue(state[0]);
          this.stateSelection(state[0]);
        }
      }
    });
  }

  stateSelection(state) {
    this.cityList = [];
    console.log("state==", state)
    this.globalService.getCityList(state).subscribe((response: any) => {
      if (response && response.code === '1') {
        this.cityList = response.result;
        if (this.data.type === 'edit') {
          let city = _.filter(this.cityList, (o: any) => {
            return o.id == this.data.editUserData.city_id
          });
          this.form.controls['city'].setValue(city[0]);
        }
      }
    });
  }

  submit(formData) {
    if (this.data.type === 'add') {
      this.addUser(formData.value);
    } else {
      this.editUser(formData.value)
    }
  }

  addUser(formData) {
    let payload = {
      "email": (formData.email).trim(),
      "first_name": (formData.firstName).trim(),
      "last_name": (formData.lastName).trim(),
      "mobile_number": formData.contact,
      "password": (formData.password).trim(), 
      "status": 1,
      "created_date": moment().format('YYYY-MM-DD'),
      "role_id": this.data.roleid,
      "address": (formData.address).trim(),
      "locality": (formData.locality).trim(),
      "city_id": formData.city.id,
      "country" : formData.country.id,
      "timezone":formData.timezone,
      "hvlvreportaccess":formData.hvlvreportaccess,
      "updownreportaccess":formData.updownreportaccess,
      "utilityName": typeof (formData.utilityName) === 'string' ? (formData.utilityName).trim() : (formData.utilityName.name).trim(),
      "dashboard":formData.dashboard.dashboard_id
    };
    console.log("form++++", JSON.stringify(payload))
    this.ngxLoader.startLoader('add-edit-user');
    this.userService.addUser(payload).subscribe((response: any) => {
      console.log("response==", response)
      this.ngxLoader.stopLoader('add-edit-user');
      if (response && response.code === '-2') {
        this.toastr.success(response.message);
      } else if (response && response.code === '-3') {
        this.toastr.success(response.message);
      } else {
        this.toastr.success('User Added Successfully');
        this.close();
      }
    })
  }

  editUser(formData) {
    console.log("////////////////////",formData);
    let payload = {
      "email": (formData.email).trim(),
      "first_name": (formData.firstName).trim(),
      "last_name": (formData.lastName).trim(),
      "mobile_number": formData.contact,
      "password": (formData.password).trim(),
      "role_id": this.data.roleid,
      "address": (formData.address).trim(),
      "locality": (formData.locality).trim(),
      "location_id": this.data.editUserData.location_id,
      "city_id": formData.city.id,
      "country" : formData.country.id,
      "timezone":formData.timezone,
      "hvlvreportaccess":formData.hvlvreportaccess,
      "updownreportaccess":formData.updownreportaccess,
      "utilityName": typeof (formData.utilityName) === 'string' ? (formData.utilityName).trim() : (formData.utilityName.name).trim(),
      "utility_id":this.utility_id,
      "dashboard":formData.dashboard.dashboard_id
    };
    console.log("form+ EDIT+++", formData, payload)
    this.ngxLoader.startLoader('add-edit-user');
    this.userService.updateUser(payload, this.data.editUserData.id).subscribe((response: any) => {
      console.log("response==", response)
      this.ngxLoader.stopLoader('add-edit-user');
      if (response && response.code === '-2') {
        this.toastr.success(response.message);
      } else if (response && response.code === '-3') {
        this.toastr.success(response.message);
      } else {
        this.toastr.success('User Updated Successfully');
        this.close();
      }
    })
  }

  close() {
    this.dialogRef.close();
  }
}
