import { ICodingAlgorithm } from "../../../types/coding-algorithm";
import { TVertexData } from "../../../types/helper-types";
import { ITableRow } from "../../../types/table-row";

export class UnitaryDAlgorithm implements ICodingAlgorithm {

  public getVertexCodeMap(tableData: ITableRow[], numOfStates: number): TVertexData {
    const vertexCodeMap: TVertexData = new Map();

    for (let i: number = 0; i < numOfStates; i++) {
      vertexCodeMap.set(i + 1, 1 << i);
    }

    return vertexCodeMap;
  }

  public getCapacity(numOfStates: number): number {
    return numOfStates;
  }
}
