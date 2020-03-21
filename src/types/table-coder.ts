import { ITableRow } from './table-row';

export interface ITableCoder {
  code(tableData: ITableRow[], vertexCodeMap: Map<number, number>): ITableRow[];
}
