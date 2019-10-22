import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { StateOperand } from '../../shared/expression/state-operand';
import { ConditionSignalOperand } from '../../shared/expression/condition-signal-operand';
import { ITableConfig, ITableRow } from '@app/types';
import { SignalOperand } from '../../shared/expression/signal-operand';

@Injectable()
export class TableDataService {

  public get tableData$(): Observable<ITableRow[]> {
    return this._tableData$$.asObservable();
  }

  private _tableData$$: ReplaySubject<ITableRow[]> = new ReplaySubject(1);

  private conditionalSignals: SignalOperand[] = [];
  private outputSignals: number[] = [];

  private states: SignalOperand[] = [];

  public emitUpdatedTableData(updatedTableData: ITableRow[]): void {
    this._tableData$$.next(updatedTableData);
  }

  public generateRaw(newLength: number, startId: number = 0): ITableRow[] {
    const tableRow: ITableRow[] = [];

    for (let i = 0; i < newLength; i++) {
      tableRow.push({
        id: i + 1 + startId,
        srcState: null,
        codeSrcState: null,
        distState: null,
        codeDistState: null,
        x: new Set(),
        unconditionalX: false,
        y: new Set(),
        f: null,
      });
    }

    return tableRow;
  }

  public rearrangeTableData(tableData: ITableRow[], newLength: number): ITableRow[] {
    const newTableData: ITableRow[] = tableData.slice();

    if (tableData.length > newLength) {
      newTableData.splice(newLength);
    } else {
      newTableData.push(...this.generateRaw(newLength - tableData.length, tableData.length));
    }

    return newTableData;
  }

  public reconnectTableData(tableData: ITableRow[]): ITableRow[] {
    return tableData.map((tableRow: ITableRow) => {
      const updatedConditionals: SignalOperand[] = [];
      let newSrcState: SignalOperand | null = null;
      let newDistState: SignalOperand | null = null;

      if (tableRow.x.size > 0) {
        tableRow.x.forEach((conditionalSignal: SignalOperand) => {
          const updatedSignal: SignalOperand = this.conditionalSignals.find((newConditional: SignalOperand) => {
            return newConditional.id === conditionalSignal.id && conditionalSignal.inverted === newConditional.inverted;
          }) as SignalOperand;

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
        x: new Set(updatedConditionals),
      };
    });
  }

  private _findState(stateId: number): SignalOperand | null {
    return this.states.find((state: SignalOperand) => state.id === stateId) || null;
  }

  public generateStates(numberOfStates: number): SignalOperand[] {
    if (this.states.length !== numberOfStates) {
      this.states = new Array(numberOfStates)
          .fill(1)
          .map((_val: number, index: number) => new StateOperand(index + 1, false));
    }

    return this.states;
  }

  public generateConditionalSignals(numberOfConditionalSignals: number): SignalOperand[] {
    if (this.conditionalSignals.length !== numberOfConditionalSignals * 2) {
      this.conditionalSignals = [];

      for (let i: number = 0; i < numberOfConditionalSignals; i++) {
        this.conditionalSignals.push(
          new ConditionSignalOperand(i + 1, false),
          new ConditionSignalOperand(i + 1, true)
        );
      }
    }

    return this.conditionalSignals;
  }

  public generateOutputSignals(numberOfOutputSignals: number): number[] {
    if (this.outputSignals.length !== numberOfOutputSignals) {
      this.outputSignals = new Array(numberOfOutputSignals)
        .fill(1)
        .map((_val: number, index: number) => index + 1);
    }

    return this.outputSignals;
  }

  public shouldResetTableData(newTableConfig: ITableConfig, previousTableConfig: ITableConfig): boolean {
    return previousTableConfig &&
      (previousTableConfig.numberOfStates > newTableConfig.numberOfStates
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

  public getMockDataForUnitaryD(): ITableRow[] {
    return [
      {
        id: 1,
        srcState: this.states[6],
        codeSrcState: null,
        distState: this.states[0],
        codeDistState: null,
        unconditionalX: true,
        x: new Set(),
        y: new Set(),
        f: null,
      },
      {
        id: 2,
        srcState: this.states[5],
        codeSrcState: null,
        distState: this.states[0],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this.conditionalSignals[5]]),
        y: new Set(),
        f: null,
      },
      {
        id: 3,
        srcState: this.states[4],
        codeSrcState: null,
        distState: this.states[0],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this.conditionalSignals[1],
          this.conditionalSignals[5],
        ]),
        y: new Set(),
        f: null,
      },
      {
        id: 4,
        srcState: this.states[3],
        codeSrcState: null,
        distState: this.states[0],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this.conditionalSignals[1],
          this.conditionalSignals[5],
        ]),
        y: new Set(),
        f: null,
      },

      {
        id: 5,
        srcState: this.states[0],
        codeSrcState: null,
        distState: this.states[1],
        codeDistState: null,
        unconditionalX: true,
        x: new Set(),
        y: new Set([1, 2]),
        f: null,
      },

      {
        id: 6,
        srcState: this.states[1],
        codeSrcState: null,
        distState: this.states[2],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this.conditionalSignals[0]]),
        y: new Set([3]),
        f: null,
      },

      {
        id: 7,
        srcState: this.states[1],
        codeSrcState: null,
        distState: this.states[3],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this.conditionalSignals[1],
          this.conditionalSignals[2],
        ]),
        y: new Set([4]),
        f: null,
      },

      {
        id: 8,
        srcState: this.states[2],
        codeSrcState: null,
        distState: this.states[3],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this.conditionalSignals[2]]),
        y: new Set([4]),
        f: null,
      },

      {
        id: 9,
        srcState: this.states[1],
        codeSrcState: null,
        distState: this.states[4],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this.conditionalSignals[1],
          this.conditionalSignals[3],
        ]),
        y: new Set([5]),
        f: null,
      },

      {
        id: 10,
        srcState: this.states[2],
        codeSrcState: null,
        distState: this.states[4],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this.conditionalSignals[3]]),
        y: new Set([5]),
        f: null,
      },

      {
        id: 11,
        srcState: this.states[3],
        codeSrcState: null,
        distState: this.states[5],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this.conditionalSignals[0]]),
        y: new Set([3]),
        f: null,
      },

      {
        id: 12,
        srcState: this.states[4],
        codeSrcState: null,
        distState: this.states[5],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this.conditionalSignals[0]]),
        y: new Set([3]),
        f: null,
      },

      {
        id: 13,
        srcState: this.states[5],
        codeSrcState: null,
        distState: this.states[6],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this.conditionalSignals[4]]),
        y: new Set([6]),
        f: null,
      },
      {
        id: 14,
        srcState: this.states[4],
        codeSrcState: null,
        distState: this.states[6],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this.conditionalSignals[1],
          this.conditionalSignals[4],
        ]),
        y: new Set([6]),
        f: null,
      },
      {
        id: 15,
        srcState: this.states[3],
        codeSrcState: null,
        distState: this.states[6],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([
          this.conditionalSignals[1],
          this.conditionalSignals[4],
        ]),
        y: new Set([6]),
        f: null,
      },
    ];
  }

  public getMockDataForWrongGraph(): ITableRow[] {
    return [
      {
        id: 1,
        srcState: this.states[0],
        codeSrcState: null,
        distState: this.states[1],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this.conditionalSignals[0]]),
        y: new Set([1, 2]),
        f: null,
      },
      {
        id: 2,
        srcState: this.states[0],
        codeSrcState: null,
        distState: this.states[2],
        codeDistState: null,
        unconditionalX: false,
        x: new Set([this.conditionalSignals[1]]),
        y: new Set([2]),
        f: null,
      },
      {
        id: 3,
        srcState: this.states[1],
        codeSrcState: null,
        distState: this.states[1],
        codeDistState: null,
        unconditionalX: true,
        x: new Set(),
        y: new Set([3]),
        f: null,
      },
      {
        id: 4,
        srcState: this.states[2],
        codeSrcState: null,
        distState: this.states[1],
        codeDistState: null,
        unconditionalX: true,
        x: new Set(),
        y: new Set([2, 3]),
        f: null,
      },
    ];
  }

}
