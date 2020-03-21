import { ITableCoder, ITableRow } from '@app/types';
import { getReversedNumber } from '../helpers/get-reversed-number';
import { getTotalBitDepth } from '../helpers/get-total-bit-depth';

export class NotTTriggerTableCoder implements ITableCoder {

  public code(tableData: ITableRow[], vertexCodeMap: Map<number, number>): ITableRow[] {
    return tableData.map((tableRow) => {
      const distStateCode = vertexCodeMap.get(tableRow.distStateId as number) as number;
      const srcStateCode = vertexCodeMap.get(tableRow.srcStateId as number) as number;

      return {
        ...tableRow,
        srcStateCode,
        distStateCode,
        triggerExcitationSignals: getReversedNumber(srcStateCode ^ distStateCode, getTotalBitDepth(vertexCodeMap.size)),
      };
    });
  }

}
