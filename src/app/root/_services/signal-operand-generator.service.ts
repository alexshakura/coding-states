import { Injectable } from '@angular/core';
import { ConditionSignalOperand, OutputSignalOperand, StateOperand } from '@app/models';

@Injectable()
export class SignalOperandGeneratorService {

  private readonly conditionalSignals: Map<number, ConditionSignalOperand> = new Map();
  private readonly outputSignals: Map<number, OutputSignalOperand> = new Map();
  private readonly states: Map<number, StateOperand> = new Map();

  public generateConditionalSignals(numberOfConditionalSignals: number): Map<number, ConditionSignalOperand> {
    if (this.conditionalSignals.size !== numberOfConditionalSignals * 2) {
      this.conditionalSignals.clear();

      for (let i: number = 1; i <= numberOfConditionalSignals; i++) {
        const plainOperand = ConditionSignalOperand.create(i, false);
        this.conditionalSignals.set(plainOperand.id, plainOperand);

        const invertedOperand = ConditionSignalOperand.create(i, true);
        this.conditionalSignals.set(invertedOperand.id, invertedOperand);
      }
    }

    return this.conditionalSignals;
  }

  public generateOutputSignals(numberOfOutputSignals: number): Map<number, OutputSignalOperand> {
    if (this.outputSignals.size !== numberOfOutputSignals) {
      this.outputSignals.clear();

      for (let i = 1; i <= numberOfOutputSignals; i++) {
        const operand = OutputSignalOperand.create(i);
        this.outputSignals.set(operand.id, operand);
      }
    }

    return this.outputSignals;
  }

  public generateStates(numberOfStates: number): Map<number, StateOperand> {
    if (this.states.size !== numberOfStates) {
      this.states.clear();

      for (let i = 1; i <= numberOfStates; i++) {
        const operand = StateOperand.create(i, false);
        this.states.set(operand.id, operand);
      }
    }

    return this.states;
  }

  public getConditionalSignals(): Map<number, ConditionSignalOperand> {
    return this.conditionalSignals;
  }

  public getOutputSignals(): Map<number, OutputSignalOperand> {
    return this.outputSignals;
  }

  public getStates(): Map<number, StateOperand> {
    return this.states;
  }

}
