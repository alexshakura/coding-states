import { ITableRow } from "./table-row";
import { TVertexData } from "./helper-types";

declare interface ICodingAlgorithm {
  getCapacity(numOfStates: number): number;
  getVertexCodeMap(tableData: ITableRow[], numOfStates: number): TVertexData;
}
