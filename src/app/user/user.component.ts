import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { AddEditUserComponent } from '../add-edit-user/add-edit-user.component';
import { UserService } from '../services/user.service';
import { GlobalService } from '../services/global.service';
import * as _ from "lodash";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationDailogComponent } from '../confirmation-dailog/confirmation-dailog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['first_name', 'email', 'role_name', 'status', 'action'];
  dataSource;
  roleList = [];
  currentUserData;
  selectedRole;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private userService: UserService,
    private globalService: GlobalService, private toastr: ToastrService, private ngxLoader: NgxUiLoaderService) {

  }

  ngOnInit() {
    this.globalService.golbalMaster('role').subscribe((response: any) => {
      if (response && response.code === '1') {
        this.roleList = response.result;
        this.currentUserData = JSON.parse(localStorage.getItem('userData'));
        if (this.currentUserData.roleid == 1) {
          this.roleList = _.remove(this.roleList, (o: any) => {
            return o.id !== 1;
          });
        } else if (this.currentUserData.roleid == 2) {
          this.roleList = _.remove(this.roleList, (o: any) => {
            return o.id !== 1 && o.id !== 2;
          });
        } else {
          this.roleList = [];
        }
      }
    });
    this.getUserList();
  }

  getUserList() {
    this.ngxLoader.start();
    this.dataSource = [];
    this.userService.getUserList(JSON.parse(localStorage.getItem('userData'))).subscribe((response: any) => {
      console.log("sdfhsdhfuisdsdfhnsudfsdusdhusd",response);
      if (response && response.hasOwnProperty('code') && response.code === '1') {
        this.ngxLoader.stop();
        let data = [];
        data =  response.result;
        if(this.currentUserData.dashboard == 2){
          data = [];
          for(let i=0;i<response.result.length;i++){
            if(response.result[i].dashboard == 2){
              data.push(response.result[i]);
            }
          }
        }
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } else {
        this.ngxLoader.stop();
      }
    }, (error) => {
      this.ngxLoader.stop();
    });
  }

  ngAfterViewInit(): void {
    /* this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; */
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  edit(data) {
    console.log('data==edit==', data);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      type: 'edit',
      roleid: data.role_id,
      currentUserData: this.currentUserData,
      editUserData: data
    };
    let dialogRef = this.dialog.open(AddEditUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((response) => {
      this.getUserList();
    })
  }

  delete(data) {
    console.log('data===delete=', data);
    let payload = {
      id: data.id,
      role_id: data.role_id,
      location_id: data.location_id,
      utility_id: data.utility_id
    };
    let dialogRef = this.dialog.open(ConfirmationDailogComponent);
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.userService.deleteUser(JSON.stringify(payload)).subscribe((response: any) => {
          if (response && response.code === '1') {
            this.toastr.success('Record Deleted Successfully');
            this.getUserList();
          } else if (response && response.code === '-2') {
            this.toastr.error(response.result, response.message, {
              disableTimeOut: true
            });
          }
        });
      }
    })
  }

  onSelectRoleValueChange(selectedRole) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      type: 'add',
      roleid: selectedRole.id,
      currentUserData: this.currentUserData
    };
    let dialogRef = this.dialog.open(AddEditUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((response) => {
      this.getUserList();
    })
  }

}
