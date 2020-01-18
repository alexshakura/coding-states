import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseDialogComponent } from '@app/shared/_helpers/base-dialog-component';
import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';
import { SnackBarService } from '../_services/snack-bar.service';
import { ITableConfig, ITableRow } from '@app/types';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { CodingAlgorithmType } from '@app/enums';
import { of } from 'rxjs';
import { ValidationError } from '@app/shared/_helpers/validation-error';

@Component({
  selector: 'app-coding-algorithm-dialog',
  templateUrl: './coding-algorithm-dialog.component.html',
  host: { class: 'component-wrapper' },
})
export class CodingAlgorithmDialogComponent extends BaseDialogComponent<CodingAlgorithmType, string> {

  public readonly codingAlgorithmTypes: typeof CodingAlgorithmType = CodingAlgorithmType;

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
      this.snackBarService.showError('ROOT.CODING_ALGORITHM_DIALOG.FORM_ERRORS_NOTIFICATION');
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
          this._success$$.next(this.codingAlgorithm);
        },
        (validationError: ValidationError) => {
          this.snackBarService.showError(validationError.key, validationError.params);
          this.isProcessing = false;
        });
  }

}
