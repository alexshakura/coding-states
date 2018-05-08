export abstract class Operand implements App.IOperand {
  public readonly abstract sign: string;

  public abstract equalTo(operand: App.IOperand): boolean;
  public abstract copy(): App.IOperand;
}
