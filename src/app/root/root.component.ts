import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// import * as Docxtemplater from 'docxtemplater';

import { SnackBarService } from './services/snack-bar.service';
import { CodingAlgorithmDialogComponent } from './coding-algorithm-dialog/coding-algorithm-dialog.component';
import { ElectronService } from './services/electron.service';
import { TableConfigDialogComponent } from './table-config-dialog/table-config-dialog.component';
import { environment } from '../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { ITableConfig, ITableRow } from '@app/types';
import { FsmType } from '@app/enums';
import { FormControl } from '@angular/forms';
import { TableDataService } from './services/table-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  host: { class: 'component-wrapper' },
})
export class RootComponent implements OnInit {

  public readonly GENERATE_DOC_TABLE_ERROR: string = 'Таблица не закодирована';
  public readonly GENERATE_DOC_SUCCESS: string = 'Файл с кодировками был успешно сгенерирован';
  public readonly GENERATE_DOC_ERROR: string = 'Что-то пошло не так, перепроверьте Ваши данные';

  public isLoading: boolean = true;
  public isTableCoded: boolean = false;
  public isInitialized: boolean = false;

  public isGeneratingDoc: boolean = false;

  public selectedTabIndex: number = 0;

  public tableConfig: ITableConfig | null = {
    length: 16,
    numberOfStates: 7,
    numberOfX: 3,
    numberOfY: 6,
    fsmType: FsmType.MILI,
  };

  public tableData: ITableRow[] = [];

  public readonly tableEditModeControl: FormControl = new FormControl(true);

  public chosenCodingAlgorithm: string;

  public constructor(
    private readonly dialog: MatDialog,
    private readonly electronService: ElectronService,
    private readonly snackBarService: SnackBarService,
    private readonly tableDataService: TableDataService
  ) { }

  public ngOnInit(): void {
    setTimeout(() => this.openTableConfigDialog());
  }

  public openTableConfigDialog(): void {
    const dialogRef: MatDialogRef<TableConfigDialogComponent> = this.dialog.open(TableConfigDialogComponent , {
      data: { tableConfig: this.tableConfig },
      disableClose: !this.isInitialized,
    });

    this.isInitialized = true;

    dialogRef.componentInstance.success$
      .pipe(
        takeUntil(dialogRef.afterClosed())
      )
      .subscribe(([tableConfig, successMessage]: [ITableConfig, string]) => {
        if (!this.tableConfig || this.tableDataService.shouldDeleteCurrentData(tableConfig, this.tableConfig)) {
          this.tableData = this.tableDataService.generateEmptyData(tableConfig.length);
        } else if (this.tableConfig.length !== tableConfig.length) {
          this.tableData = this.tableDataService.rearrangeTableData(this.tableData, tableConfig.length);
        }

        this.tableData = this.tableDataService.reconnectTableData(this.tableData);

        this.tableConfig = tableConfig;
        this.snackBarService.showMessage(successMessage);

        this.isLoading = false;
        this.isTableCoded = false;
        this.selectedTabIndex = 0;

        dialogRef.close();
      });
  }

  public openCodingAlgorithmDialog(): void {
    const dialogRef: MatDialogRef<CodingAlgorithmDialogComponent> = this.dialog.open(CodingAlgorithmDialogComponent, {
      data: {
        tableConfig: this.tableConfig,
        tableData: this.tableData,
      },
    });

    dialogRef.componentInstance.success$
      .pipe(
        takeUntil(dialogRef.afterClosed())
      )
      .subscribe(([codingAlgorithm, successMessage]: string[]) => {
        this.snackBarService.showMessage(successMessage);

        this.chosenCodingAlgorithm = codingAlgorithm;
        this.isTableCoded = true;

        dialogRef.close();
      });

    dialogRef.componentInstance.error$
      .pipe(
        takeUntil(dialogRef.afterClosed())
      )
      .subscribe((errorMessage: string) => {
        this.snackBarService.showError(errorMessage);
      });
  }

  public generateDoc(): void {
    // if (!this.isTableCoded) {
    //   this._snackBarService.showError(this.GENERATE_DOC_TABLE_ERROR);
    //   return;
    // }

    this.isGeneratingDoc = true;
    this.tableEditModeControl.disable();

    let pathToTemplate: string = '/assets/doc-templates/table_min.docx';

    if (this.electronService.isElectron() && environment.production) {
      const resourcesPath = window.process.resourcesPath;

      pathToTemplate = this.electronService.path.join(resourcesPath, pathToTemplate);
    }

    // combineLatest([
    //   this.httpClient.get(pathToTemplate, { responseType: 'arraybuffer' }),
    //   this._docxGeneratorService.getData$(),
    // ])
    //   .pipe(
    //     take(1)
    //   )
    //   .subscribe(
    //     ([content, [tableData, outputFunctions, transitionFunctions]]: any[]) => {
    //       const zip = new JSZip(content);
    //       // Docxtemplater()
    //       const docxTemplate = new Docxtemplater()
    //         .loadZip(zip)
    //         .setOptions({ parser: this._docxGeneratorService.getParser(), paragraphLoop: true });

    //       docxTemplate.setData({
    //         tableData,
    //         isMiliType: this.tableConfig.fsmType === TableDataService.MILI_FSM_TYPE,
    //         outputFunctions,
    //         transitionFunctions,
    //         isUnitaryAlgorithm: this.chosenCodingAlgorithm === CodingAlgorithmsService.UNITARY_D_ALGORITHM,
    //         isFrequencyAlgorithm: this.chosenCodingAlgorithm === CodingAlgorithmsService.FREQUENCY_D_ALGORITHM,
    //         isNStateAlgorithm: this.chosenCodingAlgorithm === CodingAlgorithmsService.STATE_N_D_ALGORITHM,
    //       });

    //       try {
    //         docxTemplate.render();

    //         const generatedZipFile = docxTemplate.getZip();
    //         let generatedFile;

    //         if (this._electronService.isElectron()) {
    //           generatedFile = generatedZipFile.generate({ type: 'nodebuffer' });

    //           const savePath: string = this._electronService.dialog.showSaveDialog({
    //             defaultPath: 'coding_results',
    //             filters: [{ name: 'Microsoft office document', extensions: ['docx'] }],
    //           });

    //           if (savePath) {
    //             if (this._electronService.fs.existsSync(savePath)) {
    //               this._electronService.fs.unlinkSync(savePath);
    //             }

    //             this._electronService.fs.writeFileSync(savePath, generatedFile);
    //             this._snackBarService.showMessage(this.GENERATE_DOC_SUCCESS);
    //           }
    //         } else {
    //           generatedFile = generatedZipFile.generate({
    //             type: 'blob',
    //             mimeType: DocxGeneratorService.MIME_TYPE,
    //           });

    //           const url = window.URL.createObjectURL(generatedFile);
    //           window.location.href = url;
    //           setTimeout(() => window.URL.revokeObjectURL(url), 40);

    //           this._snackBarService.showMessage(this.GENERATE_DOC_SUCCESS);
    //         }
    //       } catch {
    //         this._snackBarService.showMessage(this.GENERATE_DOC_ERROR);
    //       } finally {
    //         this.isGeneratingDoc = false;
    //       }
    //     },
    //     () => {
    //       this.isGeneratingDoc  = false;
    //       this._snackBarService.showError();
    //     });
  }
}
