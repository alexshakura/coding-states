import 'reflect-metadata';
import '../../polyfills';

import { TableDataService } from './services/table-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';

import { RootComponent } from './root.component';
import { CodingAlgorithmDialogComponent } from './coding-algorithm-dialog/coding-algorithm-dialog.component';
import { CodingAlgorithmsService } from './services/coding-algorithms.service';
import { DocxGeneratorService } from './services/docx-generator.service';
import { ElectronService } from './services/electron.service';
import { OutputFunctionsTableComponent } from './output-functions-table/output-functions-table.component';
import { SharedModule } from '../shared/shared.module';
import { SnackBarService } from './services/snack-bar.service';
import { StructureTableComponent } from './structure-table/structure-table.component';
import { TableConfigDialogComponent } from './table-config-dialog/table-config-dialog.component';
import { TransitionFunctionsTableComponent } from './transition-functions-table/transition-functions-table.component';
import { VertexCodesTableComponent } from './vertex-codes-table/vertex-codes-table.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    RootComponent,
    CodingAlgorithmDialogComponent,
    OutputFunctionsTableComponent,
    StructureTableComponent,
    TableConfigDialogComponent,
    TransitionFunctionsTableComponent,
    VertexCodesTableComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
 ],
  entryComponents: [
    CodingAlgorithmDialogComponent,
    TableConfigDialogComponent,
 ],
  providers: [
    CodingAlgorithmsService,
    DocxGeneratorService,
    ElectronService,
    SnackBarService,
    TableDataService,
  ],
  bootstrap: [RootComponent],
})
export class RootModule { }
