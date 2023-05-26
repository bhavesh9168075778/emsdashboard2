import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmstreeComponent } from './emstree/emstree.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from "src/app/material.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { AgmCoreModule } from '@agm/core';
import { IndividualDashboardComponent } from './individual-dashboard/individual-dashboard.component';
import { DashboardService } from './services/dashboard.service';
import { SseService } from './services/sse.service';
import { LoginService } from './services/login.service';
import { GlobalService } from './services/global.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { ApiInterceptor } from './api-interceptor';
import { AuthGuard } from './auth.guard';
import { NgxUiLoaderModule,NgxUiLoaderService,NgxUiLoaderRouterModule} from 'ngx-ui-loader';
import { SiteManagerComponent } from './site-manager/site-manager.component';
import { AddEditSiteManagerComponent } from './add-edit-site-manager/add-edit-site-manager.component';
import { SiteManagerService } from './services/site-manager.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DemandTrendAnalysisComponent } from './demand-trend-analysis/demand-trend-analysis.component';
import { DemandTrendAnalysisAvailabilityComponent } from './demand-trend-analysis-availability/demand-trend-analysis-availability.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ConfirmationDailogComponent } from './confirmation-dailog/confirmation-dailog.component';
import { ToastrModule } from 'ngx-toastr';
import { TransfomerManagerComponent } from './transformer/transformer-manager/transfomer-manager.component';
import { AddTransformerComponent } from './transformer/add-transformer/add-transformer.component';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';
import { DeviceManagerComponent } from './device/device-master/devicemaster.component';
import { AddDeviceComponent } from './device/add-device/add-device.component';
import { DeviceMasterService } from './services/device-master.service';
import { ReportComponent } from './reports/report.component';
import { ReportService } from './services/report.service';
import { AlertReportComponent } from './reports/alert/alert-report.component';
import { CustomDateComponent } from './reports/customdate/custom-date.component';
import { AlertComponent } from './alert/alert.component';
import { AccessAuthGuard } from './access-auth.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { GaugeChartModule } from 'angular-gauge-chart';
import { CircularGaugeModule } from '@syncfusion/ej2-angular-circulargauge';
import { GradientService } from '@syncfusion/ej2-angular-circulargauge';
import { OnlineofflinereportComponent } from './reports/onlineofflinereport/onlineofflinereport.component';
import { OnlineofflineanalysisComponent } from './demand-trend-analysis/onlineofflineanalysis/onlineofflineanalysis.component';
import { HvlvdiffreportComponent } from './reports/hvlvdiffreport/hvlvdiffreport.component';
import { FileUploadModule } from "ng2-file-upload";
import { EmsComponent } from './ems/ems.component';
import { EnergymeterManagerComponent } from './energymeter-manager/energymeter-manager.component';
import { AddUpdateEnergymeterComponent } from './energymeter-manager/add-update-energymeter/add-update-energymeter.component';
import { EmsreportComponent } from './reports/emsreport/emsreport.component';
import { EmsIndividualDashboardComponent } from './ems-individual-dashboard/ems-individual-dashboard.component';
import { DashboardSelectionComponent } from './dashboard-selection/dashboard-selection.component';
import { MatTooltipModule } from '@angular/material/tooltip';

PlotlyModule.plotlyjs = PlotlyJS;
const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};

@NgModule({
  declarations: [
    AppComponent,
    EmstreeComponent,
    LoginComponent,
    DashboardComponent,
    SideNavComponent,
    IndividualDashboardComponent,
    UserComponent,
    AddEditUserComponent,
    SiteManagerComponent,
    AddEditSiteManagerComponent,
    DemandTrendAnalysisComponent,
    DemandTrendAnalysisAvailabilityComponent,
    ConfirmationDailogComponent,
    TransfomerManagerComponent,
    AddTransformerComponent,
  DeviceManagerComponent,
  AddDeviceComponent,
  ReportComponent,
  AlertReportComponent,
CustomDateComponent,
AlertComponent,
AccessDeniedComponent,
OnlineofflinereportComponent,
OnlineofflineanalysisComponent,
HvlvdiffreportComponent,
EmsComponent,
EnergymeterManagerComponent,
AddUpdateEnergymeterComponent,
EmsreportComponent,
EmsIndividualDashboardComponent,
DashboardSelectionComponent
  ],
  imports: [
    BrowserModule,
    MatTooltipModule,
    CircularGaugeModule,
    GaugeChartModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    PlotlyModule,
    FileUploadModule,
    NgxUiLoaderModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ToastrModule.forRoot({
      timeOut: 4500,
      preventDuplicates: false
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAPySGROwj9kE2OmvGNVLLy0qGmTmyKzMU'/* 'AIzaSyCKUJQ_V-tWsf7OH2d9LKPCDJGkOAWSG8g' */
    })
  ],
  providers: [
    DashboardService,
    SseService,
    GradientService,
    LoginService,
    GlobalService,
    SiteManagerService,
    DeviceMasterService,
    AuthGuard,
    AccessAuthGuard,
    NgxUiLoaderService,
    ReportService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddEditUserComponent,AddEditSiteManagerComponent, AddTransformerComponent, AddDeviceComponent, ConfirmationDailogComponent, CustomDateComponent, AlertComponent,AddUpdateEnergymeterComponent]
})
export class AppModule { }
