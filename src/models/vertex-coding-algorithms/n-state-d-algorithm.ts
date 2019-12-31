import { TVertexData } from '@app/types';
import { VertexCodingAlgorithm } from './vertex-coding-algorithm';

export class NStateAlgorithm extends VertexCodingAlgorithm {

  public getCodesMap(): TVertexData {
    const vertexCodesMap: TVertexData = new Map();

    for (let i: number = 0; i < this.orderedStates.length; i++) {
      const state = this.orderedStates[i];

      vertexCodesMap.set(state.id, i);
    }

    return vertexCodesMap;
  }
}
