import { StateOperand } from '@app/models';

export interface ITransitionMatrixItem {
  srcState: StateOperand;
  distState: StateOperand;
  weight: number;
}
