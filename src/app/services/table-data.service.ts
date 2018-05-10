import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { StateOperand } from '../shared/expression/state-operand';
import { ConditionSignalOperand } from '../shared/expression/condition-signal-operand';


@Injectable()
export class TableDataService {

  public static readonly MILI_FSM_TYPE: string = 'mili';
  public static readonly MURA_FSM_TYPE: string = 'mura';

  public get tableData$(): Observable<App.ITableRow[]> {
    return this._tableData$$.asObservable();
  }

  private _tableData$$: ReplaySubject<App.ITableRow[]> = new ReplaySubject(1);

  private _conditionalSignals: App.ISignalOperand[] = [];
  private _outputSignals: number[] = [];

  private _states: App.ISignalOperand[] = [];

  public emitUpdatedTableData(updatedTableData: App.ITableRow[]): void {
    this._tableData$$.next(updatedTableData);
  }

  public generateRaw(newLength: number, startId: number = 0): App.ITableRow[] {
    const tableRow: App.ITableRow[] = [];

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

  public rearrangeTableData(tableData: App.ITableRow[], newLength: number): App.ITableRow[] {
    const newTableData: App.ITableRow[] = tableData.slice();

    if (tableData.length > newLength) {
      newTableData.splice(newLength);
    } else {
      newTableData.push(...this.generateRaw(newLength - tableData.length, tableData.length));
    }

    return newTableData;
  }

  public reconnectTableData(tableData: App.ITableRow[]): App.ITableRow[] {
    return tableData.map((tableRow: App.ITableRow) => {
      const updatedConditionals: App.ISignalOperand[] = [];
      let newSrcState: App.ISignalOperand = null;
      let newDistState: App.ISignalOperand = null;

      if (tableRow.x.size > 0) {
        tableRow.x.forEach((conditionalSignal: App.ISignalOperand) => {
          const updatedSignal: App.ISignalOperand = this._conditionalSignals.find((newConditional: App.ISignalOperand) => {
            return newConditional.id === conditionalSignal.id && conditionalSignal.inverted === newConditional.inverted;
          });

          updatedConditionals.push(updatedSignal);
        });
      }

      if (tableRow.srcState) {
        newSrcState = this._findState(tableRow.srcState.id);
      }

      if (tableRow.distState) {
        newDistState = this._findState(tableRow.distState.id);
      }

      return {
        ...tableRow,
        srcState: newSrcState,
        distState: newDistState,
        x: new Set(updatedConditionals)
      };
    });
  }

  private _findState(stateId: number): App.ISignalOperand {
    return this._states.find((state: App.ISignalOperand) => state.id === stateId);
  }

  public generateStates(numberOfStates: number): App.ISignalOperand[] {
    if (this._states.length !== numberOfStates) {
      this._states = new Array(numberOfStates)
          .fill(1)
          .map((val: number, index: number) => new StateOperand(index + 1, false));
    }

    return this._states;
  }

  public generateConditionalSignals(numberOfConditionalSignals: number): App.ISignalOperand[] {
    if (this._conditionalSignals.length !== numberOfConditionalSignals * 2) {
      this._conditionalSignals = [];

      for (let i: number = 0; i < numberOfConditionalSignals; i++) {
        this._conditionalSignals.push(
          new ConditionSignalOperand(i + 1, false),
          new ConditionSignalOperand(i + 1, true)
        );
      }
    }

    return this._conditionalSignals;
  }

  public generateOutputSignals(numberOfOutputSignals: number): number[] {
    if (this._outputSignals.length !== numberOfOutputSignals) {
      this._outputSignals = new Array(numberOfOutputSignals)
        .fill(1)
        .map((val: number, index: number) => index + 1);
    }

    return this._outputSignals;
  }

  public shouldResetTableData(newTableConfig: App.ITableConfig, previousTableConfig: App.ITableConfig): boolean {
    return previousTableConfig &&
      ( previousTableConfig.numberOfStates > newTableConfig.numberOfStates
        || previousTableConfig.numberOfX > newTableConfig.numberOfX
        || previousTableConfig.numberOfY > newTableConfig.numberOfY
      );
  }

  public formatStateCode(stateCode: number, capacity: number): string {
    const formattedCodingState: string = stateCode.toString(2);

    return capacity > 1
      ? '0'.repeat(capacity - formattedCodingState.length) + formattedCodingState
      : formattedCodingState;
  }

  public getMockDataForUnitaryD(): App.ITableRow[] {
    this.generateStates(7);
    this.generateConditionalSignals(3);

    return [
      {
        id: 1,
        srcState: this._states[6],
        codeSrcState: null,
        distState: this._states[0],
        codeDistState: null,
        unconditionalX: true,
        x: new Set(),
        y: new Set(),
        f: null
      },
      {
        id: 2,
        srcState: this._states[5],
        codeSrcState: null,
        distState: this._states[0],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this._conditionalSignals[5]]),
        y: new Set(),
        f: null
      },
      {
        id: 3,
        srcState: this._states[4],
        codeSrcState: null,
        distState: this._states[0],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this._conditionalSignals[1],
          this._conditionalSignals[5]
        ]),
        y: new Set(),
        f: null
      },
      {
        id: 4,
        srcState: this._states[3],
        codeSrcState: null,
        distState: this._states[0],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this._conditionalSignals[1],
          this._conditionalSignals[5],
        ]),
        y: new Set(),
        f: null
      },

      {
        id: 5,
        srcState: this._states[0],
        codeSrcState: null,
        distState: this._states[1],
        codeDistState: null,
        unconditionalX: true,
        x: new Set(),
        y: new Set([1, 2]),
        f: null
      },

      {
        id: 6,
        srcState: this._states[1],
        codeSrcState: null,
        distState: this._states[2],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this._conditionalSignals[0]]),
        y: new Set([3]),
        f: null
      },

      {
        id: 7,
        srcState: this._states[1],
        codeSrcState: null,
        distState: this._states[3],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this._conditionalSignals[1],
          this._conditionalSignals[2],
        ]),
        y: new Set([4]),
        f: null
      },


      {
        id: 8,
        srcState: this._states[2],
        codeSrcState: null,
        distState: this._states[3],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this._conditionalSignals[2]]),
        y: new Set([4]),
        f: null
      },

      {
        id: 9,
        srcState: this._states[1],
        codeSrcState: null,
        distState: this._states[4],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this._conditionalSignals[1],
          this._conditionalSignals[3],
        ]),
        y: new Set([5]),
        f: null
      },

      {
        id: 10,
        srcState: this._states[2],
        codeSrcState: null,
        distState: this._states[4],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this._conditionalSignals[3]]),
        y: new Set([5]),
        f: null
      },

      {
        id: 11,
        srcState: this._states[3],
        codeSrcState: null,
        distState: this._states[5],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this._conditionalSignals[0]]),
        y: new Set([3]),
        f: null
      },

      {
        id: 12,
        srcState: this._states[4],
        codeSrcState: null,
        distState: this._states[5],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this._conditionalSignals[0]]),
        y: new Set([3]),
        f: null
      },

      {
        id: 13,
        srcState: this._states[5],
        codeSrcState: null,
        distState: this._states[6],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this._conditionalSignals[4]]),
        y: new Set([6]),
        f: null
      },
      {
        id: 14,
        srcState: this._states[4],
        codeSrcState: null,
        distState: this._states[6],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this._conditionalSignals[1],
          this._conditionalSignals[4],
        ]),
        y: new Set([6]),
        f: null
      },
      {
        id: 15,
        srcState: this._states[3],
        codeSrcState: null,
        distState: this._states[6],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this._conditionalSignals[1],
          this._conditionalSignals[4],
        ]),
        y: new Set([6]),
        f: null
      },
    ];
  }
}
