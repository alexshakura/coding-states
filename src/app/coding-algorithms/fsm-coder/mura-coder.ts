import { BaseFsmCoder } from './base-fsm-coder';
import { DisjunctiveExpression } from '../../shared/expression/disjunctive-expression';
import { ITableRow } from '../../../types/table-row';
import { TFunctionMap } from '../../../types/helper-types';
import { Expression } from '../../shared/expression/expression';
import { SignalOperand } from '../../shared/expression/signal-operand';


export class MuraCoder extends BaseFsmCoder {

  public getOutputBooleanFunctions(tableData: ITableRow[]): TFunctionMap {
    const outputBooleanFunctions: TFunctionMap = new Map();

    tableData
      .filter((tableRow: ITableRow) => tableRow.y.size > 0)
      .forEach((tableRow: ITableRow) => {
        const stateOperand: SignalOperand = tableRow.distState;

        tableRow.y.forEach((y: number) => {
          if (!outputBooleanFunctions.has(y)) {
            outputBooleanFunctions.set(y, new DisjunctiveExpression([]));
          }

          const outputBooleanFunction: Expression = outputBooleanFunctions.get(y);

          if (!outputBooleanFunction.hasOperand(stateOperand)) {
            outputBooleanFunction.addOperand(stateOperand);
          }
        });
      });

    return outputBooleanFunctions;
  }
}
