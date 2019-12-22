import { Injectable } from '@angular/core';
import { ConditionSignalOperand, SignalOperand, StateOperand } from '@app/models';
import { ITableConfig, ITableRow, TSensitiveTableConfigFields } from '@app/types';


@Injectable()
export class TableDataService {

  private conditionalSignals: SignalOperand[] = [];
  private outputSignals: number[] = [];

  private states: SignalOperand[] = [];

  public generateEmptyData(length: number, startId: number = 0): ITableRow[] {
    const tableRow: ITableRow[] = [];

    for (let i = 0; i < length; i++) {
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
    return tableData.length > newLength
      ? tableData.slice(0, newLength)
      : [...tableData, ...this.generateEmptyData(newLength - tableData.length, tableData.length)];
  }

  public generateStates(numberOfStates: number): SignalOperand[] {
    if (this.states.length !== numberOfStates) {
      this.states = new Array(numberOfStates)
          .fill(1)
          .map((_val: number, index: number) => StateOperand.create(index, false));
    }

    return this.states;
  }

  public generateConditionalSignals(numberOfConditionalSignals: number): SignalOperand[] {
    if (this.conditionalSignals.length !== numberOfConditionalSignals * 2) {
      this.conditionalSignals = [];

      for (let i: number = 0; i < numberOfConditionalSignals; i++) {
        this.conditionalSignals.push(
          ConditionSignalOperand.create(i + 1, false),
          ConditionSignalOperand.create(i + 2, true)
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

  public shouldDeleteCurrentData(newConfig: ITableConfig, oldConfig: ITableConfig | null): boolean {
    return !!oldConfig
      && (
        this.isConfigSensitiveFieldViolated(oldConfig, newConfig, 'numberOfStates')
        || this.isConfigSensitiveFieldViolated(oldConfig, newConfig, 'numberOfX')
        || this.isConfigSensitiveFieldViolated(oldConfig, newConfig, 'numberOfY')
      );
  }

  public isConfigSensitiveFieldViolated(
    oldConfig: ITableConfig,
    newConfig: ITableConfig,
    field: TSensitiveTableConfigFields
  ): boolean {
    return oldConfig[field] > newConfig[field];
  }

  public formatStateCode(stateCode: number, capacity: number): string {
    const formattedCodingState: string = stateCode.toString(2);

    return capacity > 1
      ? '0'.repeat(capacity - formattedCodingState.length) + formattedCodingState
      : formattedCodingState;
  }

  public getMockDataForUnitaryD(): ITableRow[] {
    this.generateStates(7);
    this.generateConditionalSignals(3);
    this.generateOutputSignals(6);

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
