import { ConjunctiveExpression, DisjunctiveExpression, Expression } from '../expressions';
import { ITableRow, TFunctionMap } from '@app/types';
import { ConditionSignalOperand, Operand, StateOperand } from '../operands';

export abstract class Fsm {

  public constructor(
    protected readonly tableData: ITableRow[],
    protected readonly statesMap: Map<number, StateOperand>,
    protected readonly conditionalSignalsMap: Map<number, ConditionSignalOperand>
  ) { }

  public getExcitationBooleanFunctionsMap(totalBitsDepth: number): TFunctionMap {
    const controlBitsList = this.getControlBitsList(totalBitsDepth);

    const excitationFunctionsMap: Map<number, Expression> = new Map();

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

  private getTerm(tableRow: ITableRow): Expression | Operand {
    const stateOperand = this.statesMap.get(tableRow.srcStateId as number) as StateOperand;

    if (tableRow.unconditionalTransition) {
      return stateOperand;
    }

    const expression = new ConjunctiveExpression([stateOperand]);

    tableRow.conditionalSignalsIds.forEach((conditionalSignalId) => {
      const operand = this.conditionalSignalsMap.get(conditionalSignalId) as ConditionSignalOperand;
      expression.addOperand(operand);
    });

    return expression;
  }

  private addTermToFunction(
    term: Expression | Operand,
    functionIndex: number,
    functionsMap: Map<number, Expression>
  ): void {
    if (!functionsMap.has(functionIndex)) {
      functionsMap.set(functionIndex, new DisjunctiveExpression([]));
    }

    const excitationFunction = functionsMap.get(functionIndex) as Expression;

    excitationFunction.addOperand(term);
  }

  public abstract getOutputBooleanFunctions(): TFunctionMap;

}
