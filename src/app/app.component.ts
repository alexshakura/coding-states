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

import * as expressions from 'angular-expressions';
import { Operand } from './shared/expression/operand';
import { ConstantOperand } from './shared/expression/constant-operand';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  host: { class: 'component-wrapper' }
})
export class AppComponent implements OnInit {

  public readonly GENERATE_DOC_TABLE_ERROR: string = 'Таблица не закодирована';
  public readonly GENERATE_DOC_SUCCESS: string = 'Файл с кодировками был успешно сгенерирован';
  public readonly GENERATE_DOC_ERROR: string = 'Что-то пошло не так, перепроверьте Ваши данные';

  public isLoading: boolean = true;
  public isTableCoded: boolean = false;
  public isInitialized: boolean = false;

  public isGeneratingDoc: boolean = false;

  public tableConfig: App.TableConfig = {
    length: 16,
    numberOfStates: 8,
    numberOfX: 4,
    numberOfY: 4,
    fsmType: 'mili'
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
        this._codingAlgorithmsService.outputFunctions$,
        this._codingAlgorithmsService.transitionFunctions$
      )
      .map(([tableData, capacity, outputFunctions, transitionFunctions]: [App.TableRow[], number, App.IFunctions, App.IFunctions]) => {
        const updatedTableData = tableData.map((tableRow) => {
          return {
            ...tableRow,
            codeSrcState: this._tableDataService.formatStateCode(tableRow.codeSrcState, capacity),
            codeDistState: this._tableDataService.formatStateCode(tableRow.codeDistState, capacity),
            f: this._tableDataService.formatStateCode(tableRow.f, capacity),
            x: Array.from(tableRow.x),
            y: Array.from(tableRow.y)
          };
        });

        const rearrangedOutputFunctions = [];
        const rearrangedTransitionFunctions = [];

        outputFunctions.boolean.forEach((val, key) => {
          rearrangedOutputFunctions.push({
            boolean: val,
            sheffer: outputFunctions.sheffer.get(key)
          });
        });

        transitionFunctions.boolean.forEach((val, key) => {
          rearrangedTransitionFunctions.push({
            boolean: val,
            sheffer: transitionFunctions.sheffer.get(key)
          });
        });

        return [updatedTableData, rearrangedOutputFunctions, rearrangedTransitionFunctions];
      })
      .take(1)
      .subscribe(([tableData, outputFunctions, transitionFunctions]: any[]) => {
        JSZipUtils.getBinaryContent('/assets/doc-templates/table.docx', (error, content) => {
          if (error) {
            throw error;
          }

          const angularParser = (tag: string) => {
            return {
                get: (scope, context) => {
                  if (tag.includes('$index')) {
                    const indexes: number[] = context.scopePathItem;
                    const val: number =  indexes[indexes.length - 1];

                    return expressions.compile(tag.replace('$index', val.toString(10)))();
                  }

                  if (tag === 'isExpression') {
                    return scope instanceof Expression;
                  }

                  if (tag === 'isConstantOperand') {
                    return scope instanceof ConstantOperand;
                  }

                  if (tag === 'isNotLastItem') {
                    const parent = context.scopeList[context.scopeList.length - 2];
                    const iterablePath: string[] = context.scopePath[context.scopePath.length - 1].split('.');

                    let iterable = parent;

                    iterablePath.forEach((prop: string) => iterable = iterable[prop]);

                    return iterable.indexOf(scope) !== iterable.length - 1;
                  }

                  if (tag === 'expressionSign') {
                    return this._getParentExpressionSign(context);
                  }

                  const result = tag === '.'
                    ? function(s) { return s; }
                    : function(s) { return expressions.compile(tag.replace(/(’|“|”)/g, "'"))(s); };

                  return result(scope);
                }
            };
          };

          const zip = new JSZip(content);
          const doc = new Docxtemplater().loadZip(zip).setOptions({ parser: angularParser, paragraphLoop: true });

          doc.setData({
            tableData,
            isMiliType: this.tableConfig.fsmType === TableDataService.MILI_FSM_TYPE,
            outputFunctions,
            transitionFunctions
          });


          try {
            doc.render();

            const out = doc.getZip().generate({
              type: 'blob',
              mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            FileSaver.saveAs(out, 'coding_results.docx');

            this._snackBarService.showMessage(this.GENERATE_DOC_SUCCESS);
          } catch {
            this._snackBarService.showMessage(this.GENERATE_DOC_ERROR);
          } finally {
            this.isGeneratingDoc = false;
          }
        });
      });
  }

  private _getParentExpressionSign(context): string {
    const iterableIndex: number = context.scopePath.length - 2;
    const iterablePath: string[] = context.scopePath[iterableIndex].split('.');
    const parent = context.scopeList[iterableIndex];

    iterablePath.pop();
    let iterable = parent;

    iterablePath.forEach((path: string) => iterable = iterable[path]);
    // debugger;
    return iterable && iterable.sign;
  }
}
