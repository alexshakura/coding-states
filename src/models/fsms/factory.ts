import { FsmType } from '@app/enums';
import { MuraFsm } from './mura-fsm';
import { MiliFsm } from './mili-fsm';
import { ITableRow } from '@app/types';
import { Fsm } from './fsm';
import { ConditionSignalOperand, OutputSignalOperand, StateOperand } from '../operands';

export class FsmFactory {

  public static create(
    type: FsmType,
    codedTableData: ITableRow[],
    statesMap: Map<number, StateOperand>,
    conditionalSignalsMap: Map<number, ConditionSignalOperand>,
    outputSignalsMap: Map<number, OutputSignalOperand>
  ): Fsm {
    const fsmMap = {
      [FsmType.MILI]: MiliFsm,
      [FsmType.MURA]: MuraFsm,
    };

    const fsm = fsmMap[type];

    return new fsm(
      codedTableData,
      statesMap,
      conditionalSignalsMap,
      outputSignalsMap
    );
  }

}
