import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { CodingAlgorithmsService } from '../services/coding-algorithms.service';
import { SnackBarService } from '../services/snack-bar.service';
import { TableDataService } from '../services/table-data.service';


@Component({
  selector: 'app-coding-algorithm-dialog',
  templateUrl: './coding-algorithm-dialog.component.html',
  styleUrls: ['./coding-algorithm-dialog.component.scss'],
  host: { class: 'component-wrapper' }
})
export class CodingAlgorithmDialogComponent implements OnInit {

  public readonly UNITARY_D_ALGORITHM: string = CodingAlgorithmsService.UNITARY_D_ALGORITHM;
  public readonly FREQUENCY_D_ALGORITHM: string = CodingAlgorithmsService.FREQUENCY_D_ALGORITHM;

  public readonly INVALID_ROWS_ERROR_STRING: string = 'Заполните следующие ряды: ';
  public readonly INVALID_ROW_ERROR_STRING: string = 'Заполните следующий ряд: ';
  public readonly SUCCESS_MESSAGE: string = 'Таблица была успешно закодирована';

  public codingAlgorithm: string;

  public isProcessing: boolean = false;

  public constructor(
    private _codingAlgorithmsService: CodingAlgorithmsService,
    private _dialogRef: MatDialogRef<CodingAlgorithmDialogComponent>,
    private _snackBarService: SnackBarService,
    private _tableDataService: TableDataService
  ) { }

  ngOnInit() {
  }

  public performCoding(): void {
    if (!this.codingAlgorithm) {
      this._snackBarService.showError('Выберите алгоритм кодирования');
      return;
    }

    this.isProcessing = true;

    this._tableDataService.tableData$
      .switchMap((tableData: App.TableRow[]) => {
        return this._codingAlgorithmsService.code(this.codingAlgorithm, tableData);
      })
      .take(1)
      .subscribe(
        () => {
          this._snackBarService.showMessage(this.SUCCESS_MESSAGE);
          this._dialogRef.close(true);
        },
        (invalidRows: number[] | null) => {
          this.isProcessing = false;

          let errorMessage: string;

          if (invalidRows) {
            const rowsSlice = invalidRows.slice(0, 3);

            errorMessage = rowsSlice.length > 1
              ? this.INVALID_ROWS_ERROR_STRING
              : this.INVALID_ROW_ERROR_STRING;

            errorMessage += rowsSlice.join(', ');
          }

          this._snackBarService.showError(errorMessage);
        });
  }

  public close(): void {
    this._dialogRef.close();
  }
}
