import { SignalOperand } from './signal-operand';

export class OutputSignalOperand extends SignalOperand {

  public readonly symbol: string = 'y';

  public static create(index: number): OutputSignalOperand {
    if (!index) {
      throw new Error('Y не может иметь индекс 0');
    }

    return new OutputSignalOperand(
      index,
      index,
      false
    );
  }

  public invert(): OutputSignalOperand {
    throw new Error('Нельзя инвертировать Y');
  }

}
