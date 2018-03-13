import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TableLengthDialogComponent } from 'app/table-length-dialog/table-length-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isLoading: boolean = true;
  public tableLength: number;

  public constructor(
    private _dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    setTimeout(() => {
      const dialogRef: MatDialogRef<TableLengthDialogComponent> = this._dialog.open(TableLengthDialogComponent, {
        disableClose: true
      });


      dialogRef.afterClosed()
        .take(1)
        .subscribe((tableLength: number) => {
          this.tableLength = tableLength;
          this.isLoading = false;
        });
    });
  }
}
