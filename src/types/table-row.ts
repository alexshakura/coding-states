import { SignalOperand } from '../app/shared/expression/signal-operand';

export interface ITableRow {
  id: number;
  srcState: SignalOperand | null;
  codeSrcState: number | null;
  distState: SignalOperand | null;
  codeDistState: number | null;
  x: Set<SignalOperand>;
  unconditionalX: boolean;
  y: Set<number>;
  f: number | null;
}
