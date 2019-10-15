import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar-content',
  templateUrl: './snack-bar-content.component.html',
  host: { class: 'component-wrapper' },
  changeDetection: ChangeDetectionStrategy.OnPush,
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
