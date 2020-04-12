import { IExcitationFunctionsDataCell, IOutputFunctionsDataCell, ITableRow } from '@app/types';
import { ConditionSignalOperand, OutputSignalOperand, StateOperand } from '../operands';
import { ConjunctionExpression, DnfEquation } from '../equations';

export abstract class Fsm {

  public constructor(
    protected readonly tableData: ITableRow[],
    protected readonly statesMap: Map<number, StateOperand>,
    protected readonly conditionalSignalsMap: Map<number, ConditionSignalOperand>,
    protected readonly outputSignalsMap: Map<number, OutputSignalOperand>
  ) { }

  public getExcitationFunctions(totalBitsDepth: number): IExcitationFunctionsDataCell[] {
    const controlBitsList = this.getControlBitsList(totalBitsDepth);
    const excitationFunctionsMap = this.getExcitationDnfsMap(controlBitsList);

    return this.getSortedExcitationFunctionsList(excitationFunctionsMap);
  }

  private getControlBitsList(totalBitDepth: number): number[] {
    return new Array(totalBitDepth)
      .fill(1)
      .map((_, index) => 1 << index);
  }

  private getExcitationDnfsMap(controlBitsList: number[]): Map<number, DnfEquation> {
    const map: Map<number, DnfEquation> = new Map();

    this.tableData.forEach((tableRow) => {
      const excitationSignalsCode = tableRow.triggerExcitationSignals as number;

      const term = this.getTerm(tableRow);

      controlBitsList
        .filter((val: number) => val & excitationSignalsCode)
        .forEach((val: number) => {
          const functionIndex: number = controlBitsList.indexOf(val) + 1;
          this.addTermToFunction(term, functionIndex, map);
        });
    });

    return map;
  }

  private getTerm(tableRow: ITableRow): ConjunctionExpression {
    const stateOperand = this.statesMap.get(tableRow.srcStateId as number) as StateOperand;

    if (tableRow.unconditionalTransition) {
      return new ConjunctionExpression(stateOperand);
    }

    const expression = new ConjunctionExpression(stateOperand);

    tableRow.conditionalSignalsIds.forEach((conditionalSignalId) => {
      const operand = this.conditionalSignalsMap.get(conditionalSignalId) as ConditionSignalOperand;
      expression.addOperand(operand);
    });

    return expression;
  }

  private addTermToFunction(
    term: ConjunctionExpression,
    functionIndex: number,
    functionsMap: Map<number, DnfEquation>
  ): void {
    if (!functionsMap.has(functionIndex)) {
      functionsMap.set(functionIndex, new DnfEquation());
    }

    const excitationFunction = functionsMap.get(functionIndex) as DnfEquation;

    excitationFunction.addTerm(term);
  }

  private getSortedExcitationFunctionsList(dnfsMap: Map<number, DnfEquation>): IExcitationFunctionsDataCell[] {
    return Array.from(dnfsMap.entries())
      .sort(([leftIndex, _leftEquation], [rightIndex, _rightEquation]) => {
        if (leftIndex > rightIndex) {
          return 1;
        }

        if (rightIndex > leftIndex) {
          return -1;
        }

        return 0;
      })
      .map(([index, dnfEquation]) => {
        return {
          index,
          dnfEquation,
          shefferEquation: dnfEquation.toSheffer(),
        };
      });
  }

  protected getSortedOutputFunctionsList(dnfsMap: Map<number, DnfEquation>): IOutputFunctionsDataCell[] {
    return Array.from(dnfsMap.entries())
      .sort(([leftId, _leftEquation], [rightId, _rightEquation]) => {
        const leftOperand = this.outputSignalsMap.get(leftId) as OutputSignalOperand;
        const rightOperand = this.outputSignalsMap.get(rightId) as OutputSignalOperand;

        if (leftOperand.index > rightOperand.index) {
          return 1;
        }

        if (rightOperand.index > leftOperand.index) {
          return -1;
        }

        return 0;
      })
      .map(([id, dnfEquation]) => {
        const operand = this.outputSignalsMap.get(id) as OutputSignalOperand;

        return {
          index: operand.index,
          dnfEquation,
          shefferEquation: dnfEquation.toSheffer(),
        };
      });
  }

  public abstract getOutputFunctions(): IOutputFunctionsDataCell[];

}
