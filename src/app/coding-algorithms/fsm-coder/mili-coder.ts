import { BaseFsmCoder } from "./base-fsm-coder";
import { StateOperand } from "../../shared/expression/state-operand";
import { ConjunctiveExpression } from "../../shared/expression/conjunctive-expression";
import { ConditionSignalOperand } from "../../shared/expression/condition-signal-operand";
import { DisjunctiveExpression } from "../../shared/expression/disjunctive-expression";


export class MiliCoder extends BaseFsmCoder {

  public getOutputBooleanFunctions(tableData: App.TableRow[]): App.TFunctionMap {
    const outputBooleanFunctions: App.TFunctionMap = new Map();

    tableData
      .filter((tableRow: App.TableRow) => tableRow.y.size > 0)
      .forEach((tableRow: App.TableRow) => {
        const stateOperand: StateOperand = new StateOperand(tableRow.srcState, false);

        let conditionalExpression: App.Expression;

        if (!tableRow.unconditionalX) {
          conditionalExpression = new ConjunctiveExpression([stateOperand]);

          tableRow.x.forEach((conditionalSignal) => {
            conditionalExpression.addOperand(new ConditionSignalOperand(conditionalSignal.id, conditionalSignal.inverted));
          });
        }

        tableRow.y.forEach((y: number) => {
          if (!outputBooleanFunctions.has(y)) {
            outputBooleanFunctions.set(y, new DisjunctiveExpression([]));
          }

          const outputBooleanFunction: App.Expression = outputBooleanFunctions.get(y);

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
