import { Operand } from './operand';

export abstract class ConstantOperand extends Operand implements App.ConstantOperand {
  public readonly abstract value: number;

  public equalTo(operand: App.Operand): boolean {
    return operand instanceof ConstantOperand
      && this.sign === operand.sign;
  }
}
