import { NgModule } from '@angular/core';

import {
  MatCardModule, MatInputModule, MatButtonModule, MatIconModule,
  MatProgressBarModule, MatToolbarModule, MatListModule,
  MatSidenavModule, MatTableModule, MatSortModule, MatPaginatorModule,
  MatDialogModule, MatSelectModule,MatMenuModule, MatTabsModule,  
  MatDatepickerModule,MatNativeDateModule, MatRadioModule, 
  MatSlideToggleModule, MatOptionModule,MatBadgeModule,MatCheckboxModule
} from '@angular/material';
import { MatTableExporterModule } from 'mat-table-exporter';

const modules = [
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatProgressBarModule,
  MatToolbarModule,
  MatListModule,
  MatSidenavModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatDialogModule,
  MatSelectModule,
  MatMenuModule,
  MatTabsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatCardModule,
  MatSlideToggleModule,
  MatOptionModule,
  MatBadgeModule,
  MatCheckboxModule,
  MatTableExporterModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }
