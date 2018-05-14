import { ConstantOperand } from './constant-operand';
import { Operand } from './operand';

export class OneOperand extends ConstantOperand {
  public readonly sign: string = '1';

  public copy(): Operand {
    return new OneOperand();
  }
}
