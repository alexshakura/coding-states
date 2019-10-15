import { ITableRow } from './table-row';
import { TVertexData } from './vertex-data';

export interface ICodingAlgorithm {
  getVertexCodeMap(tableData: ITableRow[], numOfStates: number): TVertexData;
}
