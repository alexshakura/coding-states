import { Operand } from '../operand';

export abstract class ConstantOperand extends Operand {

  public equalTo(operand: Operand): boolean {
    return operand instanceof ConstantOperand && this.symbol === operand.symbol;
  }
}
