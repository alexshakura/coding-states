declare namespace App {
  export interface TableConfig {
    length: number;
    numberOfStates: number;
    numberOfX: number;
    numberOfY: number;
  }

  export interface TableRowData {
    id: number;
    srcState: number;
    codeSrcState: number;
    distState: number;
    codeDistState: number;
    x: Set<ConditionalSignal>;
    unconditionalX: boolean;
    y: Set<number>;
    f: any;
  }

  export interface ConditionalSignal {
    id: number;
    inverted: boolean
  }
}
