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
  MatTooltipModule,
  MatCheckboxModule,
  MatRadioModule,
} from '@angular/material';
import { NgModule } from '@angular/core';

import './rxjs-operators';

import { AppComponent } from './app.component';
import { StructureTableComponent } from './structure-table/structure-table.component';
import { TableLengthDialogComponent } from './table-length-dialog/table-length-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    StructureTableComponent,
    TableLengthDialogComponent
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
    MatRadioModule,
    MatTooltipModule,
    MatInputModule
 ],
 entryComponents: [
    TableLengthDialogComponent
 ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
