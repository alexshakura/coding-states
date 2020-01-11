import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from './_services/snack-bar.service';
import { CodingAlgorithmDialogComponent } from './coding-algorithm-dialog/coding-algorithm-dialog.component';
import { ElectronService } from './_services/electron.service';
import { TableConfigDialogComponent } from './table-config-dialog/table-config-dialog.component';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ITableConfig, ITableRow } from '@app/types';
import { FormControl } from '@angular/forms';
import { TableDataService } from './_services/table-data.service';
import { TableMockDataService } from './_services/table-mock-data.service';
import { ReportGeneratorService } from './_services/report-generator.service';
import { CodingAlgorithmType } from '@app/enums';
import { combineLatest, from, of } from 'rxjs';

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

  public isGeneratingReport: boolean = false;

  public selectedTabIndex: number = 0;

  public tableConfig: ITableConfig | null = this.tableMockDataService.getConfigForFrequencyD();

  public tableData: ITableRow[] = [];

  public readonly tableEditModeControl: FormControl = new FormControl(true);

  public chosenCodingAlgorithm: CodingAlgorithmType;

  public constructor(
    private readonly dialog: MatDialog,
    private readonly electronService: ElectronService,
    private readonly snackBarService: SnackBarService,
    private readonly tableDataService: TableDataService,
    private readonly tableMockDataService: TableMockDataService,
    private readonly reportGeneratorService: ReportGeneratorService
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
      .subscribe(([tableConfig, successMessage]) => {
        if (!this.tableConfig || this.tableDataService.shouldDeleteCurrentData(tableConfig, this.tableConfig)) {
          this.tableData = this.tableDataService.generateEmptyRows(tableConfig.length);
        } else if (this.tableConfig.length !== tableConfig.length) {
          this.tableData = this.tableDataService.rearrangeTableData(this.tableData, tableConfig.length);
        }

        this.tableData = this.tableMockDataService.getDataForFrequencyD();

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
      .subscribe(([codingAlgorithm, successMessage]) => {
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

  public generateReport(): void {
    if (!this.isTableCoded) {
      this.snackBarService.showError(this.GENERATE_DOC_TABLE_ERROR);
      return;
    }

    this.isGeneratingReport = true;
    this.tableEditModeControl.disable();

    this.reportGeneratorService.get$(this.tableConfig as ITableConfig, this.chosenCodingAlgorithm)
      .pipe(
        switchMap((file) => {
          const saveDialogResult = this.electronService.dialog.showSaveDialog({
            defaultPath: 'coding_results',
            filters: [{ name: 'Microsoft office document', extensions: ['docx'] }],
          });

          return combineLatest([
            of(file),
            from(saveDialogResult),
          ]);
        })
      )
      .subscribe(
        ([file, saveDialogResult]) => {
          if (saveDialogResult.canceled) {
            return;
          }

          this.saveReport(file, saveDialogResult.filePath as string);
          this.snackBarService.showMessage(this.GENERATE_DOC_SUCCESS);
        },
        (message?: string) => {
          this.snackBarService.showError(message);
        },
        () => {
          this.isGeneratingReport = false;
          this.tableEditModeControl.enable();
        }
      );
  }

  private saveReport(file: Blob | Buffer, filePath: string): void {
    if (this.electronService.fs.existsSync(filePath)) {
      this.electronService.fs.unlinkSync(filePath);
    }

    this.electronService.fs.writeFileSync(filePath, file);
  }
}
