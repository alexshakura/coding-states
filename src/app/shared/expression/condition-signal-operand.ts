import { SignalOperand } from './signal-operand';

export class ConditionSignalOperand extends SignalOperand {
  public sign: string = 'x';

  public copy(): SignalOperand {
    return new ConditionSignalOperand(this.id, this.inverted);
  }
}
