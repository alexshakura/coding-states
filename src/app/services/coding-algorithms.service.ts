import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { BaseFsmCoder } from '../coding-algorithms/fsm-coder/base-fsm-coder';
import { Expression } from '../shared/expression/expression';
import { FrequencyDAlgorithm } from '../coding-algorithms/algorithms/frequency-d-algorithm';
import { MiliCoder } from '../coding-algorithms/fsm-coder/mili-coder';
import { MuraCoder } from '../coding-algorithms/fsm-coder/mura-coder';
import { NStateAlgorithm } from '../coding-algorithms/algorithms/n-state-d-algorithm';
import { OneOperand } from '../shared/expression/one-operand';
import { Operand } from '../shared/expression/operand';
import { ShefferExpression } from '../shared/expression/sheffer-expression';
import { SignalOperand } from '../shared/expression/signal-operand';
import { TableDataService } from './table-data.service';
import { UnitaryDAlgorithm } from '../coding-algorithms/algorithms/unitary-d-algorithm';
import { ITableRow } from '../../types/table-row';
import { TVertexData, TFunctionMap } from '../../types/helper-types';
import { ICodingAlgorithm } from '../../types/coding-algorithm';
import { IFunctions } from '../../types/functions';


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

  public get vertexCodes$(): Observable<TVertexData> {
    return this._vertexCodes$$.asObservable();
  }

  private _vertexCodes$$: ReplaySubject<TVertexData> = new ReplaySubject<TVertexData>(1);

  public get outputFunctions$(): Observable<IFunctions> {
    return this._outputFunctions$$.asObservable();
  }

  private _outputFunctions$$: ReplaySubject<IFunctions> = new ReplaySubject<IFunctions>(1);

  public get transitionFunctions$(): Observable<IFunctions> {
    return this._transitionFunctions$$.asObservable();
  }

  private _transitionFunctions$$: ReplaySubject<IFunctions> = new ReplaySubject<IFunctions>(1);

  public get capacity$(): Observable<number> {
    return this._capacity$$.asObservable();
  }

  private _capacity$$: ReplaySubject<number> = new ReplaySubject<number>(1);

  private _algorithmMap: { [propName: string]: ICodingAlgorithm } = {
    [CodingAlgorithmsService.UNITARY_D_ALGORITHM]: new UnitaryDAlgorithm(),
    [CodingAlgorithmsService.FREQUENCY_D_ALGORITHM]: new FrequencyDAlgorithm(),
    [CodingAlgorithmsService.STATE_N_D_ALGORITHM]: new NStateAlgorithm()
  };

  private _fsmMap: { [propName: string]: BaseFsmCoder } = {
    [TableDataService.MILI_FSM_TYPE]: new MiliCoder(),
    [TableDataService.MURA_FSM_TYPE]: new MuraCoder()
  };

  public code(algorithm: string, tableData: ITableRow[], tableConfig: Readonly<ITableConfig>): Observable<void> {
    const invalidRows: number[] = this.checkTableData(tableData);

    if (invalidRows.length) {
      return Observable.throw(invalidRows)
        .delay(CodingAlgorithmsService.DEFAULT_TIMEOUT);
    }

    if (!this._algorithmMap[algorithm] || !this._fsmMap[tableConfig.fsmType]) {
      return Observable.throw(null)
        .delay(CodingAlgorithmsService.DEFAULT_TIMEOUT);
    }

    const algorithmCoder: ICodingAlgorithm = this._algorithmMap[algorithm];
    const fsmCoder: BaseFsmCoder = this._fsmMap[tableConfig.fsmType];

    const vertexCodeMap: TVertexData = algorithmCoder.getVertexCodeMap(tableData, tableConfig.numberOfStates);
    const capacity: number = this._getCapacity(vertexCodeMap);

    const outputBooleanFunctions: TFunctionMap = fsmCoder.getOutputBooleanFunctions(tableData);
    const outputShefferFunctions: TFunctionMap = this._convertBooleanFunctionsToSheffer(outputBooleanFunctions);

    const transitionBooleanFunctions: TFunctionMap = fsmCoder.getTransitionBooleanFunctions(tableData, vertexCodeMap, capacity);
    const transitionShefferFunctions: TFunctionMap = this._convertBooleanFunctionsToSheffer(transitionBooleanFunctions);

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

  public checkTableData(tableData: ITableRow[]): number[] {
    return tableData
      .filter((tableRow: ITableRow) => {
        return !tableRow.distState
          || !tableRow.srcState
          || (!tableRow.unconditionalX && !tableRow.x.size);
      })
      .map((tableRow: ITableRow) => tableRow.id);
  }

  private _convertBooleanFunctionsToSheffer(booleanFunctions: TFunctionMap): TFunctionMap {
    const shefferFunctions: TFunctionMap = new Map<number, Expression>();

    booleanFunctions.forEach((val: Expression, key: number) => {
      shefferFunctions.set(key, this.convertToShefferBasis(val));
    });

    return shefferFunctions;
  }

  // DNF -> Sheffer Basis
  public convertToShefferBasis(expression: Expression): ShefferExpression {
    const shefferExpression: ShefferExpression = new ShefferExpression([]);

    if (expression.operands.length === 1) {
      if (expression.operands[0] instanceof Operand) {
        shefferExpression.addOperand((expression.operands[0] as Operand).copy());
      }

      if (expression.operands[0] instanceof Expression) {
        shefferExpression.addOperand(
          new ShefferExpression((expression.operands[0] as Expression).operands)
        );

        if ((expression.operands[0] as Expression).operands.length > 1) {
          shefferExpression.addOperand(new OneOperand());
        }
      }

      return shefferExpression;
    }

    expression.operands.forEach((operand: Expression | Operand) => {
      if (operand instanceof Expression) {
        shefferExpression.addOperand(new ShefferExpression(operand.operands));
      }

      if (operand instanceof SignalOperand) {
        const newOperand: SignalOperand = operand.copy() as SignalOperand;
        newOperand.inverted = !newOperand.inverted;

        shefferExpression.addOperand(newOperand);
      }
    });

    return shefferExpression;
  }

  private _getCapacity(vertexCodeMap: TVertexData): number {
    const maxValue: number = Math.max(...Array.from(vertexCodeMap.values()));
    return maxValue.toString(2).length;
  }
}
