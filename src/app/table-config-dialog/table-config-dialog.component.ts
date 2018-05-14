import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { BaseDialogComponent } from '../shared/base-dialog-component';
import { SnackBarService } from '../services/snack-bar.service';
import { TableDataService } from '../services/table-data.service';

const fieldValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(new RegExp(/^[-]?\d+$/)),
  Validators.min(1),
  Validators.max(100)
];

@Component({
  selector: 'app-table-config-dialog',
  templateUrl: './table-config-dialog.component.html',
  host: { class: 'component-wrapper' }
})
export class TableConfigDialogComponent extends BaseDialogComponent<[ITableConfig, string], void> {

  public readonly ERROR_MESSAGE: string = 'В форме присутствуют ошибки';
  public readonly CREATE_SUCCESS_MESSAGE: string = 'Параметры СТП были успешно заданы';
  public readonly EDIT_SUCCESS_MESSAGE: string = 'Параметры СТП были успешно отредактированы';

  public readonly MILI_FSM_TYPE: string = TableDataService.MILI_FSM_TYPE;
  public readonly MURA_FSM_TYPE: string = TableDataService.MURA_FSM_TYPE;

  public readonly FSM_TYPE_CONTROL_KEY: string = 'fsmType';

  public isProcessing: boolean = false;

  public tableConfigForm: FormGroup = this._formBuilder.group({
    length: [this.data.tableConfig.length, fieldValidators],
    numberOfStates: [this.data.tableConfig.numberOfStates, fieldValidators],
    numberOfX: [this.data.tableConfig.numberOfX, fieldValidators],
    numberOfY: [this.data.tableConfig.numberOfY, fieldValidators],
    [this.FSM_TYPE_CONTROL_KEY]: this.data.tableConfig.fsmType || TableDataService.MILI_FSM_TYPE
  });

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      tableConfig: ITableConfig,
      isInitialized: boolean
    },
    private _dialogRef: MatDialogRef<TableConfigDialogComponent>,
    private _snackBarService: SnackBarService,
    private _formBuilder: FormBuilder
  ) {
    super();
  }

  public isTableExist(): boolean {
    return this.data.isInitialized;
  }

  public hasNotice(fieldKey: string): boolean {
    const control: AbstractControl = this.tableConfigForm.get(fieldKey);

    return control.valid
      && control.value < this.data.tableConfig[fieldKey];
  }

  public save(): void {
    if (this.tableConfigForm.invalid) {
      this._snackBarService.showError(this.ERROR_MESSAGE);
      return;
    }

    this.tableConfigForm.disable();
    this.isProcessing = true;

    Observable.of(this.tableConfigForm.getRawValue())
      .delay(1000)
      .takeUntil(this._destroy$$)
      .subscribe((updatedConfig: ITableConfig) => {
        for (const key in updatedConfig) {
          if (key !== this.FSM_TYPE_CONTROL_KEY) {
            updatedConfig[key] = Number(updatedConfig[key]);
          }
        }

        const successMessage: string = this.isTableExist()
          ? this.EDIT_SUCCESS_MESSAGE
          : this.CREATE_SUCCESS_MESSAGE;

        this._success$$.next([updatedConfig, successMessage]);
      });
  }

  public close(): void {
    if (this.isTableExist()) {
      this._dialogRef.close();
    }
  }
}
