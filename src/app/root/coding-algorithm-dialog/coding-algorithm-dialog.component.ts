import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BaseDialogComponent } from '@app/shared/_helpers/base-dialog-component';
import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';
import { SnackBarService } from '../_services/snack-bar.service';
import { ITableConfig, ITableRow } from '@app/types';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { CodingAlgorithmType } from '@app/enums';
import { of } from 'rxjs';

@Component({
  selector: 'app-coding-algorithm-dialog',
  templateUrl: './coding-algorithm-dialog.component.html',
  host: { class: 'component-wrapper' },
})
export class CodingAlgorithmDialogComponent extends BaseDialogComponent<[CodingAlgorithmType, string], string> {

  public readonly codingAlgorithmTypes: typeof CodingAlgorithmType = CodingAlgorithmType;

  public errorMap: { [propName: string]: string } = {
    [this.codingAlgorithmsService.INVALID_INPUT_ERROR]: 'Проверьте веденные данные',
    [this.codingAlgorithmsService.INVALID_USED_STATES_COUNT]: 'Количество состояний в параметрах СТП не совпадает с количеством используемых',
    [this.codingAlgorithmsService.INVALID_ROWS_ERROR]: 'Заполните следующие строки: ',
    [this.codingAlgorithmsService.INVALID_ROW_ERROR]: 'Заполните следующую строку: ',
  };

  public readonly UNSELECTED_ALGORITHM_ERROR: string = 'Выберите алгоритм или способ кодирования';
  public readonly SUCCESS_MESSAGE: string = 'Таблица была успешно закодирована';

  public codingAlgorithm: CodingAlgorithmType = CodingAlgorithmType.UNITARY_D_TRIGGER;

  public isProcessing: boolean = false;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: {
      tableConfig: ITableConfig,
      tableData: ITableRow[]
    },
    private readonly codingAlgorithmsService: CodingAlgorithmsService,
    private readonly snackBarService: SnackBarService
  ) {
    super();
  }

  public performCoding(): void {
    if (!this.codingAlgorithm) {
      this.snackBarService.showError(this.UNSELECTED_ALGORITHM_ERROR);
      return;
    }

    this.isProcessing = true;

    of(this.data.tableData)
      .pipe(
        switchMap((tableData: ITableRow[]) => {
          return this.codingAlgorithmsService.code(this.codingAlgorithm, tableData, this.data.tableConfig);
        }),
        take(1),
        takeUntil(this.destroy$$)
      )
      .subscribe(
        () => {
          this._success$$.next([this.codingAlgorithm, this.SUCCESS_MESSAGE]);
        },
        (errorMap: {[propName: string]: any}) => {
          this.isProcessing = false;

          const errorMessage: string = Object.keys(errorMap)[0];
          let message: string = this.errorMap[errorMessage];

          if (errorMessage === this.codingAlgorithmsService.INVALID_ROWS_ERROR
                || errorMessage === this.codingAlgorithmsService.INVALID_ROW_ERROR) {
            const invalidRows: number[] = errorMap[errorMessage].slice(0, 3);

            message += invalidRows.join(', ');
          }

          this._error$$.next(message);
        });
  }

}
