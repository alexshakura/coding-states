import { SignalOperand } from './signal-operand';
import { getUniqueId } from './get-unique-id';

export class StateOperand extends SignalOperand {

  public readonly symbol: string = 'a';

  public static create(index: number, inverted: boolean): StateOperand {
    if (!index) {
      throw new Error('A не может иметь индекс 0');
    }

    return new StateOperand(
      getUniqueId(index, inverted),
      index,
      inverted
    );
  }

  public invert(): StateOperand {
    return StateOperand.create(
      this.index,
      !this.inverted
    );
  }
}
