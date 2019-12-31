import { SignalOperand } from './signal-operand';
import { getUniqueId } from './get-unique-id';

export class ConditionSignalOperand extends SignalOperand {

  public readonly symbol: string = 'x';

  public static create(index: number, inverted: boolean): ConditionSignalOperand {
    if (!index) {
      throw new Error('X не может иметь индекс 0');
    }

    return new ConditionSignalOperand(
      getUniqueId(index, inverted),
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
