import { Fsm } from './fsm';
import { ITableRow } from '@app/types';
import { ConditionSignalOperand, StateOperand } from '../operands';
import { ConjunctionExpression, DnfEquation } from '../equations';

export class MiliFsm extends Fsm {

  public getOutputBooleanFunctions(): Map<number, DnfEquation> {
    const map = new Map();

    this.tableData
      .filter((tableRow) => tableRow.outputSignalsIds.size > 0)
      .forEach((tableRow) => {
        const term = this.getOutputSignalTerm(tableRow);

        tableRow.outputSignalsIds.forEach((outputSignalId) =>
          this.setTermForOutputFunction(map, outputSignalId, term)
        );
      });

    return map;
  }

  private getOutputSignalTerm(tableRow: ITableRow): ConjunctionExpression {
    const stateOperand = this.getSourceStateOperand(tableRow);

    if (tableRow.unconditionalTransition) {
      return new ConjunctionExpression(stateOperand);
    }

    const term = new ConjunctionExpression(stateOperand);

    tableRow.conditionalSignalsIds.forEach((conditionalSignalId) => {
      const conditionalSignal = this.conditionalSignalsMap.get(conditionalSignalId) as ConditionSignalOperand;
      term!.addOperand(conditionalSignal);
    });

    return term;
  }

  private getSourceStateOperand(tableRow: ITableRow): StateOperand {
    return this.statesMap.get(tableRow.srcStateId as number) as StateOperand;
  }

  private setTermForOutputFunction(
    map: Map<number, DnfEquation>,
    outputSignalId: number,
    term: ConjunctionExpression
  ): void {
    if (!map.has(outputSignalId)) {
      map.set(outputSignalId, new DnfEquation());
    }

    const outputBooleanFunction = map.get(outputSignalId) as DnfEquation;

    outputBooleanFunction.addTerm(term);
  }
}
