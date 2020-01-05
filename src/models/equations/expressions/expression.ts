import { Operand } from '../../operands';

export abstract class Expression {

  public get operands(): Operand[] {
    return this._operands;
  }

  protected _operands: Operand[] = [];

  public constructor(
    ...operands: Operand[]
  ) {
    this._operands.push(...operands);
  }

  public addOperand(value: Operand): void {
    if (this.hasOperand(value)) {
      return;
    }

    this._operands.push(value);
  }

  private hasOperand(value: Operand): boolean {
    return this._operands.some((operand) => operand.equalTo(value));
  }

  public equalTo(value: Expression): boolean {
    const equalOperandsCount = value.operands
      .map((operand) => this.hasOperand(operand))
      .filter(Boolean)
      .length;

    return equalOperandsCount === this._operands.length;
  }

}
