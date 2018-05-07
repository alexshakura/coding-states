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
import { StructureTableComponent } from './structure-table/structure-table.component';
import { TableConfigDialogComponent } from './table-config-dialog/table-config-dialog.component';

import { CodingAlgorithmDialogComponent } from './coding-algorithm-dialog/coding-algorithm-dialog.component';
import { CodingAlgorithmsService } from './services/coding-algorithms.service';
import { VertexCodesTableComponent } from './vertex-codes-table/vertex-codes-table.component';
import { OutputFunctionsTableComponent } from './output-functions-table/output-functions-table.component';
import { TransitionFunctionsTableComponent } from './transition-functions-table/transition-functions-table.component';
import { ElectronService } from './services/electron.service';
import { SnackBarService } from './services/snack-bar.service';
import { SharedModule } from './shared/shared.module';


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
    ElectronService,
    SnackBarService,
    TableDataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
