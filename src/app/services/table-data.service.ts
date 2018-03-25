import { Injectable } from '@angular/core';

@Injectable()
export class TableDataService {

  private _conditionalSignals: App.ConditionalSignal[] = [];
  private _outputSignals: number[] = [];

  private _states: number[] = [];

  public generate(tableConfig: Readonly<App.TableConfig>): App.TableRowData[] {
    const tableRowData: App.TableRowData[] = [];

    for (let i: number = 0; i < tableConfig.numberOfStates; i++) {
      tableRowData.push({
        id: i + 1,
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

  public generateStates(numberOfStates: number): number[] {
    return this._generateProgressionArray(this._states, numberOfStates);
  }

  public generateConditionalSignals(numberOfConditionalSignals: number): App.ConditionalSignal[] {
    if (this._conditionalSignals.length !== numberOfConditionalSignals) {
      for (let i: number = 0; i < numberOfConditionalSignals ; i++) {
        this._conditionalSignals.push(
          { id: i + 1,     inverted: false },
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
}
