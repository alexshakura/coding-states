import { ConditionSignalOperand } from '@app/models';

export interface IFormattedTableRow {
  id: number;
  srcStateIndex: number;
  srcStateCode: string;
  distStateIndex: number;
  distStateCode: string;
  conditionalSignals: ConditionSignalOperand[];
  unconditionalTransition: boolean;
  outputSignalsIndexes: number[];
  triggerExcitationSignals: string;
}
