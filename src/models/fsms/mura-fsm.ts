import { ITableRow } from '@app/types';
import { StateOperand } from '../operands';
import { Fsm } from './fsm';
import { ConjunctionExpression, DnfEquation } from '../equations';

export class MuraFsm extends Fsm {

  public getOutputBooleanFunctions(): Map<number, DnfEquation> {
    const map: Map<number, DnfEquation> = new Map();

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
    map: Map<number, DnfEquation>,
    outputSignalId: number,
    stateOperand: StateOperand
  ): void {
    if (!map.has(outputSignalId)) {
      map.set(outputSignalId, new DnfEquation());
    }

    const outputBooleanFunction = map.get(outputSignalId) as DnfEquation;
    const expression = new ConjunctionExpression(stateOperand);

    outputBooleanFunction.addTerm(expression);
  }
}
