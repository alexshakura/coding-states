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
    equalTo(operand: App.Operand): boolean;
  }

  export interface SignalOperand extends Operand {
    id: number;
    inverted: boolean;
  }

  export interface ConstantOperand extends Operand {
    value: number;
  }

  export interface Expression {
    sign: string;
    operands: (Operand | Expression)[];

    addOperand(newOperand: (App.Operand | App.Expression)): void;
    hasOperand(operandToCompare: App.Operand): boolean;
  }
}
