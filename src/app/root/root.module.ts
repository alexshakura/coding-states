import 'reflect-metadata';
import '../../polyfills';

import { TableDataService } from './_services/table-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';

import { RootComponent } from './root.component';
import { CodingAlgorithmDialogComponent } from './coding-algorithm-dialog/coding-algorithm-dialog.component';
import { CodingAlgorithmsService } from './_services/coding-algorithms.service';
import { DocxGeneratorService } from './_services/docx-generator.service';
import { ElectronService } from './_services/electron.service';
import { OutputFunctionsTableComponent } from './output-functions-table/output-functions-table.component';
import { SharedModule } from '@app/shared/shared.module';
import { SnackBarService } from './_services/snack-bar.service';
import { StructureTableComponent } from './structure-table/structure-table.component';
import { TableConfigDialogComponent } from './table-config-dialog/table-config-dialog.component';
import { TransitionFunctionsTableComponent } from './transition-functions-table/transition-functions-table.component';
import { VertexCodesTableComponent } from './vertex-codes-table/vertex-codes-table.component';
import { HttpClientModule } from '@angular/common/http';
import { SignalOperandGeneratorService } from './_services/signal-operand-generator.service';
import { TableMockDataService } from './_services/table-mock-data.service';
import { ExpressionConverterService } from './_services/expression-converter.service';

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
    ExpressionConverterService,
    SnackBarService,
    TableDataService,
    TableMockDataService,
    SignalOperandGeneratorService,
  ],
  bootstrap: [RootComponent],
})
export class RootModule { }
