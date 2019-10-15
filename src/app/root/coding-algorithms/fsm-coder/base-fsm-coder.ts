import { ConjunctiveExpression } from '../../../shared/expression/conjunctive-expression';
import { DisjunctiveExpression } from '../../../shared/expression/disjunctive-expression';
import { ITableRow, TFunctionMap, TVertexData } from '@app/types';
import { Expression } from '../../../shared/expression/expression';
import { SignalOperand } from '../../../shared/expression/signal-operand';

export abstract class BaseFsmCoder {

  public getTransitionBooleanFunctions(tableData: ITableRow[], vertexCodesMap: TVertexData, capacity: number): TFunctionMap {
    const transitionCheckList: number[] = [];

    for (let i: number = 0; i < capacity; i++) {
      transitionCheckList.push(1 << i);
    }

    const transitionBooleanFunctions: Map<number, Expression> = new Map();

    tableData.forEach((tableRow: ITableRow) => {
      const distState = tableRow.distState as SignalOperand;
      const fCode = vertexCodesMap.get(distState.id) as number;

      const stateOperand: SignalOperand = tableRow.srcState as SignalOperand;
      let conditionalExpression: Expression;

      if (!tableRow.unconditionalX) {
        conditionalExpression = new ConjunctiveExpression([stateOperand]);

        tableRow.x.forEach((conditionalSignal: SignalOperand) => {
          conditionalExpression.addOperand(conditionalSignal);
        });
      }

      transitionCheckList
        .filter((val: number) => val & fCode)
        .forEach((val: number) => {
          const functionIndex: number = transitionCheckList.indexOf(val) + 1;

          if (!transitionBooleanFunctions.has(functionIndex)) {
            transitionBooleanFunctions.set(functionIndex, new DisjunctiveExpression([]));
          }

          const transitionBooleanFunction = transitionBooleanFunctions.get(functionIndex) as Expression;

          if (conditionalExpression) {
            transitionBooleanFunction.addOperand(conditionalExpression);
          } else if (!transitionBooleanFunction.hasOperand(stateOperand)) {
            transitionBooleanFunction.addOperand(stateOperand);
          }
        });
    });

    const sortedTransitionBooleanFunctions: [number, Expression][] = Array.from(transitionBooleanFunctions.entries())
      .sort((a: [number, Expression], b: [number, Expression]) => {
        if (a[0] > b[0]) {
          return 1;
        }

        if (a[0] < b[0]) {
          -1;
        }

        return 0;
      });

    return new Map(sortedTransitionBooleanFunctions);
  }

  public abstract getOutputBooleanFunctions(tableData: ITableRow[]): TFunctionMap;

}
