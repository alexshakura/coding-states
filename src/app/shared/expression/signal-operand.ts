import { Operand } from "./operand";

export abstract class SignalOperand extends Operand implements App.SignalOperand {
  public constructor(public id: number, public inverted: boolean) {
    super();
  }

  public equalTo(operand: App.Operand): boolean {
    return operand instanceof SignalOperand
      && operand.id === this.id
      && operand.inverted === this.inverted;
  }
}
