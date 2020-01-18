import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { of } from 'rxjs';

import { BaseDialogComponent } from '@app/shared/_helpers/base-dialog-component';
import { SnackBarService } from '@app/root/_services/snack-bar.service';
import { delay, takeUntil, tap } from 'rxjs/operators';
import { FsmType } from '@app/enums';
import { ITableConfig, TSensitiveTableConfigFields } from '@app/types';
import { NUMBER_FORM_FIELD_VALIDATORS, SUBMISSION_DELAY } from './table-config-dialog.constants';
import { TableDataService } from '../_services/table-data.service';
import { SignalOperandGeneratorService } from '../_services/signal-operand-generator.service';

@Component({
  selector: 'app-table-config-dialog',
  templateUrl: './table-config-dialog.component.html',
  host: { class: 'component-wrapper' },
})
export class TableConfigDialogComponent extends BaseDialogComponent<ITableConfig, void> {

  public readonly fsmTypes: typeof FsmType = FsmType;

  public isProcessing: boolean = false;

  public form: FormGroup = this.formBuilder.group({
    length: [this.tableConfig.length, NUMBER_FORM_FIELD_VALIDATORS],
    numberOfStates: [this.tableConfig.numberOfStates, NUMBER_FORM_FIELD_VALIDATORS],
    numberOfX: [this.tableConfig.numberOfX, NUMBER_FORM_FIELD_VALIDATORS],
    numberOfY: [this.tableConfig.numberOfY, NUMBER_FORM_FIELD_VALIDATORS],
    fsmType: this.tableConfig.fsmType || this.fsmTypes.MILI,
  });

  public isEditMode: boolean = !!this.data.tableConfig;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: {
      tableConfig: ITableConfig | null,
    },
    private readonly snackBarService: SnackBarService,
    private readonly tableDataService: TableDataService,
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService,
    private readonly formBuilder: FormBuilder
  ) {
    super();
  }

  public isDataLossNoticeShown(fieldKey: TSensitiveTableConfigFields): boolean {
    const control: AbstractControl = this.form.controls[fieldKey];

    const isFieldViolated = this.tableDataService.isConfigSensitiveFieldViolated(
      this.tableConfig as ITableConfig,
      this.form.value,
      fieldKey
    );

    return control.valid && isFieldViolated;
  }

  public save(): void {
    if (this.form.invalid) {
      this.snackBarService.showError('ROOT.TABLE_CONFIG_DIALOG.NOTIFICATION_FORM_ERRORS');
      return;
    }

    const formValue = this.form.value;

    this.form.disable();
    this.isProcessing = true;

    of(formValue)
      .pipe(
        tap((updatedConfig: ITableConfig) => {
          this.signalOperandGeneratorService.generateStates(updatedConfig.numberOfStates);
          this.signalOperandGeneratorService.generateConditionalSignals(updatedConfig.numberOfX);
          this.signalOperandGeneratorService.generateOutputSignals(updatedConfig.numberOfY);
        }),
        delay(SUBMISSION_DELAY),
        takeUntil(this.destroy$$)
      )
      .subscribe((updatedConfig: ITableConfig) => {
        this._success$$.next(updatedConfig);
      });
  }

  public get tableConfig(): Partial<ITableConfig> {
    return this.data.tableConfig || {};
  }
}
