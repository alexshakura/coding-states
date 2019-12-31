import { Expression, OutputSignalOperand } from '@app/models';

export interface IOutputFunctionsDataCell {
  outputSignal: OutputSignalOperand;
  function: Expression;
}
