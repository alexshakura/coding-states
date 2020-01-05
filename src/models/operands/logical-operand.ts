import { Operand } from './operand';

export class LogicalOperand extends Operand {

  public readonly symbol: string = this._active ? '1' : '0';

  public get active(): boolean {
    return this._active;
  }

  public constructor(
    private readonly _active: boolean
  ) {
    super();
  }

  public invert(): LogicalOperand {
    return new LogicalOperand(!this._active);
  }

  public equalTo(operand: Operand): boolean {
    return operand instanceof LogicalOperand && this._active === operand.active;
  }

}
