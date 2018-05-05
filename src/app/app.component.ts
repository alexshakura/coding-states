import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { TableConfigDialogComponent } from './table-config-dialog/table-config-dialog.component';
import { CodingAlgorithmDialogComponent } from './coding-algorithm-dialog/coding-algorithm-dialog.component';
import { CodingAlgorithmsService } from './services/coding-algorithms.service';
import { TableDataService } from './services/table-data.service';

import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as Docxtemplater from 'docxtemplater';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs/Observable';
import { SnackBarService } from './services/snack-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  host: { class: 'component-wrapper' }
})
export class AppComponent implements OnInit {

  public isLoading: boolean = true;
  public isTableCoded: boolean = false;
  public isInitialized: boolean = false;

  public tableConfig: App.TableConfig = {
    length: 16,
    numberOfStates: 8,
    numberOfX: 4,
    numberOfY: 4,
    fsmType: 'mura'
  };

  public constructor(
    private _dialog: MatDialog,
    private _td: TableDataService,
    private _codingAlgorithmsService: CodingAlgorithmsService,
    private _snackBarService: SnackBarService
  ) { }

  public ngOnInit(): void {
    // setTimeout(() => this.openTableConfigDialog());
    this.isLoading = false;
  }

  public openTableConfigDialog(): void {
    const dialogRef: MatDialogRef<TableConfigDialogComponent> = this._dialog.open(TableConfigDialogComponent ,{
      data: {
        tableConfig: this.tableConfig,
        isInitialized: this.isInitialized
      }
    });

    this.isInitialized = true;

    dialogRef.componentInstance.success$
      .takeUntil(dialogRef.afterClosed())
      .subscribe(([tableConfig, successMessage]: [App.TableConfig, string]) => {
        this.tableConfig = tableConfig;
        this._snackBarService.showMessage(successMessage);
        this.isTableCoded = false;

        dialogRef.close();
      });
  }

  public openCodingAlgorithmDialog(): void {
    const dialogRef: MatDialogRef<CodingAlgorithmDialogComponent> = this._dialog.open(CodingAlgorithmDialogComponent);

    dialogRef.componentInstance.success$
      .takeUntil(dialogRef.afterClosed())
      .subscribe((successMessage: string) => {
        this._snackBarService.showMessage(successMessage);
        this.isTableCoded = true;

        dialogRef.close();
      });

    dialogRef.componentInstance.error$
      .takeUntil(dialogRef.afterClosed())
      .subscribe((errorMessage: string) => {
        this._snackBarService.showError(errorMessage);
      });
  }

  // public generateDoc(): void {
  //   this._td.tableData$
  //     .switchMap((tableData: App.TableRow[]) => {
  //       const invalidRows: number[] = this._codingAlgorithmsService.checkTableData(tableData);

  //       return !invalidRows.length
  //         ? Observable.of(tableData)
  //         : Observable.throw(invalidRows.slice(0, 3));
  //     })
  //     .take(1)
  //     .subscribe(
  //       (tableData: App.TableRow[]) => {

  //       },
  //       (invalidRows: number[]) => {
  //         this._snackBarService.showError(``);
  //       }
  //     );


  //   this._codingAlgorithmsService.
  //   JSZipUtils.getBinaryContent('/assets/doc-templates/test.docx', (error, content) => {
  //     if (error) {
  //       throw error;
  //     }

  //     const zip = new JSZip(content);
  //     const doc = new Docxtemplater().loadZip(zip);

  //     doc.setData({
  //       test: 'a',
  //       xest: 'b',
  //       yo: 'xo'
  //     });


  //     try {
  //       // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
  //       doc.render();
  //     }
  //     catch (error) {
  //         var e = {
  //             message: error.message,
  //             name: error.name,
  //             stack: error.stack,
  //             properties: error.properties,
  //         }
  //         console.log(JSON.stringify({error: e}));
  //         // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
  //         throw error;
  //     }

  //     var out=doc.getZip().generate({
  //         type:"blob",
  //         mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     }); //Output the document using Data-URI

  //     FileSaver.saveAs(out,"output.docx");
  //   });
  // }
}
