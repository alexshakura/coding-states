import { BaseFsmCoder } from "./base-fsm-coder";
import { StateOperand } from "../forms/state-operand";
import { DisjunctiveExpression } from "../forms/disjunctive-expression";

export class MuraCoder extends BaseFsmCoder {

  public getOutputBooleanFunctions(tableData: App.TableRow[]): App.TFunctionMap {
    const outputBooleanFunctions: App.TFunctionMap = new Map();

    tableData
      .filter((tableRow: App.TableRow) => tableRow.y.size > 0)
      .forEach((tableRow: App.TableRow) => {
        const stateOperand: StateOperand = new StateOperand(tableRow.distState, false);

        tableRow.y.forEach((y: number) => {
          if (!outputBooleanFunctions.has(y)) {
            outputBooleanFunctions.set(y, new DisjunctiveExpression([]));
          }

          const outputBooleanFunction: App.Expression = outputBooleanFunctions.get(y);

          if (!outputBooleanFunction.hasOperand(stateOperand)) {
            outputBooleanFunction.addOperand(stateOperand);
          }
        });
      });

    return outputBooleanFunctions;
  }
}
