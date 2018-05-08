export class UnitaryDAlgorithm implements App.ICodingAlgorithm {

  public getVertexCodeMap(tableData: App.ITableRow[], numOfStates: number): App.TVertexData {
    const vertexCodeMap: App.TVertexData = new Map();

    for (let i: number = 0; i < numOfStates; i++) {
      vertexCodeMap.set(i + 1, 1 << i);
    }

    return vertexCodeMap;
  }

  public getCapacity(numOfStates: number): number {
    return numOfStates;
  }
}
