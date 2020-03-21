import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { BaseDialogComponent } from '@app/shared/_helpers/base-dialog-component';
import { CodingAlgorithmType } from '@app/enums';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ITableConfig, ITableRow } from '@app/types';
import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';
import { SignalOperandGeneratorService } from '../_services/signal-operand-generator.service';
import { SnackBarService } from '../_services/snack-bar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAX_VALUE_VALIDATOR, MIN_FILLED_FIELDS_COUNT } from './canonical-coding-dialog.constants';
import { getTotalBitDepth, StateOperand, VertexCodingAlgorithmsFactory } from '@app/models';
import { take, takeUntil } from 'rxjs/operators';
import { ValidationError } from '@app/shared/_helpers/validation-error';

@Component({
  selector: 'app-canonical-coding-dialog',
  templateUrl: './canonical-coding-dialog.component.html',
  styleUrls: ['./canonical-coding-dialog.component.scss'],
  host: { class: 'canonical-coding-dialog' },
})
export class CanonicalCodingDialogComponent extends BaseDialogComponent<CodingAlgorithmType, string> {

  @Output() public readonly onSubmit: EventEmitter<void> = new EventEmitter<void>();

  public form: FormGroup = this.getForm();

  public isProcessing: boolean = false;

  private statesMap: Map<number, StateOperand> = this.signalOperandGeneratorService.getStates();

  public constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: {
      tableConfig: ITableConfig,
      tableData: ITableRow[]
    },
    private readonly codingAlgorithmsService: CodingAlgorithmsService,
    private readonly formBuilder: FormBuilder,
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService,
    private readonly snackBarService: SnackBarService
  ) {
    super();
  }

  private getForm(): FormGroup {
    const statesMap = this.signalOperandGeneratorService.getStates();

    const form = this.formBuilder.group({ });

    const controlValidators = [Validators.pattern('^[0|1]+$'), MAX_VALUE_VALIDATOR(this.getMaxControlValue())];

    for (const stateId of statesMap.keys()) {
      const control = this.formBuilder.control('', controlValidators);
      form.addControl(`${stateId}`, control);
    }

    return form;
  }

  private getMaxControlValue(): number {
    return (2 ** getTotalBitDepth(this.data.tableConfig.numberOfStates)) - 1;
  }

  public performCoding(): void {
    this.onSubmit.next();

    try {
      this.validateFormValue();

      this.isProcessing = true;

      const userDefinedVertexCodesMap = this.getUserDefinedVertexCodesMap();

      const vertexCodingAlgorithm = VertexCodingAlgorithmsFactory.getCanonicalAlgorithm(
        this.data.tableConfig.triggerType,
        this.data.tableData,
        this.signalOperandGeneratorService.getStates(),
        userDefinedVertexCodesMap
      );

      this.codingAlgorithmsService.code(
        vertexCodingAlgorithm,
        this.data.tableData,
        this.data.tableConfig
      )
        .pipe(
          take(1),
          takeUntil(this.destroy$$)
        )
        .subscribe(
          () => {
            this._success$$.next(CodingAlgorithmType.CANONICAL);
          },
          (validationError: ValidationError) => {
            this.snackBarService.showError(
              `ROOT.CANONICAL_CODING_DIALOG.${validationError.key}`,
              validationError.params
            );

            this.isProcessing = false;
          });
    } catch (error) {
      this.snackBarService.showError(error.key, error.params);
    }
  }

  private validateFormValue(): void {
    if (this.form.invalid) {
      throw new ValidationError('ROOT.CANONICAL_CODING_DIALOG.ERROR_INVALID_FORM');
    }

    const filledValues = Object.values(this.form.value as Record<number, string>).filter(Boolean);
    const uniqueValuesCount = new Set(filledValues).size;

    if (uniqueValuesCount !== filledValues.length) {
      throw new ValidationError('ROOT.CANONICAL_CODING_DIALOG.ERROR_UNIQUE_VALUES');
    }

    if (filledValues.length < MIN_FILLED_FIELDS_COUNT) {
      throw new ValidationError(
        'ROOT.CANONICAL_CODING_DIALOG.ERROR_MIN_FILLED_COUNT',
        { count: `${MIN_FILLED_FIELDS_COUNT}` }
      );
    }
  }

  private getUserDefinedVertexCodesMap(): Map<number, number> {
    const entries: Array<[number, number]> = Object.entries(this.form.value as Record<number, string>)
      .filter(([_key, value]) => Boolean(value))
      .map(([key, value]) => {
        return [+key, parseInt(value, 2)];
      });

    return new Map(entries);
  }

  public getStateOperand(id: string): StateOperand {
    return this.statesMap.get(+id) as StateOperand;
  }
}
