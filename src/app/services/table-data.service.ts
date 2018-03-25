import { Injectable } from '@angular/core';

@Injectable()
export class TableDataService {

  private _conditionalSignals: App.ConditionalSignal[] = [];
  private _outputSignals: number[] = [];

  private _states: number[] = [];

  public generateRaw(newLength: number, startId: number = 0): App.TableRowData[] {
    const tableRowData: App.TableRowData[] = [];

    for (let i: number = 0; i < newLength; i++) {
      tableRowData.push({
        id: i + 1 + startId,
        srcState: null,
        codeSrcState: null,
        distState: null,
        codeDistState: null,
        x: new Set(),
        unconditionalX: false,
        y: new Set(),
        f: ''
      });
    }

    return tableRowData;
  }

  public rearrangeTableData(tableData: App.TableRowData[], newLength: number): App.TableRowData[] {
    const newTableData: App.TableRowData[] = tableData.slice();


    if (tableData.length > newLength) {
      newTableData.splice(-1, tableData.length - newLength);
    } else {
      newTableData.push(
        ...this.generateRaw(newLength - tableData.length, tableData.length)
      );
    }

    return newTableData;
  }

  public generateStates(numberOfStates: number): number[] {
    return this._generateProgressionArray(this._states, numberOfStates);
  }

  public generateConditionalSignals(numberOfConditionalSignals: number): App.ConditionalSignal[] {
    if (this._conditionalSignals.length !== numberOfConditionalSignals) {
      this._conditionalSignals = [];

      for (let i: number = 0; i < numberOfConditionalSignals; i++) {
        this._conditionalSignals.push(
          { id: i + 1, inverted: false },
          { id: i + 1, inverted: true }
        );
      }
    }

    return this._conditionalSignals;
  }

  public generateOutputSignals(numberOfOutputSignals: number): number[] {
    return this._generateProgressionArray(this._outputSignals, numberOfOutputSignals);
  }

  private _generateProgressionArray(currentArray: number[], newLength: number): number[] {
    if (currentArray.length !== newLength) {
      currentArray = new Array(newLength)
        .fill(1)
        .map((val: number, index: number) => index + 1);
    }


    return currentArray;
  }

  public shouldResetTableData(newTableConfig: App.TableConfig, previousTableConfig: App.TableConfig): boolean {
    return previousTableConfig &&
      ( previousTableConfig.numberOfStates > newTableConfig.numberOfStates
        || previousTableConfig.numberOfX > newTableConfig.numberOfX
        || previousTableConfig.numberOfY > newTableConfig.numberOfY
      );
  }
}
