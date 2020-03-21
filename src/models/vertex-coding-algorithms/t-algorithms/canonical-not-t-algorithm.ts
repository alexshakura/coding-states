import { BaseCanonicalAlgorithm } from './base-canonical-algorithm';
import { IVertexCodingAlgorithm } from '@app/types';
import { getNumberOfOnes, getReversedNumber } from '../../helpers';

export class CanonicalNotTAlgorithm extends BaseCanonicalAlgorithm implements IVertexCodingAlgorithm {

  protected getCodeCandidates(
    relativeCode: number,
    existingCodes: number[]
  ): number[] {
    const candidates = [];

    for (let codeDistance = this.bitDepth; codeDistance >= 1; codeDistance--) {
      candidates.push(...this.getCodeCandidatesForDistance(codeDistance, relativeCode, existingCodes));

      if (candidates.length) {
        break;
      }
    }

    return candidates;
  }

  protected getSinglePairCodeEstimation(srcStateCode: number, distStateCode: number, weight: number): number {
    return getNumberOfOnes(getReversedNumber(srcStateCode ^ distStateCode, this.bitDepth)) * weight;
  }

}
