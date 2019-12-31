import { Fsm } from './fsm';
import { ConjunctiveExpression, DisjunctiveExpression, Expression } from '../expressions';
import { ITableRow, TFunctionMap } from '@app/types';
import { ConditionSignalOperand, Operand, StateOperand } from '../operands';

export class MiliFsm extends Fsm {

  public getOutputBooleanFunctions(): TFunctionMap {
    const map: TFunctionMap = new Map();

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

  private getOutputSignalTerm(tableRow: ITableRow): Expression | Operand {
    const stateOperand = this.getSourceStateOperand(tableRow);

    // check case
    if (tableRow.unconditionalTransition) {
      return stateOperand;
    }

    const term: Expression = new ConjunctiveExpression([stateOperand]);

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
    map: TFunctionMap,
    outputSignalId: number,
    term: Expression | Operand
  ): void {
    if (!map.has(outputSignalId)) {
      map.set(outputSignalId, new DisjunctiveExpression([]));
    }

    const outputBooleanFunction = map.get(outputSignalId) as Expression;

    outputBooleanFunction.addOperand(term);
  }
}
