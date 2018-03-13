import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-table-length-dialog',
  templateUrl: './table-length-dialog.component.html',
  styleUrls: ['./table-length-dialog.component.css']
})
export class TableLengthDialogComponent {

  public tableLengthControl: FormControl = new FormControl(null, [
    Validators.required,
    Validators.pattern(new RegExp(/^[-]?\d+$/)),
    Validators.min(0),
    Validators.max(100)
  ]);
}
