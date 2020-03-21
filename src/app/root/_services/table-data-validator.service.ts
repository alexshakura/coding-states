import { Injectable } from '@angular/core';
import { ValidationError } from '@app/shared/_helpers/validation-error';
import { ITableConfig, ITableRow } from '@app/types';

@Injectable()
export class TableDataValidatorService {

  public validate(tableData: ITableRow[], tableConfig: Readonly<ITableConfig>): void {
    const invalidRowsIds = this.getInvalidTableRowsIds(tableData);
    const NUM_INVALID_ENTITIES_TO_SHOW = 3;

    if (invalidRowsIds.length > 1) {
      throw new ValidationError(
        'ERROR_INVALID_ROWS',
        { ids: invalidRowsIds.slice(0, NUM_INVALID_ENTITIES_TO_SHOW).join(', ') }
      );
    }

    if (invalidRowsIds.length === 1) {
      throw new ValidationError(
        'ERROR_INVALID_ROW',
        { id: invalidRowsIds[0].toString() }
      );
    }

    if (!this.isAllStatesUsed(tableData, tableConfig.numberOfStates)) {
      throw new ValidationError('ERROR_INVALID_USED_STATES_COUNT');
    }
  }

  private isAllStatesUsed(tableData: ITableRow[], numberOfStates: number): boolean {
    const selectedSrcStateIds = tableData.map((tableRow) => tableRow.srcStateId);
    const selectedDistStateIds = tableData.map((tableRow) => tableRow.distStateId);

    const uniqueSelectedSrcStateIds = new Set(selectedSrcStateIds);
    const uniqueSelectedDistStateIds = new Set(selectedDistStateIds);

    return uniqueSelectedSrcStateIds.size === numberOfStates && uniqueSelectedDistStateIds.size === numberOfStates;
  }

  private getInvalidTableRowsIds(tableData: ITableRow[]): number[] {
    return tableData
      .filter((tableRow: ITableRow) => {
        return !tableRow.distStateId
          || !tableRow.srcStateId
          || (!tableRow.unconditionalTransition && !tableRow.conditionalSignalsIds.size);
      })
      .map((tableRow: ITableRow) => tableRow.id);
  }

}
