import { Operand } from '../operands/operand';

export abstract class Expression {

  public readonly abstract symbol: string;

  public constructor(public readonly operands: (Operand | Expression)[]) { }

  public addOperand(newOperand: (Operand | Expression)): void {
    this.operands.push(newOperand);
  }

  public hasOperand(operandToCompare: Operand): boolean {
    return Boolean(
      this.operands
        .filter((operand) => operand instanceof Operand)
        .find((operand: Operand) => operand.equalTo(operandToCompare))
    );
  }
}
