export abstract class Operand {
  public readonly abstract sign: string;

  public abstract equalTo(operand: Operand): boolean;
  public abstract copy(): Operand;
}
