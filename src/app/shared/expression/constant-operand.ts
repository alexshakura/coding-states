import { Operand } from './operand';

export abstract class ConstantOperand extends Operand implements App.IConstantOperand {
  public readonly abstract value: number;

  public equalTo(operand: App.IOperand): boolean {
    return operand instanceof ConstantOperand
      && this.sign === operand.sign;
  }
}
