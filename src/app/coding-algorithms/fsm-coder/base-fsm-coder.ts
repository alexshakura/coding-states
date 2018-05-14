import { ConjunctiveExpression } from '../../shared/expression/conjunctive-expression';
import { DisjunctiveExpression } from '../../shared/expression/disjunctive-expression';
import { ITableRow } from '../../../types/table-row';
import { TVertexData, TFunctionMap } from '../../../types/helper-types';
import { Expression } from '../../shared/expression/expression';
import { SignalOperand } from '../../shared/expression/signal-operand';


export abstract class BaseFsmCoder {

  public getTransitionBooleanFunctions(tableData: ITableRow[], vertexCodesMap: TVertexData, capacity: number): TFunctionMap {
    const transitionCheckList: number[] = [];

    for (let i: number = 0; i < capacity; i++) {
      transitionCheckList.push(1 << i);
    }

    const transitionBooleanFunctions: Map<number, Expression> = new Map();

    tableData.forEach((tableRow: ITableRow) => {
      const fCode: number = vertexCodesMap.get(tableRow.distState.id);

      const stateOperand: SignalOperand = tableRow.srcState;
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

          const transitionBooleanFunction: Expression = transitionBooleanFunctions.get(functionIndex);

          if (conditionalExpression) {
            transitionBooleanFunction.addOperand(conditionalExpression);
          } else if (!transitionBooleanFunction.hasOperand(stateOperand)) {
            transitionBooleanFunction.addOperand(stateOperand);
          }
        });
    });

    return transitionBooleanFunctions;
  }

  public abstract getOutputBooleanFunctions(tableData: ITableRow[]): TFunctionMap;

}
