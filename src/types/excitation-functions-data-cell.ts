import { DnfEquation, ShefferEquation } from '@app/models';

export interface IExcitationFunctionsDataCell {
  index: number;
  dnfEquation: DnfEquation;
  shefferEquation: ShefferEquation;
}
