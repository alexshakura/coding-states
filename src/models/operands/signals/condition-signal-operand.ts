import { SignalOperand } from './signal-operand';

export class ConditionSignalOperand extends SignalOperand {

  public readonly symbol: string = 'x';

  public static create(index: number, inverted: boolean): ConditionSignalOperand {
    const id = inverted
      ? index + 2
      : index + 1;

    return new ConditionSignalOperand(
      id,
      index,
      inverted
    );
  }

  public invert(): ConditionSignalOperand {
    return ConditionSignalOperand.create(
      this.index,
      !this.inverted
    );
  }
}
