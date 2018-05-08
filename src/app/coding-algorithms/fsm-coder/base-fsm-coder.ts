import { StateOperand } from "../../shared/expression/state-operand";
import { ConjunctiveExpression } from "../../shared/expression/conjunctive-expression";
import { DisjunctiveExpression } from "../../shared/expression/disjunctive-expression";


export abstract class BaseFsmCoder {

  public getTransitionBooleanFunctions(tableData: App.ITableRow[], vertexCodesMap: App.TVertexData, capacity: number): App.TFunctionMap {
    const transitionCheckList: number[] = [];

    for (let i: number = 0; i < capacity; i++) {
      transitionCheckList.push(1 << i);
    }

    const transitionBooleanFunctions: Map<number, App.IExpression> = new Map();

    tableData.forEach((tableRow: App.ITableRow) => {
      const fCode: number = vertexCodesMap.get(tableRow.distState.id);

      const stateOperand: App.ISignalOperand = tableRow.srcState;
      let conditionalExpression;

      if (!tableRow.unconditionalX) {
        conditionalExpression = new ConjunctiveExpression([stateOperand]);

        tableRow.x.forEach((conditionalSignal) => {
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

          const transitionBooleanFunction = transitionBooleanFunctions.get(functionIndex);

          if (conditionalExpression) {
            transitionBooleanFunction.addOperand(conditionalExpression);
          } else if (!transitionBooleanFunction.hasOperand(stateOperand)) {
            transitionBooleanFunction.addOperand(stateOperand);
          }
        });
    });

    return transitionBooleanFunctions;
  }

  public abstract getOutputBooleanFunctions(tableData: App.ITableRow[]): App.TFunctionMap;

}
