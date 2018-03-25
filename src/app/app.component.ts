import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { TableDataDialogComponent } from 'app/table-data-dialog/table-data-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isLoading: boolean = true;
  public tableData: App.TableData = {
    length: 16,
    numberOfStates: 8,
    numberOfX: 4,
    numberOfY: 4
  };

  public constructor(
    private _dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.isLoading = false;
    // setTimeout(() => {
    //   const dialogRef: MatDialogRef<TableLengthDialogComponent> = this._dialog.open(TableLengthDialogComponent, {
    //     disableClose: true
    //   });


    //   dialogRef.afterClosed()
    //     .take(1)
    //     .subscribe((tableData: App.TableData) => {
    //       this.tableData = tableData;
    //       this.isLoading = false;
    //     });
    // });
  }

  public changeTableParams(): void {
    const dialogRef: MatDialogRef<TableDataDialogComponent> = this._dialog.open(TableDataDialogComponent, {
      data: {
        tableData: this.tableData
      }
    }
  );

    dialogRef.afterClosed()
      .filter((tableData: App.TableData) => Boolean(tableData))
      .take(1)
      .subscribe((tableData: App.TableData) => {
        this.tableData = tableData;
      });
  }
}
