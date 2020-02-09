import { Injectable } from '@angular/core';
import { ITableConfig, ITableRow } from '@app/types';
import { SignalOperandGeneratorService } from './signal-operand-generator.service';
import { ConditionSignalOperand, StateOperand } from '@app/models';
import { FsmType } from '@app/enums';

@Injectable()
export class ConditionalsFlowValidatorService {

  public constructor(
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService
  ) { }

  public validate(tableConfig: ITableConfig, tableData: ITableRow[]): StateOperand[] {
    const mapBySrcStateId = this.getMapBySrcStateId(tableData);
    const states = this.signalOperandGeneratorService.getStates();
    const invalidSrcStateIds = [];

    for (const [srcStateId, srcStateTableRows] of mapBySrcStateId.entries()) {
      try {
        this.verifySingleTransition(srcStateTableRows);

        const uniqueConditionalIndexes = this.getUniqueConditionalIndexes(srcStateTableRows);

        this.verifyUniqueSignalsCount(srcStateTableRows.length, uniqueConditionalIndexes.size);

        this.verifyOrder(srcStateTableRows);

        this.verifyRedundancy(tableConfig, srcStateTableRows);

        this.verifyOrthogonality(Array.from(uniqueConditionalIndexes), srcStateTableRows);
      } catch (error) {
        invalidSrcStateIds.push(srcStateId);
      }
    }

    return invalidSrcStateIds.map((stateId) => {
      return states.get(stateId) as StateOperand;
    });
  }

  private getMapBySrcStateId(tableData: ITableRow[]): Map<number, ITableRow[]> {
    const map = new Map<number, ITableRow[]>();

    tableData.forEach((tableRow) => {
      const srcStateId = tableRow.srcStateId as number;

      if (!map.has(srcStateId)) {
        map.set(srcStateId, []);
      }

      const srcStateTableRows = map.get(srcStateId) as ITableRow[];

      srcStateTableRows.push(tableRow);
    });

    return map;
  }

  private verifySingleTransition(srcStateTableRows: ITableRow[]): void {
    if (srcStateTableRows.length === 1 && !srcStateTableRows[0].unconditionalTransition) {
      throw new Error();
    }
  }

  private getUniqueConditionalIndexes(srcStateTableRows: ITableRow[]): Set<number> {
    const conditionalSignals = this.signalOperandGeneratorService.getConditionalSignals();
    const usedSignals: ConditionSignalOperand[] = [];

    srcStateTableRows.forEach((tableRow) => {
      tableRow.conditionalSignalsIds.forEach((conditionalSignalId) => {
        const signal = conditionalSignals.get(conditionalSignalId) as ConditionSignalOperand;

        usedSignals.push(signal);
      });
    });

    return new Set(usedSignals.map((signal) => signal.index));
  }

  private verifyUniqueSignalsCount(transitionCount: number, uniqueSignalsCount: number): void {
    if (transitionCount !== (uniqueSignalsCount + 1)) {
      throw new Error();
    }
  }

  private verifyOrder(srcStateTableRows: ITableRow[]): void {
    const conditionalSignals = this.signalOperandGeneratorService.getConditionalSignals();

    srcStateTableRows.forEach((tableRow) => {
      const isSorted = Array.from(tableRow.conditionalSignalsIds)
        .every((signalId, index, array) => {
          if (!index) {
            return true;
          }

          const currentSignal = conditionalSignals.get(signalId) as ConditionSignalOperand;
          const previousSignal = conditionalSignals.get(array[index - 1]) as ConditionSignalOperand;

          return previousSignal.index <= currentSignal.index;
        });

      if (!isSorted) {
        throw new Error();
      }
    });
  }

  private verifyRedundancy(tableConfig: ITableConfig, srcStateTableRows: ITableRow[]): void {
    if (tableConfig.fsmType === FsmType.MILI) {
      return;
    }

    if (srcStateTableRows.length === 2) {
      const states = this.signalOperandGeneratorService.getStates();
      const firstDistState = states.get(srcStateTableRows[0].distStateId as number) as StateOperand;
      const secondDistState = states.get(srcStateTableRows[1].distStateId as number) as StateOperand;

      if (firstDistState.equalTo(secondDistState)) {
        throw new Error();
      }
    }
  }

  private verifyOrthogonality(uniqueConditionalIndexes: number[], tableRows: ITableRow[]): void {
    const minIndex = Math.min(...uniqueConditionalIndexes);
    const maxIndex = Math.max(...uniqueConditionalIndexes);
    const rowCount = 2 ** uniqueConditionalIndexes.length;

    const checkMatrix = tableRows.map((tableRow) => {
      const map = this.getIndexConditionalSignalsMap(tableRow);
      const pairCodes = this.getPairCodes(map, minIndex, maxIndex, uniqueConditionalIndexes.length);

      return new Array(rowCount)
        .fill(false)
        .map((_, code) => pairCodes.includes(code));
    });

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      let onesCount = 0;

      for (let colIndex = 0; colIndex < tableRows.length; colIndex++) {
        onesCount += Number(checkMatrix[colIndex][rowIndex]);
      }

      if (onesCount !== 1) {
        throw new Error();
      }
    }
  }

  private getIndexConditionalSignalsMap(tableRow: ITableRow): Map<number, ConditionSignalOperand> {
    const conditionalSignals = this.signalOperandGeneratorService.getConditionalSignals();
    const map = new Map();

    tableRow.conditionalSignalsIds.forEach((id) => {
      const conditionalSignal = conditionalSignals.get(id) as ConditionSignalOperand;

      map.set(conditionalSignal.index, conditionalSignal);
    });

    return map;
  }

  private getPairCodes(
    indexConditionalSignalsMap: Map<number, ConditionSignalOperand>,
    minIndex: number,
    maxIndex: number,
    totalCount: number
  ): number[] {
    let codes: number[] = [0];

    for (let index = minIndex, iteration = 0; index <= maxIndex; index++, iteration++) {
      const conditionalSignal = indexConditionalSignalsMap.get(index);

      if (conditionalSignal) {
        if (conditionalSignal.inverted) {
          continue;
        }

        codes = codes.map((code) => code + this.getEnabledSignalCode(totalCount, iteration));
      } else {
        codes = [].concat.apply([], codes.map((code) => {
          return [
            code,
            code + this.getEnabledSignalCode(totalCount, iteration),
          ];
        })
        );
      }
    }

    return codes;
  }

  private getEnabledSignalCode(totalCount: number, position: number): number {
    return 2 ** (totalCount - 1 - position);
  }

}
