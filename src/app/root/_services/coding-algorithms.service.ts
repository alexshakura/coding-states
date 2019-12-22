import { Injectable } from '@angular/core';

import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  BaseFsmCoder,
  Expression,
  FrequencyDAlgorithm,
  MiliCoder,
  MuraCoder,
  NStateAlgorithm,
  OneOperand,
  Operand,
  ShefferExpression,
  SignalOperand,
  UnitaryDAlgorithm
} from '@app/models';
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

    const verifiedTableData = tableData as Required<ITableRow[]>;

    const algorithmCoder: ICodingAlgorithm = this.algorithmMap[algorithm];
    const fsmCoder: BaseFsmCoder = this.fsmMap[tableConfig.fsmType];

    const vertexCodeMap: TVertexData = algorithmCoder.getVertexCodeMap(verifiedTableData, tableConfig.numberOfStates);
    const capacity: number = this._getCapacity(vertexCodeMap);

    const outputBooleanFunctions: TFunctionMap = fsmCoder.getOutputBooleanFunctions(verifiedTableData);
    const outputShefferFunctions: TFunctionMap = this._convertBooleanFunctionsToSheffer(outputBooleanFunctions);

    const transitionBooleanFunctions: TFunctionMap = fsmCoder.getTransitionBooleanFunctions(verifiedTableData, vertexCodeMap, capacity);
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

    verifiedTableData.forEach((tableRow: ITableRow) => {
      tableRow.codeSrcState = vertexCodeMap.get((tableRow.srcState as SignalOperand).index) as number;
      tableRow.codeDistState = vertexCodeMap.get((tableRow.distState as SignalOperand).index) as number;
      tableRow.f = tableRow.codeDistState;
    });

    this._codedTableData$$.next(verifiedTableData);

    return of(void 0)
      .pipe(
        delay(CodingAlgorithmsService.DEFAULT_TIMEOUT)
      );
  }

  public isGraphValid(tableData: ITableRow[], numberOfStates: number): boolean {
    const srcStateSet: Set<number> = new Set(tableData.map((tableRow: ITableRow) => (tableRow.srcState as SignalOperand).index));
    const distStateSet: Set<number> = new Set(tableData.map((tableRow: ITableRow) => (tableRow.distState as SignalOperand).index));

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
      const expressionOperand = expression.operands[0];

      if (expressionOperand instanceof Operand) {
        shefferExpression.addOperand(expressionOperand);
      }

      if (expressionOperand instanceof Expression) {
        shefferExpression.addOperand(new ShefferExpression(expressionOperand.operands));

        if (expressionOperand.operands.length > 1) {
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
        shefferExpression.addOperand(operand.invert());
      }
    });

    return shefferExpression;
  }

  private _getCapacity(vertexCodeMap: TVertexData): number {
    const maxValue: number = Math.max(...Array.from(vertexCodeMap.values()));
    return maxValue.toString(2).length;
  }
}
