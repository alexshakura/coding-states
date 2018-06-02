import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as Docxtemplater from 'docxtemplater';
import * as FileSaver from 'file-saver';

import { CodingAlgorithmDialogComponent } from './coding-algorithm-dialog/coding-algorithm-dialog.component';
import { CodingAlgorithmsService } from './services/coding-algorithms.service';
import { ConstantOperand } from './shared/expression/constant-operand';
import { DocxGeneratorService } from './services/docx-generator.service';
import { ElectronService } from './services/electron.service';
import { Expression } from './shared/expression/expression';
import { SnackBarService } from './services/snack-bar.service';
import { TableConfigDialogComponent } from './table-config-dialog/table-config-dialog.component';
import { TableDataService } from './services/table-data.service';
import { WindowService } from './services/window.service';
import { environment } from '../environments/environment';

const path = require('path');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  host: { class: 'component-wrapper' }
})
export class AppComponent implements OnInit {

  public readonly GENERATE_DOC_TABLE_ERROR: string = 'Таблица не закодирована';
  public readonly GENERATE_DOC_SUCCESS: string = 'Файл с кодировками был успешно сгенерирован';
  public readonly GENERATE_DOC_ERROR: string = 'Что-то пошло не так, перепроверьте Ваши данные';

  public isLoading: boolean = true;
  public isTableCoded: boolean = false;
  public isInitialized: boolean = false;

  public isGeneratingDoc: boolean = false;

  public selectedTabIndex: number = 0;

  public tableConfig: ITableConfig = {
    numberOfStates: 7,
    length: 15,
    numberOfX: 3,
    numberOfY: 6,
    fsmType: 'mili'
  } as ITableConfig;

  public chosenCodingAlgorithm: string;


  public constructor(
    private _dialog: MatDialog,
    private _docxGeneratorService: DocxGeneratorService,
    private _electronService: ElectronService,
    private _tableDataService: TableDataService,
    private _codingAlgorithmsService: CodingAlgorithmsService,
    private _snackBarService: SnackBarService,
    private _windowService: WindowService
  ) { }

  public ngOnInit(): void {
    // setTimeout(() => this.openTableConfigDialog());
    this.isLoading = false;
  }

  public openTableConfigDialog(): void {
    const dialogRef: MatDialogRef<TableConfigDialogComponent> = this._dialog.open(TableConfigDialogComponent , {
      data: {
        tableConfig: this.tableConfig,
        isInitialized: this.isInitialized
      },
      disableClose: !this.isInitialized
    });

    this.isInitialized = true;

    dialogRef.componentInstance.success$
      .takeUntil(dialogRef.afterClosed())
      .subscribe(([tableConfig, successMessage]: [ITableConfig, string]) => {
        this.tableConfig = tableConfig;
        this._snackBarService.showMessage(successMessage);

        this.isLoading = false;
        this.isTableCoded = false;
        this.selectedTabIndex = 0;

        dialogRef.close();
      });
  }

  public openCodingAlgorithmDialog(): void {
    const dialogRef: MatDialogRef<CodingAlgorithmDialogComponent> = this._dialog.open(CodingAlgorithmDialogComponent, {
      data: {
        tableConfig: this.tableConfig
      }
    });

    dialogRef.componentInstance.success$
      .takeUntil(dialogRef.afterClosed())
      .subscribe(([codingAlgorithm, successMessage]: string[]) => {
        this._snackBarService.showMessage(successMessage);

        this.chosenCodingAlgorithm = codingAlgorithm;
        this.isTableCoded = true;

        dialogRef.close();
      });

    dialogRef.componentInstance.error$
      .takeUntil(dialogRef.afterClosed())
      .subscribe((errorMessage: string) => {
        this._snackBarService.showError(errorMessage);
      });
  }

  public generateDoc(): void {
    if (!this.isTableCoded) {
      this._snackBarService.showError(this.GENERATE_DOC_TABLE_ERROR);
      return;
    }

    this.isGeneratingDoc = true;

    let pathToTemplate: string = '/assets/doc-templates/table_min.docx';

    if (this._electronService.isElectron() && environment.production) {
      pathToTemplate = path.join(this._windowService.window['process'].resourcesPath, pathToTemplate);
    }

    this._docxGeneratorService.getData$()
      .take(1)
      .subscribe(
        ([tableData, outputFunctions, transitionFunctions]: any[]) => {
          JSZipUtils.getBinaryContent(pathToTemplate, (error, content: ArrayBuffer) => {
            if (error) {
              this.isGeneratingDoc  = false;
              this._snackBarService.showError();

              throw error;
            }

            const zip = new JSZip(content);

            const docxTemplate = new Docxtemplater()
              .loadZip(zip)
              .setOptions({ parser: this._docxGeneratorService.getParser(), paragraphLoop: true });

            docxTemplate.setData({
              tableData,
              isMiliType: this.tableConfig.fsmType === TableDataService.MILI_FSM_TYPE,
              outputFunctions,
              transitionFunctions,
              isUnitaryAlgorithm: this.chosenCodingAlgorithm === CodingAlgorithmsService.UNITARY_D_ALGORITHM,
              isFrequencyAlgorithm: this.chosenCodingAlgorithm === CodingAlgorithmsService.FREQUENCY_D_ALGORITHM,
              isNStateAlgorithm: this.chosenCodingAlgorithm === CodingAlgorithmsService.STATE_N_D_ALGORITHM
            });

            try {
              docxTemplate.render();

              const generatedZipFile = docxTemplate.getZip();
              let generatedFile;

              if (this._electronService.isElectron()) {
                generatedFile = generatedZipFile.generate({ type: 'nodebuffer' });

                const savePath: string = this._electronService.dialog.showSaveDialog({
                  defaultPath: 'coding_results',
                  filters: [{ name: 'Microsoft office document', extensions: ['docx'] }]
                });

                if (savePath) {
                  if (this._electronService.fs.existsSync(savePath)) {
                    this._electronService.fs.unlinkSync(savePath);
                  }

                  this._electronService.fs.writeFileSync(savePath, generatedFile);
                  this._snackBarService.showMessage(this.GENERATE_DOC_SUCCESS);
                }
              } else {
                generatedFile = generatedZipFile.generate({
                  type: 'blob',
                  mimeType: DocxGeneratorService.MIME_TYPE
                });

                FileSaver.saveAs(generatedFile, 'coding_results');

                this._snackBarService.showMessage(this.GENERATE_DOC_SUCCESS);
              }
            } catch {
              this._snackBarService.showMessage(this.GENERATE_DOC_ERROR);
            } finally {
              this.isGeneratingDoc = false;
            }
          });
        },
        () => {
          this.isGeneratingDoc  = false;
          this._snackBarService.showError();
        });
  }
}
