import { SignalOperand } from './signal-operand';

export class OutputSignalOperand extends SignalOperand {

  public readonly symbol: string = 'y';

  public static create(index: number, inverted: boolean): OutputSignalOperand {
    const id = inverted
      ? index + 2
      : index + 1;

    return new OutputSignalOperand(
      id,
      index,
      inverted
    );
  }

  public invert(): OutputSignalOperand {
    return OutputSignalOperand.create(
      this.index,
      !this.inverted
    );
  }

}
