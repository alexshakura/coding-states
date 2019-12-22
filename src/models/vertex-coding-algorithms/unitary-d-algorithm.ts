import { ICodingAlgorithm, ITableRow, TVertexData } from '@app/types';

export class UnitaryDAlgorithm implements ICodingAlgorithm {

  public getVertexCodeMap(_tableData: ITableRow[], numOfStates: number): TVertexData {
    const vertexCodeMap: TVertexData = new Map();

    for (let i: number = 0; i < numOfStates; i++) {
      vertexCodeMap.set(i, 1 << i);
    }

    return vertexCodeMap;
  }
}
