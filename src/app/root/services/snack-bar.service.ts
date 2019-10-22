import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SnackBarContentComponent } from '../../shared/components/snack-bar-content/snack-bar-content.component';

@Injectable()
export class SnackBarService {

  private readonly DURATION: number = 3000;

  public constructor(
    private readonly snackBar: MatSnackBar
  ) { }

  public showMessage(text: string): void {
    this.snackBar.openFromComponent(SnackBarContentComponent, {
      panelClass: 'mat-snack-bar-container--message',
      duration: this.DURATION,
      data: { text, isError: false },
    });
  }

  public showError(text?: string): void {
    this.snackBar.openFromComponent(SnackBarContentComponent, {
      panelClass: 'mat-snack-bar-container--error',
      duration: this.DURATION,
      data: { text, isError: true },
    });
  }
}
