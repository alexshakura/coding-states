import { ITableCoder, ITableRow } from '@app/types';

export class DTriggerTableCoder implements ITableCoder {

  public code(tableData: ITableRow[], vertexCodeMap: Map<number, number>): ITableRow[] {
    return tableData.map((tableRow) => {
      const srcStateCode = vertexCodeMap.get(tableRow.srcStateId as number) as number;
      const distStateCode = vertexCodeMap.get(tableRow.distStateId as number) as number;

      return {
        ...tableRow,
        srcStateCode,
        distStateCode,
        triggerExcitationSignals: distStateCode,
      };
    });
  }

}
