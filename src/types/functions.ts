import { DnfEquation, ShefferEquation } from '@app/models';

export interface IFunctions {
  boolean: Map<number, DnfEquation>;
  sheffer: Map<number, ShefferEquation>;
}
