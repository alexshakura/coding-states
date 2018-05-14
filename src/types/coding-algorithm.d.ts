import { ITableRow } from "./table-row";
import { TVertexData } from "./helper-types";

declare interface ICodingAlgorithm {
  getVertexCodeMap(tableData: ITableRow[], numOfStates: number): TVertexData;
}
