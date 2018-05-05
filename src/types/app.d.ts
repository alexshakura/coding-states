declare namespace App {
  export interface TableConfig {
    length: number;
    numberOfStates: number;
    numberOfX: number;
    numberOfY: number;
    fsmType: TFsmType;
  }

  export type TFsmType = 'mili' | 'mura';

  export interface TableRow {
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

  export interface Operand {
    sign: string;
    equalTo(operand: App.Operand): boolean;
    copy(): App.Operand;
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

  export type TVertexData = Map<number, number>;
  export type TFunctionMap = Map<number, App.Expression>;
}
