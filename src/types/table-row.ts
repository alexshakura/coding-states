export interface ITableRow {
  id: number;
  srcStateId: number | null;
  srcStateCode: number | null;
  distStateId: number | null;
  distStateCode: number | null;
  conditionalSignalsIds: Set<number>;
  unconditionalTransition: boolean;
  outputSignalsIds: Set<number>;
  triggerExcitationSignals: number | null;
}
