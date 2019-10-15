import { Injectable } from '@angular/core';

import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ShefferExpression } from '../../shared/expression/sheffer-expression';
import { BaseFsmCoder } from '../coding-algorithms/fsm-coder/base-fsm-coder';
import { FrequencyDAlgorithm } from '../coding-algorithms/algorithms/frequency-d-algorithm';
import { MiliCoder } from '../coding-algorithms/fsm-coder/mili-coder';
import { MuraCoder } from '../coding-algorithms/fsm-coder/mura-coder';
import { NStateAlgorithm } from '../coding-algorithms/algorithms/n-state-d-algorithm';
import { OneOperand } from '../../shared/expression/one-operand';
import { Operand } from '../../shared/expression/operand';
import { Expression } from '../../shared/expression/expression';
import { SignalOperand } from '../../shared/expression/signal-operand';
import { UnitaryDAlgorithm } from '../coding-algorithms/algorithms/unitary-d-algorithm';
import { ICodingAlgorithm, IFunctions, ITableConfig, ITableRow, TFunctionMap, TVertexData } from '@app/types';
import { CodingAlgorithmType, FsmType } from '@app/enums';

@Injectable()
export class CodingAlgorithmsService {

  private static readonly DEFAULT_TIMEOUT: number = 1000;

  public static readonly D_TRIGGER_MODE: string = 'D';

  public readonly INVALID_ROWS_ERROR: string = 'INVALID_ROWS';
  public readonly INVALID_ROW_ERROR: string = 'INVALID_ROW';
  public readonly INVALID_INPUT_ERROR: string = 'INVALID_INPUT';
  public readonly INVALID_GRAPH_ERROR: string = 'INVALID_GRAPH';

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

  public get codedTableData$(): Observable<ITableRow[]> {
    return this._codedTableData$$.asObservable();
  }

  private _codedTableData$$: ReplaySubject<ITableRow[]> = new ReplaySubject<ITableRow[]>(1);

  private algorithmMap: { [propName in CodingAlgorithmType]: ICodingAlgorithm } = {
    [CodingAlgorithmType.UNITARY_D_TRIGGER]: new UnitaryDAlgorithm(),
    [CodingAlgorithmType.FREQUENCY_D_TRIGGER]: new FrequencyDAlgorithm(),
    [CodingAlgorithmType.STATE_N_D_TRIGGER]: new NStateAlgorithm(),
  };

  private fsmMap: { [propName in FsmType]: BaseFsmCoder } = {
    [FsmType.MILI]: new MiliCoder(),
    [FsmType.MURA]: new MuraCoder(),
  };

  public code(
    algorithm: CodingAlgorithmType,
    tableData: ITableRow[],
    tableConfig: Readonly<ITableConfig>
  ): Observable<void> {
    const invalidRows: number[] = this.checkTableData(tableData);

    if (invalidRows.length) {
      const errorObj = invalidRows.length > 1
        ? { [this.INVALID_ROWS_ERROR]: invalidRows }
        : { [this.INVALID_ROW_ERROR]: invalidRows } ;

      return throwError(errorObj)
        .pipe(
          delay(CodingAlgorithmsService.DEFAULT_TIMEOUT)
        );
    }

    if (!this.algorithmMap[algorithm] || !this.fsmMap[tableConfig.fsmType]) {
      return throwError({ [this.INVALID_INPUT_ERROR]: true })
        .pipe(
          delay(CodingAlgorithmsService.DEFAULT_TIMEOUT)
        );
    }

    if (!this.isGraphValid(tableData, tableConfig.numberOfStates)) {
      return throwError({ [this.INVALID_GRAPH_ERROR]: true })
        .pipe(
          delay(CodingAlgorithmsService.DEFAULT_TIMEOUT)
        );
    }

    const algorithmCoder: ICodingAlgorithm = this.algorithmMap[algorithm];
    const fsmCoder: BaseFsmCoder = this.fsmMap[tableConfig.fsmType];

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
      sheffer: outputShefferFunctions,
    });

    this._transitionFunctions$$.next({
      boolean: transitionBooleanFunctions,
      sheffer: transitionShefferFunctions,
    });

    tableData.forEach((tableRow: ITableRow) => {
      tableRow.codeSrcState = vertexCodeMap.get((tableRow.srcState as SignalOperand).id) as number;
      tableRow.codeDistState = vertexCodeMap.get((tableRow.distState as SignalOperand).id) as number;
      tableRow.f = tableRow.codeDistState;
    });

    this._codedTableData$$.next(tableData);

    return of(void 0)
      .pipe(
        delay(CodingAlgorithmsService.DEFAULT_TIMEOUT)
      );
  }

  public isGraphValid(tableData: ITableRow[], numberOfStates: number): boolean {
    const srcStateSet: Set<number> = new Set(tableData.map((tableRow: ITableRow) => (tableRow.srcState as SignalOperand).id));
    const distStateSet: Set<number> = new Set(tableData.map((tableRow: ITableRow) => (tableRow.distState as SignalOperand).id));

    return srcStateSet.size === numberOfStates && distStateSet.size === numberOfStates;
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
