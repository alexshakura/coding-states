import { Operand } from './operand';

export abstract class Expression implements App.IExpression {
  public readonly abstract sign: string;

  public constructor(public operands: (App.IOperand | App.IExpression)[]) { }

  public addOperand(newOperand: (App.IOperand | App.IExpression)): void {
    this.operands.push(newOperand);
  }

  public hasOperand(operandToCompare: App.IOperand): boolean {
    return Boolean(
      this.operands
        .filter((operand) => operand instanceof Operand)
        .find((operand: Operand) => operand.equalTo(operandToCompare))
    );
  }
}
