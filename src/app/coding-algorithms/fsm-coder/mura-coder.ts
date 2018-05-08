import { BaseFsmCoder } from './base-fsm-coder';
import { DisjunctiveExpression } from '../../shared/expression/disjunctive-expression';


export class MuraCoder extends BaseFsmCoder {

  public getOutputBooleanFunctions(tableData: App.ITableRow[]): App.TFunctionMap {
    const outputBooleanFunctions: App.TFunctionMap = new Map();

    tableData
      .filter((tableRow: App.ITableRow) => tableRow.y.size > 0)
      .forEach((tableRow: App.ITableRow) => {
        const stateOperand: App.ISignalOperand = tableRow.distState;

        tableRow.y.forEach((y: number) => {
          if (!outputBooleanFunctions.has(y)) {
            outputBooleanFunctions.set(y, new DisjunctiveExpression([]));
          }

          const outputBooleanFunction: App.IExpression = outputBooleanFunctions.get(y);

          if (!outputBooleanFunction.hasOperand(stateOperand)) {
            outputBooleanFunction.addOperand(stateOperand);
          }
        });
      });

    return outputBooleanFunctions;
  }
}
