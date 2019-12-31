import { TVertexData } from '@app/types';
import { VertexCodingAlgorithm } from './vertex-coding-algorithm';

export class UnitaryDAlgorithm extends VertexCodingAlgorithm {

  public getCodesMap(): TVertexData {
    const vertexCodeMap: TVertexData = new Map();

    for (let i: number = 0; i < this.orderedStates.length; i++) {
      const state = this.orderedStates[i];

      vertexCodeMap.set(state.id, 1 << i);
    }

    return vertexCodeMap;
  }
}
