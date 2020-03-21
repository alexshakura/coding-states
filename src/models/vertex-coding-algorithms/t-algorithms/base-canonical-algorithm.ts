import { ICandidatesData, ITransitionMatrixItem } from './_types';
import { getNumberOfOnes, getTotalBitDepth } from '../../helpers';
import { StateOperand } from '../../operands';
import { ITableRow, TVertexData } from '@app/types';

export abstract class BaseCanonicalAlgorithm {

  protected bitDepth: number = getTotalBitDepth(this.states.size);

  public constructor(
    protected readonly tableData: ITableRow[],
    protected readonly states: Map<number, StateOperand>,
    protected readonly userDefinedCodes: Map<number, number>
  ) { }

  public getCodesMap(): TVertexData {
    const codes = new Map(this.userDefinedCodes.entries());

    let transitionMatrix: ITransitionMatrixItem[] = this.getTransitionMatrix();

    transitionMatrix = this.getNonRedundantMatrix(codes, transitionMatrix);
    transitionMatrix = this.getSortedMatrix(transitionMatrix);

    while (transitionMatrix.length > 0) {
      const stateForDefine = this.getStateForDefine(transitionMatrix, codes);

      const rowsToAnalyze = transitionMatrix.filter(({ srcState, distState }) => {
        return (srcState.equalTo(stateForDefine) && codes.has(distState.id))
          || (distState.equalTo(stateForDefine) && codes.has(srcState.id));
      });

      const candidatesData = this.getCandidatesData(
        rowsToAnalyze,
        codes,
        stateForDefine
      );

      codes.set(stateForDefine.id, this.getStateCode(candidatesData));

      transitionMatrix = this.getNonRedundantMatrix(codes, transitionMatrix);
    }

    return codes;
  }

  private getTransitionMatrix(): ITransitionMatrixItem[] {
    const matrix: ITransitionMatrixItem[] = [];

    this.tableData
      .map((tableRow) => {
        const srcStateId = tableRow.srcStateId as number;
        const distStateId = tableRow.distStateId as number;

        return {
          srcState: this.states.get(srcStateId) as StateOperand,
          distState: this.states.get(distStateId) as StateOperand,
        };
      })
      .forEach(({ srcState, distState }) => {
        const existingTransitionIndex = matrix.findIndex((transitionItem) => {
          return (transitionItem.srcState.equalTo(srcState) && transitionItem.distState.equalTo(distState))
            || (transitionItem.srcState.equalTo(distState) && transitionItem.distState.equalTo(srcState));
        });

        if (existingTransitionIndex !== -1) {
          matrix[existingTransitionIndex].weight++;
          return;
        }

        matrix.push({ srcState, distState, weight: 1 });
      });

    return matrix;
  }

  private getNonRedundantMatrix(
    definedCodes: Map<number, number>,
    matrix: ITransitionMatrixItem[]
  ): ITransitionMatrixItem[] {
    return matrix.filter(({ srcState, distState }) => {
      return !(definedCodes.get(srcState.id) !== undefined && definedCodes.get(distState.id) !== undefined);
    });
  }

  private getSortedMatrix(matrix: ITransitionMatrixItem[]): ITransitionMatrixItem[] {
    const srcMatrix = [...matrix];
    const sortedMatrix: ITransitionMatrixItem[] = [];

    const definedCodes = new Map(this.userDefinedCodes.entries());

    for (const _transitionItem of matrix) {
      const pairForDefinePosition = srcMatrix.findIndex((item) => {
        const srcStateId = item.srcState.id;
        const distStateId = item.distState.id;

        const srcStateCode = definedCodes.get(srcStateId);
        const distStateCode = definedCodes.get(distStateId);

        return (srcStateCode === undefined && distStateCode !== undefined)
          || (distStateCode === undefined && srcStateCode !== undefined);
      });

      if (pairForDefinePosition === -1) {
        sortedMatrix.push(...srcMatrix);
        break;
      }

      const { srcState, distState } = srcMatrix[pairForDefinePosition];

      const codedStateId = definedCodes.has(srcState.id)
        ? distState.id
        : srcState.id;

      definedCodes.set(codedStateId, 0);

      sortedMatrix.push(...srcMatrix.splice(pairForDefinePosition, 1));
    }

    return sortedMatrix;
  }

  private getStateForDefine(
    transitionMatrix: ITransitionMatrixItem[],
    definedCodes: Map<number, number>
  ): StateOperand {
    const { srcState, distState } = transitionMatrix[0];

    return definedCodes.has(srcState.id)
      ? distState
      : srcState;
  }

  private getStateCode(candidatesData: ICandidatesData[]): number {
    let code: number = candidatesData[0].code;
    let minEstimation: number = candidatesData[0].estimation;

    candidatesData.forEach((data) => {
      if (data.estimation < minEstimation) {
        code = data.code;
        minEstimation = data.estimation;
      }
    });

    return code;
  }

  private getCandidatesData(
    rowsToAnalyze: ITransitionMatrixItem[],
    codes: Map<number, number>,
    stateForDefine: StateOperand
  ): ICandidatesData[] {
    return rowsToAnalyze
      .map((row) => {
        const definedState = row.srcState.equalTo(stateForDefine)
          ? row.distState
          : row.srcState;

        const relativeCode = codes.get(definedState.id) as number;

        return this.getCodeCandidates(relativeCode, Array.from(codes.values()));
      })
      .flat()
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
      .map((codeCandidate) => {
        return {
          code: codeCandidate,
          estimation: this.getCodeEstimation(rowsToAnalyze, codes, codeCandidate),
        };
      });
  }

  protected getCodeCandidatesForDistance(
    codeDistance: number,
    relativeCode: number,
    existingCodes: number[]
  ): number[] {
    const numberOfPossibleCodes = 2 ** this.bitDepth;
    const candidates = [];

    for (let code = numberOfPossibleCodes - 1; code >= 0; code--) {
      if (this.getCodeDistance(relativeCode, code) === codeDistance && !existingCodes.includes(code)) {
        candidates.push(code);
      }
    }

    return candidates;
  }

  private getCodeEstimation(
    pairs: ITransitionMatrixItem[],
    definedCodes: Map<number, number>,
    suggestedCode: number
  ): number {
    let estimation: number = 0;

    pairs
      .map((pair) => {
        const srcStateCode = definedCodes.has(pair.srcState.id)
          ? definedCodes.get(pair.srcState.id)
          : suggestedCode;

        const distStateCode = definedCodes.has(pair.distState.id)
          ? definedCodes.get(pair.distState.id)
          : suggestedCode;

        return {
          srcStateCode: srcStateCode as number,
          distStateCode: distStateCode as number,
          weight: pair.weight,
        };
      })
      .forEach(({ srcStateCode, distStateCode, weight }) => {
        estimation += this.getSinglePairCodeEstimation(srcStateCode, distStateCode, weight);
      });

    return estimation;
  }

  private getCodeDistance(relativeCode: number, candidateCode: number): number {
    return getNumberOfOnes(relativeCode ^ candidateCode);
  }

  protected abstract getSinglePairCodeEstimation(srcStateCode: number, distStateCode: number, weight: number): number;

  protected abstract getCodeCandidates(relativeCode: number, existingCodes: number[]): number[];

}
