import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddEditSiteManagerComponent } from '../add-edit-site-manager/add-edit-site-manager.component';
import { ConfirmationDailogComponent } from '../confirmation-dailog/confirmation-dailog.component';
import { SiteManagerService } from '../services/site-manager.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-site-manager',
  templateUrl: './site-manager.component.html',
  styleUrls: ['./site-manager.component.css']
})
export class SiteManagerComponent implements OnInit {

  displayedColumns: string[] = ['sitename', 'transformerid', 'fullname', 'action'];
  dataSource;
  currentUserData;
  selectedRole;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private siteService: SiteManagerService,
    private toastr: ToastrService, private ngxLoader: NgxUiLoaderService) {

  }

  ngOnInit() {
    this.currentUserData = JSON.parse(localStorage.getItem('userData'));
    this.getSiteList();
  }

  getSiteList() {
    this.ngxLoader.startLoader('site-manager-list');
    this.siteService.getSiteList(JSON.parse(localStorage.getItem('userData'))).subscribe((response: any) => {
      if (response && response.code === '1') {
        this.ngxLoader.stopLoader('site-manager-list');
        this.dataSource = new MatTableDataSource(response.result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
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
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  edit(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      type: 'edit',
      currentUserData: this.currentUserData,
      editSiteData: data
    };
    let dialogRef = this.dialog.open(AddEditSiteManagerComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((response) => {
      this.getSiteList();
    })
  }

  delete(data) {
    console.log('data===delete=', data);
    let dialogRef = this.dialog.open(ConfirmationDailogComponent);
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.siteService.deleteSite(data).subscribe((response: any) => {
          if (response && response.code === '1') {
            this.toastr.success('Record Deleted Successfully');
            this.getSiteList();
          }
        });
      }
    })
  }

  addSite() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      type: 'add',
      currentUserData: this.currentUserData
    };
    let dialogRef = this.dialog.open(AddEditSiteManagerComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((response) => {
      this.getSiteList();
    })
  }

}
