import { BaseFsmCoder } from "./base-fsm-coder";
import { StateOperand } from "../../shared/expression/state-operand";
import { ConjunctiveExpression } from "../../shared/expression/conjunctive-expression";
import { DisjunctiveExpression } from "../../shared/expression/disjunctive-expression";


export class MiliCoder extends BaseFsmCoder {

  public getOutputBooleanFunctions(tableData: App.ITableRow[]): App.TFunctionMap {
    const outputBooleanFunctions: App.TFunctionMap = new Map();

    tableData
      .filter((tableRow: App.ITableRow) => tableRow.y.size > 0)
      .forEach((tableRow: App.ITableRow) => {
        const stateOperand: App.ISignalOperand = tableRow.srcState;

        let conditionalExpression: App.IExpression;

        if (!tableRow.unconditionalX) {
          conditionalExpression = new ConjunctiveExpression([stateOperand]);

          tableRow.x.forEach((conditionalSignal) => {
            conditionalExpression.addOperand(conditionalSignal);
          });
        }

        tableRow.y.forEach((y: number) => {
          if (!outputBooleanFunctions.has(y)) {
            outputBooleanFunctions.set(y, new DisjunctiveExpression([]));
          }

          const outputBooleanFunction: App.IExpression = outputBooleanFunctions.get(y);

          if (conditionalExpression) {
            outputBooleanFunction.addOperand(conditionalExpression);
          } else if (!outputBooleanFunction.hasOperand(stateOperand)) {
            outputBooleanFunction.addOperand(stateOperand);
          }
        });
      });

    return outputBooleanFunctions;
  }
}
