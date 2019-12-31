import { DisjunctiveExpression, Expression } from '../expressions';
import { ITableRow, TFunctionMap } from '@app/types';
import { StateOperand } from '../operands';
import { Fsm } from './fsm';

export class MuraFsm extends Fsm {

  public getOutputBooleanFunctions(): TFunctionMap {
    const map: TFunctionMap = new Map();

    this.tableData
      .filter((tableRow) => tableRow.outputSignalsIds.size > 0)
      .forEach((tableRow) => {
        const stateOperand = this.getDistState(tableRow);

        tableRow.outputSignalsIds.forEach((outputSignalId) =>
          this.setTermForOutputFunction(map, outputSignalId, stateOperand)
        );
      });

    return map;
  }

  private getDistState(tableRow: ITableRow): StateOperand {
    return this.statesMap.get(tableRow.distStateId as number) as StateOperand;
  }

  private setTermForOutputFunction(
    map: TFunctionMap,
    outputSignalId: number,
    stateOperand: StateOperand
  ): void {
    if (!map.has(outputSignalId)) {
      map.set(outputSignalId, new DisjunctiveExpression([]));
    }

    const outputBooleanFunction = map.get(outputSignalId) as Expression;

    outputBooleanFunction.addOperand(stateOperand);
  }
}
