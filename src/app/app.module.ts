import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';

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
  MatTabsModule,
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
import { TransitionFunctionsTableComponent } from './transition-functions-table/transition-functions-table.component';
import { DiscreteExpressionComponent } from './discrete-expression/discrete-expression.component';
import { DialogOverlayComponent } from './dialog-overlay/dialog-overlay.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { ElectronService } from './providers/electron.service';


@NgModule({
  declarations: [
    AppComponent,
    StructureTableComponent,
    TableConfigDialogComponent,
    CodingAlgorithmDialogComponent,
    VertexCodesTableComponent,
    OutputFunctionsTableComponent,
    TransitionFunctionsTableComponent,
    DiscreteExpressionComponent,
    DialogOverlayComponent,
    PaginatorComponent
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
    MatTabsModule,
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
    ElectronService,
    TableDataService,
    CodingAlgorithmsService,
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlRu }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
