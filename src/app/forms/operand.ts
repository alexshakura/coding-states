export abstract class Operand implements App.Operand {
  public readonly abstract sign: string;
  public abstract equalTo(operand: App.Operand): boolean;
}
