import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmstreeComponent } from './emstree/emstree.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { IndividualDashboardComponent } from './individual-dashboard/individual-dashboard.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth.guard';
import { SiteManagerComponent } from './site-manager/site-manager.component';
import { DemandTrendAnalysisComponent } from './demand-trend-analysis/demand-trend-analysis.component';
import { DemandTrendAnalysisAvailabilityComponent } from './demand-trend-analysis-availability/demand-trend-analysis-availability.component';
import { TransfomerManagerComponent } from './transformer/transformer-manager/transfomer-manager.component';
import { DeviceManagerComponent } from './device/device-master/devicemaster.component';
import { ReportComponent } from './reports/report.component';
import { AlertReportComponent } from './reports/alert/alert-report.component';
import { AccessAuthGuard } from './access-auth.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { OnlineofflinereportComponent } from './reports/onlineofflinereport/onlineofflinereport.component';
import { OnlineofflineanalysisComponent } from './demand-trend-analysis/onlineofflineanalysis/onlineofflineanalysis.component';
import { HvlvdiffreportComponent } from './reports/hvlvdiffreport/hvlvdiffreport.component';
import { EmsComponent } from './ems/ems.component';
import { EnergymeterManagerComponent } from './energymeter-manager/energymeter-manager.component';
import { EmsreportComponent } from './reports/emsreport/emsreport.component';
import { EmsIndividualDashboardComponent } from './ems-individual-dashboard/ems-individual-dashboard.component';
import { DashboardSelectionComponent } from './dashboard-selection/dashboard-selection.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/signin',
    pathMatch: 'full'
  },
  {
    path: 'auth/signin',
    component: LoginComponent
  },
  {
    path: '', component: SideNavComponent, canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AccessAuthGuard]},
      { path: 'individual-status', component: IndividualDashboardComponent, canActivate: [AccessAuthGuard] },
      { path: 'user', component: UserComponent, canActivate: [AccessAuthGuard]},
      { path: 'site', component: SiteManagerComponent, canActivate: [AccessAuthGuard]},
      { path: 'demand-trend', component: DemandTrendAnalysisComponent, canActivate: [AccessAuthGuard] },
      { path: 'downtime-analysis', component: DemandTrendAnalysisAvailabilityComponent, canActivate: [AccessAuthGuard] }, 
      { path: 'updowntime-analysis', component: OnlineofflineanalysisComponent, canActivate: [AccessAuthGuard] },   
      {path: 'transformerManager', component: TransfomerManagerComponent, canActivate: [AccessAuthGuard]},   
      {path: 'deviceMaster', component: DeviceManagerComponent, canActivate: [AccessAuthGuard]},
      {path: 'report', component: ReportComponent, canActivate: [AccessAuthGuard]},
      {path: 'report/:transformerid', component: ReportComponent, canActivate: [AccessAuthGuard]},
      {path: 'alertReport', component:AlertReportComponent, canActivate: [AccessAuthGuard]},
      {path: 'upDownReport', component:OnlineofflinereportComponent, canActivate: [AccessAuthGuard]},
      {path: 'hvlvdiff', component:HvlvdiffreportComponent, canActivate: [AccessAuthGuard]},
      {path: 'ems', component:EmsComponent, canActivate: [AccessAuthGuard]},
      {path: 'energymetermanager', component:EnergymeterManagerComponent, canActivate: [AccessAuthGuard]},
      {path: 'emsreport', component:EmsreportComponent, canActivate: [AccessAuthGuard]},
      {path: 'emstree',component:EmstreeComponent, canActivate: [AccessAuthGuard]},
      {path: 'emsindividualdashboard', component:EmsIndividualDashboardComponent, canActivate: [AccessAuthGuard]},
      {path: 'access-denied', component:AccessDeniedComponent, canActivate: [AccessAuthGuard]}
    ]
  },
  {
  path: 'dashboardselection', component:DashboardSelectionComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
