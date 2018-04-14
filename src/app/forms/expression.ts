import { Operand } from "./operand";

export abstract class Expression implements App.Expression {
  public abstract sign: string;

  public constructor(public operands: App.DiscreteExpression[]) { }
}
