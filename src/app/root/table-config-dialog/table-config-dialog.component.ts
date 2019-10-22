import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { of } from 'rxjs';

import { BaseDialogComponent } from '@app/shared/base-dialog-component';
import { SnackBarService } from '@app/root/services/snack-bar.service';
import { delay, takeUntil } from 'rxjs/operators';
import { FsmType } from '@app/enums';
import { ITableConfig } from '@app/types';
import { NUMBER_FORM_FIELD_VALIDATORS, SUBMISSION_DELAY } from './table-config-dialog.constants';

@Component({
  selector: 'app-table-config-dialog',
  templateUrl: './table-config-dialog.component.html',
  host: { class: 'component-wrapper' },
})
export class TableConfigDialogComponent extends BaseDialogComponent<[ITableConfig, string], void> {

  public readonly ERROR_MESSAGE: string = 'В форме присутствуют ошибки';
  public readonly CREATE_SUCCESS_MESSAGE: string = 'Параметры СТП были успешно заданы';
  public readonly EDIT_SUCCESS_MESSAGE: string = 'Параметры СТП были успешно отредактированы';

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
    @Inject(MAT_DIALOG_DATA) public data: {
      tableConfig: ITableConfig | null,
    },
    private snackBarService: SnackBarService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  public hasNotice(fieldKey: keyof ITableConfig): boolean {
    const control: AbstractControl = this.form.controls[fieldKey];
    const configValue = this.tableConfig[fieldKey];

    return control.valid
      && configValue !== undefined
      && control.value < configValue;
  }

  public save(): void {
    if (this.form.invalid) {
      this.snackBarService.showError(this.ERROR_MESSAGE);
      return;
    }

    const formValue = this.form.value;

    this.form.disable();
    this.isProcessing = true;

    of(formValue)
      .pipe(
        delay(SUBMISSION_DELAY),
        takeUntil(this._destroy$$)
      )
      .subscribe((updatedConfig: ITableConfig) => {
        const successMessage: string = this.isEditMode
          ? this.EDIT_SUCCESS_MESSAGE
          : this.CREATE_SUCCESS_MESSAGE;

        this._success$$.next([updatedConfig, successMessage]);
      });
  }

  public get tableConfig(): Partial<ITableConfig> {
    return this.data.tableConfig || {};
  }
}
