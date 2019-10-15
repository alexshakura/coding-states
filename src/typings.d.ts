/* SystemJS module definition */
declare var nodeModule: NodeModule;
interface NodeModule {
  id: string;
}

declare var window: Window;
interface Window {
  process: any;
  require: any;
}

// declare module 'docxtemplater' {
//   export class Docxtemplater {
//     new(): this;
//   }
// }

// declare module 'docxtemplater' {


//   var Docxtemplater: Docxtemplater;

//   export default Docxtemplater;
// }
// export class Docxtemplater {
//   new(): this;
// }


// interface Docxtemplater {
//   new(): this;
// }

// declare var Docxtemplater: Docxtemplater;

declare module 'docxtemplater' {
  interface Xui {
    new(): this;
    (): this;
  }

  export default Xui;
}

declare module 'angular-expressions' {
  // todo: check ?
  export function compile(src: string): (text?: string) => any;
}
