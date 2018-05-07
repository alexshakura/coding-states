import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { SnackBarContentComponent } from '../shared/components/snack-bar-content/snack-bar-content.component';


@Injectable()
export class SnackBarService {

  private readonly _DURATION: number = 10000;

  public constructor(
    private _snackBar: MatSnackBar,
  ) { }

  public showMessage(text: string): void {
    this._snackBar.openFromComponent(SnackBarContentComponent, {
      extraClasses: 'mat-snack-bar-container--message',
      duration: this._DURATION,
      data: { text, isError: false },
    });
  }

  public showError(text: string = ''): void {
    this._snackBar.openFromComponent(SnackBarContentComponent, {
      extraClasses: 'mat-snack-bar-container--error',
      duration: this._DURATION,
      data: { text, isError: true },
    });
  }
}
