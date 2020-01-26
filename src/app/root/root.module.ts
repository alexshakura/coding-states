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
import { ReportGeneratorService } from './_services/report-generator.service';
import { ElectronService } from './_services/electron.service';
import { OutputFunctionsTableComponent } from './output-functions-table/output-functions-table.component';
import { SharedModule } from '@app/shared/shared.module';
import { SnackBarService } from './_services/snack-bar.service';
import { StructureTableComponent } from './structure-table/structure-table.component';
import { TableConfigDialogComponent } from './table-config-dialog/table-config-dialog.component';
import { TransitionFunctionsTableComponent } from './transition-functions-table/transition-functions-table.component';
import { VertexCodesTableComponent } from './vertex-codes-table/vertex-codes-table.component';
import { SignalOperandGeneratorService } from './_services/signal-operand-generator.service';
import { TableMockDataService } from './_services/table-mock-data.service';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomTranslateLoader } from './_helpers';
import { DEFAULT_LANGUAGE } from './root.constants';
import { MenuService } from './_services/menu.service';

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
      },
    }),
 ],
  entryComponents: [
    CodingAlgorithmDialogComponent,
    TableConfigDialogComponent,
 ],
  providers: [
    CodingAlgorithmsService,
    ReportGeneratorService,
    ElectronService,
    SnackBarService,
    TableDataService,
    TableMockDataService,
    SignalOperandGeneratorService,
    MenuService,
  ],
  bootstrap: [RootComponent],
})
export class RootModule {

  public constructor(
    readonly translateService: TranslateService
  ) {
    translateService.setDefaultLang(DEFAULT_LANGUAGE);
    translateService.use(DEFAULT_LANGUAGE);
  }

}
