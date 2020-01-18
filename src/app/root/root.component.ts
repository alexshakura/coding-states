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
import { ReportGeneratorService } from './_services/report-generator.service';
import { CodingAlgorithmType } from '@app/enums';
import { combineLatest, from, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  host: { class: 'component-wrapper' },
})
export class RootComponent implements OnInit {

  public isLoading: boolean = true;
  public isTableCoded: boolean = false;

  public isGeneratingReport: boolean = false;

  public selectedTabIndex: number = 0;

  public tableConfig: ITableConfig | null;

  public tableData: ITableRow[] = [];

  public readonly tableEditModeControl: FormControl = new FormControl(true);

  public chosenCodingAlgorithm: CodingAlgorithmType;

  public constructor(
    private readonly dialog: MatDialog,
    private readonly electronService: ElectronService,
    private readonly snackBarService: SnackBarService,
    private readonly tableDataService: TableDataService,
    private readonly reportGeneratorService: ReportGeneratorService
  ) { }

  public ngOnInit(): void {
    setTimeout(() => this.openTableConfigDialog());
  }

  public openTableConfigDialog(): void {
    const dialogRef: MatDialogRef<TableConfigDialogComponent> = this.dialog.open(TableConfigDialogComponent , {
      data: { tableConfig: this.tableConfig },
      disableClose: !this.tableConfig,
    });

    dialogRef.componentInstance.success$
      .pipe(
        takeUntil(dialogRef.afterClosed())
      )
      .subscribe((tableConfig) => {
        if (!this.tableConfig || this.tableDataService.shouldDeleteCurrentData(tableConfig, this.tableConfig)) {
          this.tableData = this.tableDataService.generateEmptyRows(tableConfig.length);
        } else if (this.tableConfig.length !== tableConfig.length) {
          this.tableData = this.tableDataService.rearrangeTableData(this.tableData, tableConfig.length);
        }

        const notificationMessageKey = !this.tableConfig
          ? 'ROOT.ROOT.TABLE_CONFIG_CREATED_SUCCESSFULLY'
          : 'ROOT.ROOT.TABLE_CONFIG_EDITED_SUCCESSFULLY';

        this.snackBarService.showMessage(notificationMessageKey);

        this.tableConfig = tableConfig;

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
      .subscribe((codingAlgorithm) => {
        this.snackBarService.showMessage('ROOT.ROOT.TABLE_CODED_SUCCESSFULLY');

        this.chosenCodingAlgorithm = codingAlgorithm;
        this.isTableCoded = true;

        dialogRef.close();
      });
  }

  public saveReport(): void {
    if (!this.isTableCoded) {
      this.snackBarService.showError('ROOT.ROOT.ERROR_TABLE_NOT_ENCODED');
      return;
    }

    this.isGeneratingReport = true;
    this.tableEditModeControl.setValue(false);
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

          const filePath = saveDialogResult.filePath as string;

          if (this.electronService.fs.existsSync(filePath)) {
            this.electronService.fs.unlinkSync(filePath);
          }

          this.electronService.fs.writeFileSync(filePath, file);

          this.snackBarService.showMessage('ROOT.ROOT.SAVE_REPORT_SUCCESS');
        },
        (message?: string) => {
          this.snackBarService.showError(message);
        },
        () => {
          this.isGeneratingReport = false;

          this.tableEditModeControl.setValue(true);
          this.tableEditModeControl.enable();
        }
      );
  }

  public onTableDataUpdate(value: ITableRow[]): void {
    this.tableData = value;
    this.isTableCoded = false;
  }
}
