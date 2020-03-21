import { IVertexCodingAlgorithm, TVertexData } from '@app/types';
import { BaseDAlgorithm } from './base-d-algorithm';

export class UnitaryDAlgorithm extends BaseDAlgorithm implements IVertexCodingAlgorithm {

  public getCodesMap(): TVertexData {
    const vertexCodeMap: TVertexData = new Map();

    for (let i: number = 0; i < this.orderedStates.length; i++) {
      const state = this.orderedStates[i];

      vertexCodeMap.set(state.id, 1 << i);
    }

    return vertexCodeMap;
  }
}
