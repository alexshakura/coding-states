import { Operand } from "./operand";

export abstract class Expression implements App.Expression {
  public readonly abstract sign: string;

  public constructor(public operands: (App.Operand | App.Expression)[]) { }

  public addOperand(newOperand: (App.Operand | App.Expression)): void {
    this.operands.push(newOperand);
  }

  public hasOperand(operandToCompare: App.Operand): boolean {
    return Boolean(
      this.operands
        .filter((operand) => operand instanceof Operand)
        .find((operand: Operand) => operand.equalTo(operandToCompare))
    );
  }
}
