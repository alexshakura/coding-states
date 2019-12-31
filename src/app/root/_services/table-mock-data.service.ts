import { Injectable } from '@angular/core';
import { ITableConfig, ITableRow } from '@app/types';
import { FsmType } from '@app/enums';
import { SignalOperandGeneratorService } from './signal-operand-generator.service';

@Injectable()
export class TableMockDataService {

  public constructor(
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService
  ) { }

  public getConfigForUnitaryD(): ITableConfig {
    return {
      length: 16,
      numberOfStates: 7,
      numberOfX: 3,
      numberOfY: 6,
      fsmType: FsmType.MURA,
    };
  }

  public getMockDataForUnitaryD(): ITableRow[] {
    const states = Array.from(this.signalOperandGeneratorService.getStates().values());

    return [
      {
        id: 1,
        srcStateId: states[6].id,
        srcStateCode: null,
        distStateId: states[0].id,
        distStateCode: null,
        unconditionalTransition: true,
        conditionalSignalsIds: new Set(),
        outputSignalsIds: new Set(),
        triggerExcitationSignals: null,
      },
      {
        id: 2,
        srcStateId: states[5].id,
        srcStateCode: null,
        distStateId: states[0].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([6]),
        outputSignalsIds: new Set(),
        triggerExcitationSignals: null,
      },
      {
        id: 3,
        srcStateId: states[4].id,
        srcStateCode: null,
        distStateId: states[0].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([2, 6]),
        outputSignalsIds: new Set(),
        triggerExcitationSignals: null,
      },
      {
        id: 4,
        srcStateId: states[3].id,
        srcStateCode: null,
        distStateId: states[0].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([2, 6]),
        outputSignalsIds: new Set(),
        triggerExcitationSignals: null,
      },

      {
        id: 5,
        srcStateId: states[0].id,
        srcStateCode: null,
        distStateId: states[1].id,
        distStateCode: null,
        unconditionalTransition: true,
        conditionalSignalsIds: new Set(),
        outputSignalsIds: new Set([1, 2]),
        triggerExcitationSignals: null,
      },

      {
        id: 6,
        srcStateId: states[1].id,
        srcStateCode: null,
        distStateId: states[2].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([1]),
        outputSignalsIds: new Set([3]),
        triggerExcitationSignals: null,
      },

      {
        id: 7,
        srcStateId: states[1].id,
        srcStateCode: null,
        distStateId: states[3].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([2, 3]),
        outputSignalsIds: new Set([4]),
        triggerExcitationSignals: null,
      },

      {
        id: 8,
        srcStateId: states[2].id,
        srcStateCode: null,
        distStateId: states[3].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([3]),
        outputSignalsIds: new Set([4]),
        triggerExcitationSignals: null,
      },

      {
        id: 9,
        srcStateId: states[1].id,
        srcStateCode: null,
        distStateId: states[4].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([2, 4]),
        outputSignalsIds: new Set([5]),
        triggerExcitationSignals: null,
      },

      {
        id: 10,
        srcStateId: states[2].id,
        srcStateCode: null,
        distStateId: states[4].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([4]),
        outputSignalsIds: new Set([5]),
        triggerExcitationSignals: null,
      },

      {
        id: 11,
        srcStateId: states[3].id,
        srcStateCode: null,
        distStateId: states[5].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([1]),
        outputSignalsIds: new Set([3]),
        triggerExcitationSignals: null,
      },

      {
        id: 12,
        srcStateId: states[4].id,
        srcStateCode: null,
        distStateId: states[5].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([1]),
        outputSignalsIds: new Set([3]),
        triggerExcitationSignals: null,
      },

      {
        id: 13,
        srcStateId: states[5].id,
        srcStateCode: null,
        distStateId: states[6].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([5]),
        outputSignalsIds: new Set([6]),
        triggerExcitationSignals: null,
      },
      {
        id: 14,
        srcStateId: states[4].id,
        srcStateCode: null,
        distStateId: states[6].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([2, 5]),
        outputSignalsIds: new Set([6]),
        triggerExcitationSignals: null,
      },
      {
        id: 15,
        srcStateId: states[3].id,
        srcStateCode: null,
        distStateId: states[6].id,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([2, 5]),
        outputSignalsIds: new Set([6]),
        triggerExcitationSignals: null,
      },
    ];
  }

  public getMockDataForWrongGraph(): ITableRow[] {
    const states = Array.from(this.signalOperandGeneratorService.getStates().values());

    return [
      {
        id: 1,
        srcStateId: states[0].id,
        srcStateCode: null,
        distStateId: 2,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([1]),
        outputSignalsIds: new Set([1, 2]),
        triggerExcitationSignals: null,
      },
      {
        id: 2,
        srcStateId: states[0].id,
        srcStateCode: null,
        distStateId: 3,
        distStateCode: null,
        unconditionalTransition: false,
        conditionalSignalsIds: new Set([2]),
        outputSignalsIds: new Set([2]),
        triggerExcitationSignals: null,
      },
      {
        id: 3,
        srcStateId: states[1].id,
        srcStateCode: null,
        distStateId: 2,
        distStateCode: null,
        unconditionalTransition: true,
        conditionalSignalsIds: new Set(),
        outputSignalsIds: new Set([3]),
        triggerExcitationSignals: null,
      },
      {
        id: 4,
        srcStateId: states[2].id,
        srcStateCode: null,
        distStateId: 2,
        distStateCode: null,
        unconditionalTransition: true,
        conditionalSignalsIds: new Set(),
        outputSignalsIds: new Set([2, 3]),
        triggerExcitationSignals: null,
      },
    ];
  }

}
