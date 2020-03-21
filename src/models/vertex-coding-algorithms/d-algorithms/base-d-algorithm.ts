import { ITableRow } from '@app/types';
import { StateOperand } from '../../operands';

export abstract class BaseDAlgorithm {

  protected orderedStates: StateOperand[];

  public constructor(
    protected readonly tableData: ITableRow[],
    statesMap: Map<number, StateOperand>
  ) {
    this.orderedStates = this.getOrderedStates(statesMap);
  }

  private getOrderedStates(statesMap: Map<number, StateOperand>): StateOperand[] {
    return Array.from(statesMap.values())
      .sort((leftState, rightState) => {
        if (leftState.index > rightState.index) {
          return 1;
        }

        if (rightState.index > leftState.index) {
          return -1;
        }

        return 0;
      });
  }

}
