import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';

const fieldValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(new RegExp(/^[-]?\d+$/)),
  Validators.min(0),
  Validators.max(100)
];

@Component({
  selector: 'app-table-length-dialog',
  templateUrl: './table-length-dialog.component.html',
  styleUrls: ['./table-length-dialog.component.css']
})
export class TableLengthDialogComponent {

  public tableData: FormGroup = this._formBuilder.group({
    length: [null, fieldValidators],
    numberOfStates: [null, fieldValidators],
    numberOfX: [null, fieldValidators],
    numberOfY: [null, fieldValidators]
  });

  public constructor(
    private _formBuilder: FormBuilder
  ) { }
}
