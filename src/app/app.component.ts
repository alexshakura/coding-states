import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { TableConfigDialogComponent } from 'app/table-config-dialog/table-config-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isLoading: boolean = true;

  public tableConfig: App.TableConfig = {
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

  public changeTableConfig(): void {
    const dialogRef: MatDialogRef<TableConfigDialogComponent> = this._dialog.open(TableConfigDialogComponent, {
      data: {
        tableConfig: this.tableConfig
      }
    }
  );

    dialogRef.afterClosed()
      .filter((tableConfig: App.TableConfig) => Boolean(tableConfig))
      .take(1)
      .subscribe((tableConfig: App.TableConfig) => {
        this.tableConfig = tableConfig;
      });
  }
}
