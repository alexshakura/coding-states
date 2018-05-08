declare namespace App {
  export interface ITableConfig {
    length: number;
    numberOfStates: number;
    numberOfX: number;
    numberOfY: number;
    fsmType: TFsmType;
  }

  export type TFsmType = 'mili' | 'mura';

  export interface ITableRow {
    id: number;
    srcState: ISignalOperand;
    codeSrcState: number;
    distState: ISignalOperand;
    codeDistState: number;
    x: Set<ISignalOperand>;
    unconditionalX: boolean;
    y: Set<number>;
    f: number;
  }

  export interface IOperand {
    sign: string;
    equalTo(operand: IOperand): boolean;
    copy(): IOperand;
  }

  export interface ISignalOperand extends IOperand {
    id: number;
    inverted: boolean;
  }

  export interface IConstantOperand extends IOperand {
    value: number;
  }

  export interface IExpression {
    sign: string;
    operands: (IOperand | IExpression)[];

    addOperand(newOperand: (App.IOperand | App.IExpression)): void;
    hasOperand(operandToCompare: App.IOperand): boolean;
  }

  export interface ICodingAlgorithm {
    getCapacity(numOfStates: number): number;
    getVertexCodeMap(tableData: App.ITableRow[], numOfStates: number): App.TVertexData;
  }

  export type TVertexData = Map<number, number>;
  export type TFunctionMap = Map<number, App.IExpression>;

  export interface IFunctions {
    boolean: TFunctionMap;
    sheffer: TFunctionMap;
  }
}
