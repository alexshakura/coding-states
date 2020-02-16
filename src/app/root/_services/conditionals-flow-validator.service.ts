import { Injectable } from '@angular/core';
import { ITableConfig, ITableRow } from '@app/types';
import { SignalOperandGeneratorService } from './signal-operand-generator.service';
import { ConditionSignalOperand } from '@app/models';
import { FsmType } from '@app/enums';
import { ValidationError } from '@app/shared/_helpers/validation-error';

@Injectable()
export class ConditionalsFlowValidatorService {

  public constructor(
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService
  ) { }

  public validate(tableConfig: ITableConfig, tableData: ITableRow[]): void {
    const mapBySrcStateId = this.getMapBySrcStateId(tableData);

    for (const [srcStateId, srcStateTableRows] of mapBySrcStateId.entries()) {
      this.verifySingleTransition(srcStateTableRows);

      this.verifyRedundancy(tableConfig, srcStateTableRows, srcStateId);

      this.verifyOrthogonality(srcStateTableRows, srcStateId);
    }
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

  private verifyRedundancy(
    tableConfig: ITableConfig,
    srcStateTableRows: ITableRow[],
    srcStateId: number
  ): void {
    if (tableConfig.fsmType === FsmType.MILI) {
      return;
    }

    if (srcStateTableRows.length > 1) {
      const distStateFrequencyMap = new Map<number, number>();

      srcStateTableRows.forEach((tableRow) => {
        const distStateId = tableRow.distStateId as number;

        if (!distStateFrequencyMap.has(distStateId)) {
          distStateFrequencyMap.set(distStateId, 0);
        }

        const frequency = distStateFrequencyMap.get(distStateId) as number;

        if (frequency === 1) {
          throw new ValidationError(
            'ROOT.CODING_ALGORITHM_DIALOG.WARNING_REDUNDANT_TRANSITIONS_FOR_MURA',
            { index: `${srcStateId}` }
          );
        }

        distStateFrequencyMap.set(distStateId, frequency + 1);
      });
    }
  }

  private verifyOrthogonality(srcStateTableRows: ITableRow[], srcStateId: number): void {
    const uniqueIndexes = this.getUniqueConditionalIndexes(srcStateTableRows);
    const indexCodeValueMap = this.getIndexCodeValueMap(uniqueIndexes);
    const rowCount = 2 ** uniqueIndexes.length;

    const checkMatrix = srcStateTableRows.map((tableRow) => {
      const indexConditionalSignalsMap = this.getIndexConditionalSignalsMap(tableRow);
      const termCodes = this.getTermCodes(uniqueIndexes, indexCodeValueMap, indexConditionalSignalsMap);

      return new Array(rowCount)
        .fill(false)
        .map((_, code) => termCodes.includes(code));
    });

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      let onesCount = 0;

      for (let colIndex = 0; colIndex < srcStateTableRows.length; colIndex++) {
        onesCount += Number(checkMatrix[colIndex][rowIndex]);
      }

      if (onesCount !== 1) {
        throw new ValidationError(
          'ROOT.CODING_ALGORITHM_DIALOG.WARNING_INVALID_CONDITIONALS_FOR_STATE',
          { index: `${srcStateId}` }
        );
      }
    }
  }

  private getUniqueConditionalIndexes(srcStateTableRows: ITableRow[]): number[] {
    const conditionalSignals = this.signalOperandGeneratorService.getConditionalSignals();

    const usedSignals = srcStateTableRows
      .map((tableRow) => {
        return Array.from(tableRow.conditionalSignalsIds)
          .map((signalId) => {
            const signal = conditionalSignals.get(signalId) as ConditionSignalOperand;

            return signal.index;
          });
      })
      .flat();

    return Array.from(new Set(usedSignals));
  }

  private getIndexCodeValueMap(uniqueIndexes: number[]): Map<number, number> {
    const map = new Map();

    uniqueIndexes.forEach((signalIndex, position) => {
      map.set(signalIndex, 2 ** (uniqueIndexes.length - 1 - position));
    });

    return map;
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

  private getTermCodes(
    uniqueIndexes: number[],
    indexCodeValueMap: Map<number, number>,
    indexConditionalSignalsMap: Map<number, ConditionSignalOperand>
  ): number[] {
    let codes: number[] = [0];

    uniqueIndexes.forEach((index) => {
      const conditionalSignal = indexConditionalSignalsMap.get(index);

      if (conditionalSignal && conditionalSignal.inverted) {
        return;
      }

      const signalIndex = conditionalSignal
        ? conditionalSignal.index
        : index;

      const enabledSignalCode = indexCodeValueMap.get(signalIndex) as number;

      if (conditionalSignal) {
        codes = codes.map((code) => code + enabledSignalCode);
      } else {
        codes = codes
          .map((code) => [code, code + enabledSignalCode])
          .flat();
      }
    });

    return codes;
  }

}
