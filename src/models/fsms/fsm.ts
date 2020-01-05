import { ITableRow } from '@app/types';
import { ConditionSignalOperand, StateOperand } from '../operands';
import { ConjunctionExpression, DnfEquation } from '../equations';

export abstract class Fsm {

  public constructor(
    protected readonly tableData: ITableRow[],
    protected readonly statesMap: Map<number, StateOperand>,
    protected readonly conditionalSignalsMap: Map<number, ConditionSignalOperand>
  ) { }

  public getExcitationBooleanFunctionsMap(totalBitsDepth: number): Map<number, DnfEquation> {
    const controlBitsList = this.getControlBitsList(totalBitsDepth);

    const excitationFunctionsMap: Map<number, DnfEquation> = new Map();

    this.tableData.forEach((tableRow) => {
      const excitationSignalsCode = tableRow.distStateCode as number;
      const term = this.getTerm(tableRow);

      controlBitsList
        .filter((val: number) => val & excitationSignalsCode)
        .forEach((val: number) => {
          const functionIndex: number = controlBitsList.indexOf(val) + 1;
          this.addTermToFunction(term, functionIndex, excitationFunctionsMap);
        });
    });

    return excitationFunctionsMap;
  }

  private getControlBitsList(totalBitDepth: number): number[] {
    return new Array(totalBitDepth)
      .fill(1)
      .map((_, index) => 1 << index);
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

  public abstract getOutputBooleanFunctions(): Map<number, DnfEquation>;

}
