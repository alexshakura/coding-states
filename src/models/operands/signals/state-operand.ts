import { SignalOperand } from './signal-operand';

export class StateOperand extends SignalOperand {

  public readonly symbol: string = 'a';

  public static create(index: number, inverted: boolean): StateOperand {
    const id = inverted
      ? index + 2
      : index + 1;

    return new StateOperand(
      id,
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
