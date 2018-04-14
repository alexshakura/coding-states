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
    f: number;
  }

  export interface ConditionalSignal {
    id: number;
    inverted: boolean
  }

  export interface VertexCode {
    id: number;
    code: number;
  }

  export interface Operand {
    sign: string;
    id: number;
    inverted: boolean;
  }

  export interface Expression {
    sign: string;
    operands: (Operand | Expression)[]
  }

  export type DiscreteExpression = Operand | Expression;
}
