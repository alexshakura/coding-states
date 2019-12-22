import { Operand } from '../operand';

export abstract class SignalOperand extends Operand {

  protected constructor(
    public readonly id: number,
    public readonly index: number,
    public readonly inverted: boolean
  ) {
    super();
  }

  public equalTo(operand: Operand): boolean {
    return operand instanceof SignalOperand
      && operand.id === this.id
      && operand.symbol === this.symbol;
  }

  public abstract invert(): SignalOperand;
}
