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
    private readonly snackBar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public readonly data: {
      textKey: string,
      textParams: Record<string, string>,
      isError: boolean
    }
  ) { }

  public close(): void {
    this.snackBar.dismiss();
  }
}
