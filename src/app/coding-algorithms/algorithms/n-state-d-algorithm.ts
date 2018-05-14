import { ICodingAlgorithm } from "../../../types/coding-algorithm";
import { ITableRow } from "../../../types/table-row";
import { TVertexData } from "../../../types/helper-types";

export class NStateAlgorithm implements ICodingAlgorithm {

  public getVertexCodeMap(tableData: ITableRow[], numOfStates: number): TVertexData {
    const vertexCodesMap: TVertexData = new Map();

    for (let i: number = 0; i < numOfStates; i++) {
      vertexCodesMap.set(i + 1, i);
    }

    return vertexCodesMap;
  }

  public getCapacity(numOfStates: number): number {
    return Math.ceil(Math.log2(numOfStates));
  }
}
