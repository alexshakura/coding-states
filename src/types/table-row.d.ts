import { SignalOperand } from "../app/shared/expression/signal-operand";

declare interface ITableRow {
  id: number;
  srcState: SignalOperand;
  codeSrcState: number;
  distState: SignalOperand;
  codeDistState: number;
  x: Set<SignalOperand>;
  unconditionalX: boolean;
  y: Set<number>;
  f: number;
}
