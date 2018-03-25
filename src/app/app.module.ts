import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatButtonModule,
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
  MatRadioModule,
} from '@angular/material';
import { NgModule } from '@angular/core';

import './rxjs-operators';

import { AppComponent } from './app.component';
import { StructureTableComponent } from './structure-table/structure-table.component';
import { TableDataDialogComponent } from './table-data-dialog/table-data-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    StructureTableComponent,
    TableDataDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,

    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatToolbarModule,
    MatTooltipModule,
    MatInputModule
 ],
 entryComponents: [
    TableDataDialogComponent
 ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
