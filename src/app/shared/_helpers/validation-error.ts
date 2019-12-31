export class ValidationError extends Error {

  public constructor(
    public readonly key: string,
    public readonly params?: object
  ) {
    super();
  }

}
