import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { BaseFsmCoder } from '../coding-algorithms/fsm-coder/base-fsm-coder';
import { ConditionSignalOperand } from '../shared/expression/condition-signal-operand';
import { ConjunctiveExpression } from '../shared/expression/conjunctive-expression';
import { DisjunctiveExpression } from '../shared/expression/disjunctive-expression';
import { Expression } from '../shared/expression/expression';
import { FrequencyDAlgorithm } from '../coding-algorithms/algorithms/frequency-d-algorithm';
import { MiliCoder } from '../coding-algorithms/fsm-coder/mili-coder';
import { MuraCoder } from '../coding-algorithms/fsm-coder/mura-coder';
import { NStateAlgorithm } from '../coding-algorithms/algorithms/n-state-d-algorithm';
import { OneOperand } from '../shared/expression/one-operand';
import { Operand } from '../shared/expression/operand';
import { ShefferExpression } from '../shared/expression/sheffer-expression';
import { SignalOperand } from '../shared/expression/signal-operand';
import { StateOperand } from '../shared/expression/state-operand';
import { TableDataService } from './table-data.service';
import { UnitaryDAlgorithm } from '../coding-algorithms/algorithms/unitary-d-algorithm';


@Injectable()
export class CodingAlgorithmsService {

  public static readonly UNITARY_D_ALGORITHM: string = 'unitary';
  public static readonly FREQUENCY_D_ALGORITHM: string = 'frequency';
  public static readonly STATE_N_D_ALGORITHM: string = 'by_num_state';

  public static readonly DEFAULT_TIMEOUT: number = 1000;

  public static readonly D_TRIGGER_MODE: string = 'D';

  public get triggerMode$(): Observable<string> {
    return this._triggerMode$$.asObservable();
  }

  private _triggerMode$$: ReplaySubject<string> = new ReplaySubject<string>(1);

  public get vertexCodes$(): Observable<App.TVertexData> {
    return this._vertexCodes$$.asObservable();
  }

  private _vertexCodes$$: ReplaySubject<App.TVertexData> = new ReplaySubject<App.TVertexData>(1);

  public get outputFunctions$(): Observable<App.IFunctions> {
    return this._outputFunctions$$.asObservable();
  }

  private _outputFunctions$$: ReplaySubject<App.IFunctions> = new ReplaySubject<App.IFunctions>(1);

  public get transitionFunctions$(): Observable<App.IFunctions> {
    return this._transitionFunctions$$.asObservable();
  }

  private _transitionFunctions$$: ReplaySubject<App.IFunctions> = new ReplaySubject<App.IFunctions>(1);

  public get capacity$(): Observable<number> {
    return this._capacity$$.asObservable();
  }

  private _capacity$$: ReplaySubject<number> = new ReplaySubject<number>(1);

  private _algorithmMap: { [propName: string]: App.ICodingAlgorithm } = {
    [CodingAlgorithmsService.UNITARY_D_ALGORITHM]: new UnitaryDAlgorithm(),
    [CodingAlgorithmsService.FREQUENCY_D_ALGORITHM]: new FrequencyDAlgorithm(),
    [CodingAlgorithmsService.STATE_N_D_ALGORITHM]: new NStateAlgorithm()
  };

  private _fsmMap: { [propName: string]: BaseFsmCoder } = {
    [TableDataService.MILI_FSM_TYPE]: new MiliCoder(),
    [TableDataService.MURA_FSM_TYPE]: new MuraCoder()
  };

  public code(algorithm: string, tableData: App.ITableRow[], tableConfig: Readonly<App.ITableConfig>): Observable<void> {
    const invalidRows: number[] = this.checkTableData(tableData);

    if (invalidRows.length) {
      return Observable.throw(invalidRows)
        .delay(CodingAlgorithmsService.DEFAULT_TIMEOUT);
    }

    if (!this._algorithmMap[algorithm] || !this._fsmMap[tableConfig.fsmType]) {
      return Observable.throw(null)
        .delay(CodingAlgorithmsService.DEFAULT_TIMEOUT);
    }

    const algorithmCoder = this._algorithmMap[algorithm];
    const fsmCoder = this._fsmMap[tableConfig.fsmType];

    const vertexCodeMap = algorithmCoder.getVertexCodeMap(tableData, tableConfig.numberOfStates);
    const capacity = algorithmCoder.getCapacity(tableConfig.numberOfStates);

    const outputBooleanFunctions = fsmCoder.getOutputBooleanFunctions(tableData);
    const outputShefferFunctions = this._convertBooleanFunctionsToSheffer(outputBooleanFunctions);

    const transitionBooleanFunctions = fsmCoder.getTransitionBooleanFunctions(tableData, vertexCodeMap, capacity);
    const transitionShefferFunctions = this._convertBooleanFunctionsToSheffer(transitionBooleanFunctions);

    this._capacity$$.next(capacity);
    this._vertexCodes$$.next(vertexCodeMap);

    this._outputFunctions$$.next({
      boolean: outputBooleanFunctions,
      sheffer: outputShefferFunctions
    });

    this._transitionFunctions$$.next({
      boolean: transitionBooleanFunctions,
      sheffer: transitionShefferFunctions
    });

    return Observable.of(null)
      .delay(CodingAlgorithmsService.DEFAULT_TIMEOUT);
  }

  public checkTableData(tableData: App.ITableRow[]): number[] {
    return tableData
      .filter((tableRow: App.ITableRow) => {
        return !tableRow.distState
          || !tableRow.srcState
          || (!tableRow.unconditionalX && !tableRow.x.size);
      })
      .map((tableRow: App.ITableRow) => tableRow.id);
  }

  private _convertBooleanFunctionsToSheffer(booleanFunctions: App.TFunctionMap): App.TFunctionMap {
    const shefferFunctions: App.TFunctionMap = new Map<number, App.IExpression>();

    booleanFunctions.forEach((val, key) => {
      shefferFunctions.set(key, this.convertToShefferBasis(val));
    });

    return shefferFunctions;
  }

  // DNF -> Sheffer Basis
  public convertToShefferBasis(expression: App.IExpression): ShefferExpression {
    const shefferExpression: ShefferExpression = new ShefferExpression([]);

    if (expression.operands.length === 1) {
      if (expression.operands[0] instanceof Operand) {
        shefferExpression.addOperand((expression.operands[0] as App.IOperand).copy());
      }

      if (expression.operands[0] instanceof Expression) {
        shefferExpression.addOperand(
          new ShefferExpression((expression.operands[0] as App.IExpression).operands)
        );

        if ((expression.operands[0] as App.IExpression).operands.length > 1) {
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
        const newOperand: SignalOperand = operand.copy() as App.ISignalOperand;
        newOperand.inverted = !newOperand.inverted;

        shefferExpression.addOperand(newOperand);
      }
    });

    return shefferExpression;
  }
}
