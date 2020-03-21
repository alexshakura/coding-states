import { IVertexCodingAlgorithm, TVertexData } from '@app/types';
import { BaseDAlgorithm } from './base-d-algorithm';

export class NStateAlgorithm extends BaseDAlgorithm implements IVertexCodingAlgorithm {

  public getCodesMap(): TVertexData {
    const vertexCodesMap: TVertexData = new Map();

    for (let i: number = 0; i < this.orderedStates.length; i++) {
      const state = this.orderedStates[i];

      vertexCodesMap.set(state.id, i);
    }

    return vertexCodesMap;
  }
}
