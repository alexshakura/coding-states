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
  MatProgressSpinnerModule,
} from '@angular/material';
import { NgModule } from '@angular/core';

import './rxjs-operators';

import { AppComponent } from './app.component';
import { StructureTableComponent } from './structure-table/structure-table.component';
import { TableConfigDialogComponent } from './table-config-dialog/table-config-dialog.component';

import { CustomMatPaginatorIntlRu } from './custom-paginator';
import { CodingAlgorithmDialogComponent } from './coding-algorithm-dialog/coding-algorithm-dialog.component';
import { CodingAlgorithmsService } from './services/coding-algorithms.service';
import { VertexCodesTableComponent } from './vertex-codes-table/vertex-codes-table.component';
import { OutputFunctionsTableComponent } from './output-functions-table/output-functions-table.component';


@NgModule({
  declarations: [
    AppComponent,
    StructureTableComponent,
    TableConfigDialogComponent,
    CodingAlgorithmDialogComponent,
    VertexCodesTableComponent,
    OutputFunctionsTableComponent
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
    MatProgressSpinnerModule,
    MatSortModule,
    MatToolbarModule,
    MatTooltipModule,
    MatInputModule
 ],
 entryComponents: [
    CodingAlgorithmDialogComponent,
    TableConfigDialogComponent
 ],
  providers: [
    TableDataService,
    CodingAlgorithmsService,
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlRu }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
