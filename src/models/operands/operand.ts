export abstract class Operand {

  public readonly abstract symbol: string;

  public abstract equalTo(operand: Operand): boolean;

  public abstract invert(): Operand;

}
