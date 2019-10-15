import { Operand } from './operand';

export abstract class SignalOperand extends Operand {
  public constructor(public id: number, public inverted: boolean) {
    super();
  }

  public equalTo(operand: Operand): boolean {
    return operand instanceof SignalOperand
      && operand.id === this.id
      && operand.inverted === this.inverted;
  }
}
