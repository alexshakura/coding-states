import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { DisjunctiveExpression } from '../forms/disjunctive-expression';
import { StateOperand } from '../forms/state-operand';
import { ShefferExpression } from '../forms/sheffer-expression';
import { Expression } from '../forms/expression';
import { Operand } from '../forms/operand';
import { SignalOperand } from '../forms/signal-operand';
import { OneOperand } from '../forms/one-operand';
import { ConjunctiveExpression } from '../forms/conjunctive-expression';
import { ConditionSignalOperand } from '../forms/condition-signal-operand';
import { FrequencyDAlgorithm } from '../algorithms/frequency-d-algorithm';


@Injectable()
export class CodingAlgorithmsService {

  public static readonly UNITARY_D_ALGORITHM: string = 'unitary';
  public static readonly FREQUENCY_D_ALGORITHM: string = 'frequency';

  public static readonly D_TRIGGER_MODE: string = 'D';

  public get triggerMode$(): Observable<string> {
    return this._triggerMode$$.asObservable();
  }

  private _triggerMode$$: ReplaySubject<string> = new ReplaySubject<string>(1);

  public get vertexCodes$(): Observable<App.TVertexData> {
    return this._vertexCodes$$.asObservable();
  }

  private _vertexCodes$$: ReplaySubject<App.TVertexData> = new ReplaySubject<App.TVertexData>(1);

  public get outputBooleanFunctions$(): Observable<Map<number, App.Expression>> {
    return this._outputBooleanFunctions$$.asObservable();
  }

  private _outputBooleanFunctions$$: ReplaySubject<App.TFunctionMap> = new ReplaySubject<App.TFunctionMap>(1);

  public get transitionBooleanFunctions$(): Observable<App.TFunctionMap> {
    return this._transitionBooleanFunctions$$.asObservable();
  }

  private _transitionBooleanFunctions$$: ReplaySubject<App.TFunctionMap> = new ReplaySubject<App.TFunctionMap>(1);

  constructor() { }

  public code(algorithm: string, tableData: App.TableRow[]): void {
    switch (algorithm) {
      case CodingAlgorithmsService.UNITARY_D_ALGORITHM:
        this.unitaryD(tableData);
        break;
      case CodingAlgorithmsService.FREQUENCY_D_ALGORITHM:
        this.frequencyD(tableData);
        break;
    }
  }

  public unitaryD(tableData: App.TableRow[]) {
    const vertexCodes: App.TVertexData = new Map();

    const tableCodingStates: number[] = tableData.map((TableRow: App.TableRow) => TableRow.distState);
    const capacity: number = Math.max(...tableCodingStates);

    for (let i: number = 0; i < capacity; i++) {
      vertexCodes.set(i + 1, 1 << i);
    }

    const outputBooleanFunctions: App.TFunctionMap = new Map();

    tableData
      .filter((tableRow: App.TableRow) => tableRow.y.size > 0)
      .forEach((tableRow: App.TableRow) => {
        const stateOperand: StateOperand = new StateOperand(tableRow.distState, false);

        tableRow.y.forEach((y: number) => {
          if (!outputBooleanFunctions.has(y)) {
            outputBooleanFunctions.set(y, new DisjunctiveExpression([]));
          }

          const outputBooleanFunction: App.Expression = outputBooleanFunctions.get(y);

          if (!outputBooleanFunction.hasOperand(stateOperand)) {
            outputBooleanFunction.addOperand(stateOperand);
          }
        });
      });

    const transitionBooleanFunctions: Map<number, App.Expression> = new Map();

    tableData
      .forEach((tableRow: App.TableRow) => {
        if (!transitionBooleanFunctions.has(tableRow.distState)) {
          transitionBooleanFunctions.set(tableRow.distState, new DisjunctiveExpression([]));
        }

        if (tableRow.unconditionalX || !tableRow.x.size) {
          return transitionBooleanFunctions
            .get(tableRow.distState)
            .addOperand(new StateOperand(tableRow.srcState, false));
        }

        const rowExpression = new ConjunctiveExpression([new StateOperand(tableRow.srcState, false)]);

        if (!tableRow.unconditionalX) {
          tableRow.x.forEach((conditionSignal) =>
            rowExpression.addOperand(new ConditionSignalOperand(conditionSignal.id, conditionSignal.inverted))
          );
        }

        transitionBooleanFunctions.get(tableRow.distState).addOperand(rowExpression);
      });

    this._triggerMode$$.next(CodingAlgorithmsService.D_TRIGGER_MODE);

    this._outputBooleanFunctions$$.next(outputBooleanFunctions);
    this._transitionBooleanFunctions$$.next(transitionBooleanFunctions);

    this._vertexCodes$$.next(vertexCodes);
  }

  public frequencyD(tableData: App.TableRow[]) {
    const handler = new FrequencyDAlgorithm();

    const vertexCodeMap = handler.getVertexCodeMap(tableData);
    const outputBooleanFunctions = handler.getOutputBooleanFunctions(tableData);
    const transitionBooleanFunctions = handler.getTransitionBooleanFunctions(tableData, vertexCodeMap);

    this._triggerMode$$.next(CodingAlgorithmsService.D_TRIGGER_MODE);
    this._outputBooleanFunctions$$.next(outputBooleanFunctions);
    this._transitionBooleanFunctions$$.next(transitionBooleanFunctions);
    this._vertexCodes$$.next(vertexCodeMap);
  }

  // DNF -> Sheffer Basis
  public convertToShefferBasis(expression: App.Expression): ShefferExpression {
    const shefferExpression: ShefferExpression = new ShefferExpression([]);

    if (expression.operands.length === 1) {
      if (expression.operands[0] instanceof Operand) {
        shefferExpression.addOperand((expression.operands[0] as App.Operand).copy());
      }

      if (expression.operands[0] instanceof Expression) {
        shefferExpression.addOperand(
          new ShefferExpression((expression.operands[0] as App.Expression).operands)
        );

        if ((expression.operands[0] as App.Expression).operands.length > 1) {
          shefferExpression.addOperand(new OneOperand());
        }
      }

      return shefferExpression;
    }

    expression.operands.forEach((operand) => {
      if (operand instanceof Expression) {
        shefferExpression.addOperand(new ShefferExpression(operand.operands));
      }

      if (operand instanceof SignalOperand) {
        const newOperand: SignalOperand = operand.copy() as App.SignalOperand;
        newOperand.inverted = !newOperand.inverted;

        shefferExpression.addOperand(newOperand);
      }
    });

    return shefferExpression;
  }
}
