import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { BaseDialogComponent } from '../shared/base-dialog-component';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';
import { SnackBarService } from '../services/snack-bar.service';
import { TableDataService } from '../services/table-data.service';


@Component({
  selector: 'app-coding-algorithm-dialog',
  templateUrl: './coding-algorithm-dialog.component.html',
  host: { class: 'component-wrapper' }
})
export class CodingAlgorithmDialogComponent extends BaseDialogComponent<string, string> {

  public readonly UNITARY_D_ALGORITHM: string = CodingAlgorithmsService.UNITARY_D_ALGORITHM;
  public readonly FREQUENCY_D_ALGORITHM: string = CodingAlgorithmsService.FREQUENCY_D_ALGORITHM;
  public readonly STATE_N_D_ALGORITHM: string = CodingAlgorithmsService.STATE_N_D_ALGORITHM;

  public readonly UNSELECTED_ALGORITHM_ERROR: string = 'Выберите алгоритм кодирования';
  public readonly INVALID_ROWS_ERROR: string = 'Заполните следующие ряды: ';
  public readonly INVALID_ROW_ERROR: string = 'Заполните следующий ряд: ';
  public readonly SUCCESS_MESSAGE: string = 'Таблица была успешно закодирована';

  public codingAlgorithm: string;

  public isProcessing: boolean = false;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tableConfig: App.ITableConfig },
    private _codingAlgorithmsService: CodingAlgorithmsService,
    private _dialogRef: MatDialogRef<CodingAlgorithmDialogComponent>,
    private _snackBarService: SnackBarService,
    private _tableDataService: TableDataService
  ) {
    super();
  }

  public performCoding(): void {
    if (!this.codingAlgorithm) {
      this._snackBarService.showError(this.UNSELECTED_ALGORITHM_ERROR);
      return;
    }

    this.isProcessing = true;

    this._tableDataService.tableData$
      .switchMap((tableData: App.ITableRow[]) => {
        return this._codingAlgorithmsService.code(this.codingAlgorithm, tableData, this.data.tableConfig);
      })
      .take(1)
      .takeUntil(this._destroy$$)
      .subscribe(
        () => {
          this._success$$.next(this.SUCCESS_MESSAGE);
        },
        (invalidRows: number[] | null) => {
          this.isProcessing = false;

          let errorMessage: string;

          if (invalidRows) {
            const rowsSlice: number[] = invalidRows.slice(0, 3);

            errorMessage = rowsSlice.length > 1
              ? this.INVALID_ROWS_ERROR
              : this.INVALID_ROW_ERROR;

            errorMessage += rowsSlice.join(', ');
          }

          this._error$$.next(errorMessage);
        });
  }

  public close(): void {
    this._dialogRef.close();
  }
}
