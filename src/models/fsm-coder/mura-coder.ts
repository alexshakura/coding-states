import { BaseFsmCoder } from './base-fsm-coder';
import { DisjunctiveExpression, Expression } from '../expressions';
import { ITableRow, TFunctionMap } from '@app/types';
import { SignalOperand } from '../operands';

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
