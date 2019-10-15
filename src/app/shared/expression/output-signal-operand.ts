import { SignalOperand } from './signal-operand';

export class OutputSignalOperand extends SignalOperand {
  public sign: string = 'y';

  public copy(): SignalOperand {
    return new OutputSignalOperand(this.id, this.inverted);
  }
}
