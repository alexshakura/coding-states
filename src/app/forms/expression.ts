import { Operand } from "./operand";

export abstract class Expression implements App.Expression {
  public abstract sign: string;

  public constructor(public operands: (App.Operand | App.Expression)[]) { }

  public addOperand(newOperand: (App.Operand | App.Expression)): void {
    this.operands.push(newOperand);
  }

  public hasOperand(sign: string, id: number, inverted: boolean): boolean {
    return Boolean(
      this.operands
        .filter((operand) => operand instanceof Operand)
        .find((operand: Operand) => {
          return operand.sign === sign && operand.id === id && operand.inverted === inverted;
        })
    );
  }
}
