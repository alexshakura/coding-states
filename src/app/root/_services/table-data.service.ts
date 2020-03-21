import { Injectable } from '@angular/core';
import { ITableConfig, ITableRow, TSensitiveTableConfigFields } from '@app/types';

@Injectable()
export class TableDataService {

  public generateEmptyRows(length: number, startId: number = 0): ITableRow[] {
    return new Array(length)
      .fill(1)
      .map((_, index) => {
        return {
          id: index + 1 + startId,
          srcStateId: null,
          srcStateCode: null,
          distStateId: null,
          distStateCode: null,
          conditionalSignalsIds: new Set(),
          unconditionalTransition: false,
          outputSignalsIds: new Set(),
          triggerExcitationSignals: null,
        };
      });
  }

  public rearrangeTableData(tableData: ITableRow[], newLength: number): ITableRow[] {
    return tableData.length > newLength
      ? tableData.slice(0, newLength)
      : [...tableData, ...this.generateEmptyRows(newLength - tableData.length, tableData.length)];
  }

  public shouldDeleteCurrentData(newConfig: ITableConfig, oldConfig: ITableConfig | null): boolean {
    return !!oldConfig
      && (
        this.isConfigSensitiveFieldViolated(oldConfig, newConfig, 'numberOfStates')
        || this.isConfigSensitiveFieldViolated(oldConfig, newConfig, 'numberOfX')
        || this.isConfigSensitiveFieldViolated(oldConfig, newConfig, 'numberOfY')
      );
  }

  public isConfigSensitiveFieldViolated(
    oldConfig: ITableConfig,
    newConfig: ITableConfig,
    field: TSensitiveTableConfigFields
  ): boolean {
    return oldConfig[field] > newConfig[field];
  }

}
