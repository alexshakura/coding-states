import { ITableRow, TVertexData } from '@app/types';
import { VertexCodingAlgorithm } from './vertex-coding-algorithm';

export class FrequencyDAlgorithm extends VertexCodingAlgorithm {

  public getCodesMap(): TVertexData {
    const totalBitDepth = this.getTotalBitDepth();

    const codeCombinations = this.getCodeCombinations(totalBitDepth);
    const sortedVertexIds = this.getSortedVertexIds();

    const vertexesCodes: Array<[number, number]> = sortedVertexIds.map((vertexId, index) => {
      return [vertexId, codeCombinations[index]];
    });

    return new Map(vertexesCodes);
  }

  private getCodeCombinations(totalBitDepth: number): number[] {
    const map = this.getCodeCombinationsMap(totalBitDepth);

    return Array.from(map.entries())
      .sort(([leftNumOfUnits, _leftCodeCombinations], [rightNumOfUnits, _rightCodeCombinations]) => {
        if (leftNumOfUnits > rightNumOfUnits) {
          return 1;
        }

        if (rightNumOfUnits > leftNumOfUnits) {
          return -1;
        }

        return 0;
      })
      .map(([_numOfUnits, codeCombinations]) => codeCombinations)
      .reduce((acc, val) => acc.concat(val), []);
  }

  private getCodeCombinationsMap(totalBitDepth: number): Map<number, number[]> {
    const PAIR_COUNT_BASE = 2;

    const maxValue = (PAIR_COUNT_BASE ** totalBitDepth) - 1;
    const codeCombinationsMap: Map<number, number[]> = new Map();

    for (let i: number = 0; i <= maxValue; i++) {
      const numOfUnits: number = this.getNumberOfUnits(i);

      if (!codeCombinationsMap.has(numOfUnits)) {
        codeCombinationsMap.set(numOfUnits, []);
      }

      const value = codeCombinationsMap.get(numOfUnits) as number[];

      value.push(i);
    }

    return codeCombinationsMap;
  }

  private getNumberOfUnits(value: number): number {
    return value
      .toString(2)
      .split('')
      .map(Number)
      .filter(Boolean)
      .length;
  }

  private getSortedVertexIds(): number[] {
    const frequencyMap = this.getFrequencyMap(this.tableData);

    return Array.from(frequencyMap.entries())
      .sort(([leftStateId, leftFrequency], [rightStateId, rightFrequency]) => {
        if (leftFrequency < rightFrequency) {
          return 1;
        }

        if (leftFrequency > rightFrequency) {
          return -1;
        }

        return leftStateId > rightStateId
          ? 1
          : -1;
      })
      .map(([stateId, _frequency]) => stateId);
  }

  private getFrequencyMap(tableData: ITableRow[]): Map<number, number> {
    const map: Map<number, number> = new Map();

    tableData.forEach((row) => {
      const stateId = row.distStateId as number;

      if (!map.has(stateId)) {
        map.set(stateId, 0);
      }

      const frequency = map.get(stateId) as number;

      map.set(stateId, frequency + 1);
    });

    return map;
  }

  private getTotalBitDepth(): number {
    return Math.ceil(Math.log2(this.orderedStates.length));
  }
}
