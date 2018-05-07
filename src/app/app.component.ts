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
import { SnackBarService } from './services/snack-bar.service';
import { Expression } from './shared/expression/expression';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  host: { class: 'component-wrapper' }
})
export class AppComponent implements OnInit {

  public readonly GENERATE_DOC_TABLE_ERROR: string = 'Таблица не закодирована';

  public isLoading: boolean = true;
  public isTableCoded: boolean = false;
  public isInitialized: boolean = false;

  public isGeneratingDoc: boolean = false;

  public tableConfig: App.TableConfig = {
    length: 16,
    numberOfStates: 8,
    numberOfX: 4,
    numberOfY: 4,
    fsmType: 'mura'
  };

  public constructor(
    private _dialog: MatDialog,
    private _tableDataService: TableDataService,
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
    const dialogRef: MatDialogRef<CodingAlgorithmDialogComponent> = this._dialog.open(CodingAlgorithmDialogComponent, {
      data: {
        tableConfig: this.tableConfig
      }
    });

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

  public generateDoc(): void {
    if (!this.isTableCoded) {
      this._snackBarService.showError(this.GENERATE_DOC_TABLE_ERROR);
      return;
    }

    this.isGeneratingDoc = true;

    this._tableDataService.tableData$
      .combineLatest(
        this._codingAlgorithmsService.capacity$,
        this._codingAlgorithmsService.outputBooleanFunctions$
      )
      .map(([tableData, capacity, booleanFunctions]: [App.TableRow[], number, App.TFunctionMap]) => {
        const updatedTableData = tableData.map((tableRow) => {
          const conditionals = Array.from(tableRow.x)
            .map((conditional) => ({ conditionalId: conditional.id, inverted: conditional.inverted }));

          return {
            ...tableRow,
            codeSrcState: this._tableDataService.formatStateCode(tableRow.codeSrcState, capacity),
            codeDistState: this._tableDataService.formatStateCode(tableRow.codeDistState, capacity),
            f: this._tableDataService.formatStateCode(tableRow.f, capacity),
            x: conditionals,
            hasY: tableRow.y.size === 0,
            y: Array.from(tableRow.y)
          };
        });

        const temp = [];

        booleanFunctions.forEach((expression, id) => {
          const updatedOperands = expression.operands.map((operand) => {
            return {
              ...operand,
              isExpression: operand instanceof Expression
            };
          });

          updatedOperands[updatedOperands.length - 1]['isLast'] = true;

          temp.push({
            index: id,
            expression: {
              ...expression,
              operands: updatedOperands
            }
          });
        });

        return [updatedTableData, temp];
      })
      .take(1)
      .subscribe(([tableData, outputBooleanFunctions]: any[]) => {
        JSZipUtils.getBinaryContent('/assets/doc-templates/table.docx', (error, content) => {
          if (error) {
            throw error;
          }

          const zip = new JSZip(content);
          const doc = new Docxtemplater().loadZip(zip);
          debugger;
          doc.setData({
            tableData,
            isMiliType: this.tableConfig.fsmType === TableDataService.MILI_FSM_TYPE,
            outputBooleanFunctions
          });


          try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render();
          }
          catch (error) {
              var e = {
                  message: error.message,
                  name: error.name,
                  stack: error.stack,
                  properties: error.properties,
              }
              console.log(JSON.stringify({error: e}));
              // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
              throw error;
          }

          var out=doc.getZip().generate({
              type:"blob",
              mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          }); //Output the document using Data-URI

          FileSaver.saveAs(out,"output.docx");
        });
      });
  }
}
