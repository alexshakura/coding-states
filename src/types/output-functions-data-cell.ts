import { Equation, OutputSignalOperand } from '@app/models';

export interface IOutputFunctionsDataCell {
  outputSignal: OutputSignalOperand;
  function: Equation<any>;
}
