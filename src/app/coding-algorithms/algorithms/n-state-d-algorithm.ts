export class NStateAlgorithm implements App.ICodingAlgorithm {

  public getVertexCodeMap(tableData: App.ITableRow[], numOfStates: number): App.TVertexData {
    const vertexCodesMap: App.TVertexData = new Map();

    for (let i: number = 0; i < numOfStates; i++) {
      vertexCodesMap.set(i + 1, i);
    }

    return vertexCodesMap;
  }

  public getCapacity(numOfStates: number): number {
    return Math.ceil(Math.log2(numOfStates));
  }
}
