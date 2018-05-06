import { StateOperand } from "../forms/state-operand";
import { ConjunctiveExpression } from "../forms/conjunctive-expression";
import { ConditionSignalOperand } from "../forms/condition-signal-operand";
import { DisjunctiveExpression } from "../forms/disjunctive-expression";

export abstract class BaseFsmCoder {

  public getTransitionBooleanFunctions(tableData: App.TableRow[], vertexCodesMap: App.TVertexData, capacity: number): App.TFunctionMap {
    const transitionCheckList: number[] = [];

    for (let i: number = 0; i < capacity; i++) {
      transitionCheckList.push(1 << i);
    }

    const transitionBooleanFunctions: Map<number, App.Expression> = new Map();

    tableData.forEach((tableRow: App.TableRow) => {
      const fCode: number = vertexCodesMap.get(tableRow.distState);

      const stateOperand = new StateOperand(tableRow.srcState, false);
      let conditionalExpression;

      if (!tableRow.unconditionalX) {
        conditionalExpression = new ConjunctiveExpression([stateOperand]);

        tableRow.x.forEach((conditionalSignal) => {
          conditionalExpression.addOperand(new ConditionSignalOperand(conditionalSignal.id, conditionalSignal.inverted));
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

  public abstract getOutputBooleanFunctions(tableData: App.TableRow[]): App.TFunctionMap;

}
