import { ICodingAlgorithm, ITableRow, TVertexData } from '@app/types';

export class NStateAlgorithm implements ICodingAlgorithm {

  public getVertexCodeMap(_tableData: ITableRow[], numOfStates: number): TVertexData {
    const vertexCodesMap: TVertexData = new Map();

    for (let i: number = 0; i < numOfStates; i++) {
      vertexCodesMap.set(i + 1, i);
    }

    return vertexCodesMap;
  }
}
