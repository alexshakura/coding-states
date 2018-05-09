import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';

import { TableDataService } from './services/table-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgModule } from '@angular/core';

import './rxjs-operators';

import { AppComponent } from './app.component';
import { CodingAlgorithmDialogComponent } from './coding-algorithm-dialog/coding-algorithm-dialog.component';
import { CodingAlgorithmsService } from './services/coding-algorithms.service';
import { DocxGeneratorService } from './services/docx-generator.service';
import { ElectronService } from './services/electron.service';
import { OutputFunctionsTableComponent } from './output-functions-table/output-functions-table.component';
import { SharedModule } from './shared/shared.module';
import { SnackBarService } from './services/snack-bar.service';
import { StructureTableComponent } from './structure-table/structure-table.component';
import { TableConfigDialogComponent } from './table-config-dialog/table-config-dialog.component';
import { TransitionFunctionsTableComponent } from './transition-functions-table/transition-functions-table.component';
import { VertexCodesTableComponent } from './vertex-codes-table/vertex-codes-table.component';
import { WindowService } from './services/window.service';


@NgModule({
  declarations: [
    AppComponent,
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
    HttpModule,
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
    WindowService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
