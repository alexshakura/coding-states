import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'lms-snack-bar-content',
  templateUrl: './snack-bar-content.component.html',
  host: { class: 'component-wrapper' },
})
export class SnackBarContentComponent {

  public constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {
      text: string,
      isError: boolean,
    }
  ) { }

  public close(): void {
    this._snackBar.dismiss();
  }
}
