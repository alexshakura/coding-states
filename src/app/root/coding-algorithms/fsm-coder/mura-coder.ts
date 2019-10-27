import { BaseFsmCoder } from './base-fsm-coder';
import { DisjunctiveExpression } from '@app/shared/expression/disjunctive-expression';
import { ITableRow, TFunctionMap } from '@app/types';
import { Expression } from '@app/shared/expression/expression';
import { SignalOperand } from '@app/shared/expression/signal-operand';

export class MuraCoder extends BaseFsmCoder {

  public getOutputBooleanFunctions(tableData: ITableRow[]): TFunctionMap {
    const outputBooleanFunctions: TFunctionMap = new Map();

    tableData
      .filter((tableRow: ITableRow) => tableRow.y.size > 0)
      .forEach((tableRow: ITableRow) => {
        const stateOperand = tableRow.distState as SignalOperand;

        tableRow.y.forEach((y: number) => {
          if (!outputBooleanFunctions.has(y)) {
            outputBooleanFunctions.set(y, new DisjunctiveExpression([]));
          }

          const outputBooleanFunction = outputBooleanFunctions.get(y) as Expression;

          if (!outputBooleanFunction.hasOperand(stateOperand)) {
            outputBooleanFunction.addOperand(stateOperand);
          }
        });
      });

    return outputBooleanFunctions;
  }
}
