import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';


@Injectable()
export class TableDataService {

  public static readonly MILI_FSM_TYPE: string = 'mili';
  public static readonly MURA_FSM_TYPE: string = 'mura';

  public get tableData$(): Observable<App.TableRow[]> {
    return this._tableData$$.asObservable();
  }

  private _tableData$$: ReplaySubject<App.TableRow[]> = new ReplaySubject(1);

  private _conditionalSignals: App.ConditionalSignal[] = [];
  private _outputSignals: number[] = [];

  private _states: number[] = [];

  public emitUpdatedTableData(updatedTableData: App.TableRow[]): void {
    this._tableData$$.next(updatedTableData);
  }

  public generateRaw(newLength: number, startId: number = 0): App.TableRow[] {
    const tableRow: App.TableRow[] = [];

    for (let i: number = 0; i < newLength; i++) {
      tableRow.push({
        id: i + 1 + startId,
        srcState: null,
        codeSrcState: null,
        distState: null,
        codeDistState: null,
        x: new Set(),
        unconditionalX: false,
        y: new Set(),
        f: null
      });
    }

    return tableRow;
  }

  public rearrangeTableData(tableData: App.TableRow[], newLength: number): App.TableRow[] {
    const newTableData: App.TableRow[] = tableData.slice();


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

  public formatStateCode(stateCode: number, bitStateCapacity: number): string {
    const formattedCodingState: string = stateCode.toString(2);

    return bitStateCapacity > 1
      ? '0'.repeat(bitStateCapacity - formattedCodingState.length) + formattedCodingState
      : formattedCodingState;
  }

  public getMockDataForUnitaryD(): App.TableRow[] {
    return [
      {
        id: 1,
        srcState: 7,
        codeSrcState: null,
        distState: 1,
        codeDistState: null,
        unconditionalX: true,
        x: new Set(),
        y: new Set(),
        f: null
      },
      {
        id: 2,
        srcState: 6,
        codeSrcState: null,
        distState: 1,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([{
          id: 3,
          inverted: true
        }]),
        y: new Set(),
        f: null
      },
      {
        id: 3,
        srcState: 5,
        codeSrcState: null,
        distState: 1,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          {
            id: 1,
            inverted: true
          },
          {
            id: 3,
            inverted: true
          }
      ]),
        y: new Set(),
        f: null
      },
      {
        id: 4,
        srcState: 4,
        codeSrcState: null,
        distState: 1,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          {
            id: 1,
            inverted: true
          },
          {
            id: 3,
            inverted: true
          }
        ]),
        y: new Set(),
        f: null
      },

      {
        id: 5,
        srcState: 1,
        codeSrcState: null,
        distState: 2,
        codeDistState: null,
        unconditionalX: true,
        x: new Set(),
        y: new Set([1, 2]),
        f: null
      },

      {
        id: 6,
        srcState: 2,
        codeSrcState: null,
        distState: 3,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([{
          id: 1,
          inverted: false
        }]),
        y: new Set([3]),
        f: null
      },

      {
        id: 7,
        srcState: 2,
        codeSrcState: null,
        distState: 4,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          {
            id: 1,
            inverted: true
          },
          {
            id: 2,
            inverted: false
          }
        ]),
        y: new Set([4]),
        f: null
      },


      {
        id: 8,
        srcState: 3,
        codeSrcState: null,
        distState: 4,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([{
          id: 2,
          inverted: false
        }]),
        y: new Set([4]),
        f: null
      },

      {
        id: 9,
        srcState: 2,
        codeSrcState: null,
        distState: 5,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          {
            id: 1,
            inverted: true
          },
          {
            id: 2,
            inverted: true
          }
        ]),
        y: new Set([5]),
        f: null
      },

      {
        id: 10,
        srcState: 3,
        codeSrcState: null,
        distState: 5,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([{
          id: 2,
          inverted: true
        }]),
        y: new Set([5]),
        f: null
      },

      {
        id: 11,
        srcState: 4,
        codeSrcState: null,
        distState: 6,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([{
          id: 1,
          inverted: false
        }]),
        y: new Set([3]),
        f: null
      },

      {
        id: 12,
        srcState: 5,
        codeSrcState: null,
        distState: 6,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([{
          id: 1,
          inverted: false
        }]),
        y: new Set([3]),
        f: null
      },

      {
        id: 13,
        srcState: 6,
        codeSrcState: null,
        distState: 7,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([{
          id: 3,
          inverted: false
        }]),
        y: new Set([6]),
        f: null
      },
      {
        id: 14,
        srcState: 5,
        codeSrcState: null,
        distState: 7,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          {
            id: 1,
            inverted: true
          },
          {
            id: 3,
            inverted: false
          }
        ]),
        y: new Set([6]),
        f: null
      },
      {
        id: 15,
        srcState: 4,
        codeSrcState: null,
        distState: 7,
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          {
            id: 1,
            inverted: true
          },
          {
            id: 3,
            inverted: false
          }
        ]),
        y: new Set([6]),
        f: null
      },
    ];
  }
}
