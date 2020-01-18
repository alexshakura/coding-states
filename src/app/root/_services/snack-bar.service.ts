import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarContentComponent } from '@app/shared/_components/snack-bar-content/snack-bar-content.component';

@Injectable()
export class SnackBarService {

  private readonly DURATION: number = 3000;

  public constructor(
    private readonly snackBar: MatSnackBar
  ) { }

  public showMessage(key: string, textParams?: Record<string, string>): void {
    this.snackBar.openFromComponent(SnackBarContentComponent, {
      panelClass: 'mat-snack-bar-container--message',
      duration: this.DURATION,
      data: {
        textKey: key,
        textParams,
        isError: false,
      },
    });
  }

  public showError(key?: string, textParams?: Record<string, string>): void {
    this.snackBar.openFromComponent(SnackBarContentComponent, {
      panelClass: 'mat-snack-bar-container--error',
      duration: this.DURATION,
      data: {
        textKey: key,
        textParams,
        isError: true,
      },
    });
  }
}
