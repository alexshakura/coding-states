/// <reference types="node" />
/// <reference types="pizzip" />

declare module 'docxtemplater' {
  export = Docxtemplater;

  class Docxtemplater {
    constructor();
    loadZip(zip: PizZip): Docxtemplater;
    setData(data: object): Docxtemplater;
    setOptions(options: IDocxtemplaterOptions): Docxtemplater;
    render(): Docxtemplater;
    getZip(): PizZip;
  }

  interface IDocxtemplaterOptions {
    paragraphLoop?: boolean;
    parser?: TParser;
  }

  type TParser = (tag: string) => { get: (scope: any, context: any) => any; };
}
