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
  selector: 'app-table-data-dialog',
  templateUrl: './table-data-dialog.component.html',
  styleUrls: ['./table-data-dialog.component.css']
})
export class TableDataDialogComponent {

  public tableData: FormGroup = this._formBuilder.group({
    length: [this.data.tableData.length, fieldValidators],
    numberOfStates: [this.data.tableData.numberOfStates, fieldValidators],
    numberOfX: [this.data.tableData.numberOfX, fieldValidators],
    numberOfY: [this.data.tableData.numberOfY, fieldValidators]
  });

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tableData: App.TableData },
    private _formBuilder: FormBuilder
  ) { }

  public hasNotice(fieldKey: string): boolean {
    const control: AbstractControl = this.tableData.get(fieldKey);

    return control.valid
      && control.value < this.data.tableData[fieldKey];
  }
}
