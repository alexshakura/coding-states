import { TableDataService } from './services/table-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatTableModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSortModule,
  MatRadioModule,
  MatPaginatorIntl,
} from '@angular/material';
import { NgModule } from '@angular/core';

import './rxjs-operators';

import { AppComponent } from './app.component';
import { StructureTableComponent } from './structure-table/structure-table.component';
import { TableConfigDialogComponent } from './table-config-dialog/table-config-dialog.component';

import { CustomMatPaginatorIntlRu } from './custom-paginator';


@NgModule({
  declarations: [
    AppComponent,
    StructureTableComponent,
    TableConfigDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,

    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSortModule,
    MatToolbarModule,
    MatTooltipModule,
    MatInputModule
 ],
 entryComponents: [
    TableConfigDialogComponent
 ],
  providers: [
    TableDataService,
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlRu }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
