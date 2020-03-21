import { getNumberOfOnes } from '../../helpers';
import { IVertexCodingAlgorithm } from '@app/types';
import { BaseCanonicalAlgorithm } from './base-canonical-algorithm';

export class CanonicalTAlgorithm extends BaseCanonicalAlgorithm implements IVertexCodingAlgorithm {

  protected getCodeCandidates(
    relativeCode: number,
    existingCodes: number[]
  ): number[] {
    const candidates = [];

    for (let codeDistance = 1; codeDistance <= this.bitDepth; codeDistance++) {
      candidates.push(...this.getCodeCandidatesForDistance(codeDistance, relativeCode, existingCodes));

      if (candidates.length) {
        break;
      }
    }

    return candidates;
  }

  protected getSinglePairCodeEstimation(srcStateCode: number, distStateCode: number, weight: number): number {
    return getNumberOfOnes(srcStateCode ^ distStateCode) * weight;
  }

}
