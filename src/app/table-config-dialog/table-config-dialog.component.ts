import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

const fieldValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(new RegExp(/^[-]?\d+$/)),
  Validators.min(1),
  Validators.max(100)
];

@Component({
  selector: 'app-table-config-dialog',
  templateUrl: './table-config-dialog.component.html',
  styleUrls: ['./table-config-dialog.component.css']
})
export class TableConfigDialogComponent {

  public tableConfigForm: FormGroup = this._formBuilder.group({
    length: [this.data.tableConfig.length, fieldValidators],
    numberOfStates: [this.data.tableConfig.numberOfStates, fieldValidators],
    numberOfX: [this.data.tableConfig.numberOfX, fieldValidators],
    numberOfY: [this.data.tableConfig.numberOfY, fieldValidators]
  });

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tableConfig: App.TableConfig },
    private _formBuilder: FormBuilder
  ) { }

  public isTableExist(): boolean {
    return Object.keys(this.data.tableConfig).length > 0;
  }

  public hasNotice(fieldKey: string): boolean {
    const control: AbstractControl = this.tableConfigForm.get(fieldKey);

    return control.valid
      && control.value < this.data.tableConfig[fieldKey];
  }
}
