import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseDialogComponent } from '@app/shared/_helpers/base-dialog-component';
import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';
import { SnackBarService } from '../_services/snack-bar.service';
import { ITableConfig, ITableRow } from '@app/types';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { CodingAlgorithmType } from '@app/enums';
import { of } from 'rxjs';
import { ValidationError } from '@app/shared/_helpers/validation-error';
import { VertexCodingAlgorithmsFactory } from '@app/models';
import { SignalOperandGeneratorService } from '../_services/signal-operand-generator.service';

@Component({
  selector: 'app-d-trigger-coding-dialog',
  templateUrl: './d-trigger-coding-dialog.component.html',
  host: { class: 'component-wrapper' },
})
export class DTriggerCodingDialogComponent extends BaseDialogComponent<CodingAlgorithmType, string> {

  @Output() public readonly onSubmit: EventEmitter<void> = new EventEmitter<void>();

  public readonly codingAlgorithmTypes: typeof CodingAlgorithmType = CodingAlgorithmType;

  public codingAlgorithm: CodingAlgorithmType = CodingAlgorithmType.UNITARY;

  public isProcessing: boolean = false;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: {
      tableConfig: ITableConfig,
      tableData: ITableRow[]
    },
    private readonly codingAlgorithmsService: CodingAlgorithmsService,
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService,
    private readonly snackBarService: SnackBarService
  ) {
    super();
  }

  public performCoding(): void {
    this.onSubmit.next();

    if (!this.codingAlgorithm) {
      this.snackBarService.showError('ROOT.D_TRIGGER_CODING_DIALOG.FORM_ERRORS_NOTIFICATION');
      return;
    }

    this.isProcessing = true;

    of(this.data.tableData)
      .pipe(
        switchMap((tableData: ITableRow[]) => {
          const vertexCodingAlgorithm = VertexCodingAlgorithmsFactory.getDTriggerAlgorithm(
            this.codingAlgorithm,
            tableData,
            this.signalOperandGeneratorService.getStates()
          );

          return this.codingAlgorithmsService.code(
            vertexCodingAlgorithm,
            tableData,
            this.data.tableConfig
          );
        }),
        take(1),
        takeUntil(this.destroy$$)
      )
      .subscribe(
        () => {
          this._success$$.next(this.codingAlgorithm);
        },
        (validationError: ValidationError) => {
          this.snackBarService.showError(`ROOT.D_TRIGGER_CODING_DIALOG.${validationError.key}`, validationError.params);
          this.isProcessing = false;
        });
  }

}
