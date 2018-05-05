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
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorIntl,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { NgModule } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';

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
import { ElectronService } from './services/electron.service';
import { SnackBarService } from './services/snack-bar.service';
import { SnackBarContentComponent } from './snack-bar-content/snack-bar-error.component';
import { DynamicContentTooltipComponent } from './dynamic-content-tooltip/dynamic-content-tooltip.component';
import { DynamicTooltipDirective } from './directives/dynamic-tooltip.directive';


@NgModule({
  declarations: [
    AppComponent,
    CodingAlgorithmDialogComponent,
    DialogOverlayComponent,
    DynamicContentTooltipComponent,
    DynamicTooltipDirective,
    DiscreteExpressionComponent,
    OutputFunctionsTableComponent,
    PaginatorComponent,
    SnackBarContentComponent,
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
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatInputModule,

    PortalModule,
    OverlayModule
 ],
 entryComponents: [
    CodingAlgorithmDialogComponent,
    DynamicContentTooltipComponent,
    TableConfigDialogComponent,
    SnackBarContentComponent
 ],
  providers: [
    CodingAlgorithmsService,
    ElectronService,
    SnackBarService,
    TableDataService,
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlRu }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
