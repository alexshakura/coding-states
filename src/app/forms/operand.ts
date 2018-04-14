export abstract class Operand implements App.Operand {
  public abstract sign: string;

  public constructor(public id: number, public inverted: boolean) { }
}
