import { ConstantOperand } from "./constant-operand";

export class OneOperand extends ConstantOperand {
  public readonly value: number = 1;
  public readonly sign: string = '1';

  public copy(): App.Operand {
    return new OneOperand();
  }
}
