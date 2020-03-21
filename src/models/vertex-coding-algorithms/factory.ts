import { CodingAlgorithmType, TriggerType } from '@app/enums';
import { ITableRow, IVertexCodingAlgorithm } from '@app/types';
import { FrequencyDAlgorithm } from './d-algorithms/frequency-d-algorithm';
import { NStateAlgorithm } from './d-algorithms/n-state-d-algorithm';
import { UnitaryDAlgorithm } from './d-algorithms/unitary-d-algorithm';
import { StateOperand } from '../operands';
import { CanonicalTAlgorithm } from './t-algorithms/canonical-t-algorithm';
import { CanonicalNotTAlgorithm } from './t-algorithms/canonical-not-t-algorithm';

export class VertexCodingAlgorithmsFactory {

  public static getDTriggerAlgorithm(
    selectedAlgorithm: CodingAlgorithmType,
    tableData: ITableRow[],
    statesMap: Map<number, StateOperand>
  ): IVertexCodingAlgorithm {
    if (selectedAlgorithm === CodingAlgorithmType.CANONICAL) {
      throw new Error('D trigger can\'t have canonical algorithm');
    }

    const algorithmsMap = {
      [CodingAlgorithmType.UNITARY]: UnitaryDAlgorithm,
      [CodingAlgorithmType.FREQUENCY]: FrequencyDAlgorithm,
      [CodingAlgorithmType.STATE_N]: NStateAlgorithm,
    };

    const algorithm = algorithmsMap[selectedAlgorithm];

    return new algorithm(tableData, statesMap);
  }

  public static getCanonicalAlgorithm(
    triggerType: TriggerType,
    tableData: ITableRow[],
    statesMap: Map<number, StateOperand>,
    userDefinedCodes: Map<number, number>
  ): IVertexCodingAlgorithm {
    if (triggerType === TriggerType.D) {
      throw new Error('Canonical algorithm can\'t be used with D trigger');
    }

    const algorithmsMap = {
      [TriggerType.T]: CanonicalTAlgorithm,
      [TriggerType.NOT_T]: CanonicalNotTAlgorithm,
    };

    const algorithm = algorithmsMap[triggerType];

    return new algorithm(tableData, statesMap, userDefinedCodes);
  }

}
