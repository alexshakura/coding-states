import { SignalOperand } from "./signal-operand";

export class OutputSignalOperand extends SignalOperand {
  public sign: string = 'y';

  public copy(): App.ISignalOperand {
    return new OutputSignalOperand(this.id, this.inverted);
  }
}
