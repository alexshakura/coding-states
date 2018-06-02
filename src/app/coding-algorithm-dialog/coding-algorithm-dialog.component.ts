import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { BaseDialogComponent } from '../shared/base-dialog-component';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';
import { SnackBarService } from '../services/snack-bar.service';
import { TableDataService } from '../services/table-data.service';
import { ITableRow } from '../../types/table-row';


@Component({
  selector: 'app-coding-algorithm-dialog',
  templateUrl: './coding-algorithm-dialog.component.html',
  host: { class: 'component-wrapper' }
})
export class CodingAlgorithmDialogComponent extends BaseDialogComponent<[string, string], string> {

  public readonly UNITARY_D_ALGORITHM: string = CodingAlgorithmsService.UNITARY_D_ALGORITHM;
  public readonly FREQUENCY_D_ALGORITHM: string = CodingAlgorithmsService.FREQUENCY_D_ALGORITHM;
  public readonly STATE_N_D_ALGORITHM: string = CodingAlgorithmsService.STATE_N_D_ALGORITHM;

  public errorMap: { [propName: string]: string } = {
    [this._codingAlgorithmsService.INVALID_INPUT_ERROR]: 'Проверьте веденные данные',
    [this._codingAlgorithmsService.INVALID_GRAPH_ERROR]: 'Указанный граф не корректен',
    [this._codingAlgorithmsService.INVALID_ROWS_ERROR]: 'Заполните следующие строки: ',
    [this._codingAlgorithmsService.INVALID_ROW_ERROR]: 'Заполните следующую строку: '
  };


  public readonly UNSELECTED_ALGORITHM_ERROR: string = 'Выберите алгоритм кодирования';
  public readonly SUCCESS_MESSAGE: string = 'Таблица была успешно закодирована';

  public codingAlgorithm: string;

  public isProcessing: boolean = false;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tableConfig: ITableConfig },
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
      .switchMap((tableData: ITableRow[]) => {
        return this._codingAlgorithmsService.code(this.codingAlgorithm, tableData, this.data.tableConfig);
      })
      .take(1)
      .takeUntil(this._destroy$$)
      .subscribe(
        () => {
          this._success$$.next([this.codingAlgorithm, this.SUCCESS_MESSAGE]);
        },
        (errorMap: {[propName: string]: any}) => {
          this.isProcessing = false;

          const errorMessage: string = Object.keys(errorMap)[0];
          let message: string = this.errorMap[errorMessage];

          if (errorMessage === this._codingAlgorithmsService.INVALID_ROWS_ERROR
                || errorMessage === this._codingAlgorithmsService.INVALID_ROW_ERROR) {
            const invalidRows: number[] = errorMap[errorMessage].slice(0, 3);

            message += invalidRows.join(', ');
          }

          this._error$$.next(message);
        });
  }

  public close(): void {
    this._dialogRef.close();
  }
}
