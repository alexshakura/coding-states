import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { TableConfigDialogComponent } from 'app/table-config-dialog/table-config-dialog.component';
import { CodingAlgorithmDialogComponent } from './coding-algorithm-dialog/coding-algorithm-dialog.component';
import { CodingAlgorithmsService } from './services/coding-algorithms.service';
import { TableDataService } from './services/table-data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { class: 'component-wrapper' }
})
export class AppComponent implements OnInit {
  public isLoading: boolean = true;

  public isTableCoded: boolean = false;

  public tableConfig: App.TableConfig = {
    length: 16,
    numberOfStates: 8,
    numberOfX: 4,
    numberOfY: 4
  };

  public constructor(
    private _dialog: MatDialog,
    private _td: TableDataService,
    private _cd: CodingAlgorithmsService
  ) { }

  public ngOnInit(): void {
    this.isLoading = false;

    setTimeout(() => {
      this._td.tableData$
        .subscribe((x) => {
          this._cd.code(CodingAlgorithmsService.FREQUENCY_D_ALGORITHM, x);
          this.isTableCoded = true;
        });
    });
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

  public chooseCodingAlgorithm(): void {
    const dialogRef: MatDialogRef<CodingAlgorithmDialogComponent> = this._dialog.open(CodingAlgorithmDialogComponent);

    dialogRef.afterClosed()
      .filter(Boolean)
      .take(1)
      .subscribe(() => {
        this.isTableCoded = true;
      });
  }
}
