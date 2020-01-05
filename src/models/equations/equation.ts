import { Expression } from './expressions';

export abstract class Equation<T extends Expression> {

  public get terms(): T[] {
    return this._terms;
  }

  protected _terms: T[] = [];

  public constructor(
    ...terms: T[]
  ) {
    this._terms.push(...terms);
  }

  public addTerm(value: T): void {
    if (this.hasTerm(value)) {
      return;
    }

    this._terms.push(value);
  }

  private hasTerm(value: T): boolean {
    return this._terms.some((term) => term.equalTo(value));
  }

}
