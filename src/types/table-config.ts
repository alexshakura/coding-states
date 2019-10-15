import { FsmType } from '@app/enums';

export interface ITableConfig {
  length: number;
  numberOfStates: number;
  numberOfX: number;
  numberOfY: number;
  fsmType: FsmType;
}
