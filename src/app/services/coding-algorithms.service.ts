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


@Injectable()
export class CodingAlgorithmsService {

  public static readonly UNITARY_D_ALGORITHM: string = 'unitary';
  public static readonly FREQUENCY_D_ALGORITHM: string = 'frequency';

  public static readonly D_TRIGGER_MODE: string = 'D';

  public get triggerMode$(): Observable<string> {
    return this._triggerMode$$.asObservable();
  }

  private _triggerMode$$: ReplaySubject<string> = new ReplaySubject<string>(1);

  public get vertexCodes$(): Observable<App.VertexCode[]> {
    return this._vertexCodes$$.asObservable();
  }

  private _vertexCodes$$: ReplaySubject<App.VertexCode[]> = new ReplaySubject<App.VertexCode[]>(1);

  public get outputBooleanFunctions$(): Observable<Map<number, App.Expression>> {
    return this._outputBooleanFunctions$$.asObservable();
  }

  private _outputBooleanFunctions$$: ReplaySubject<Map<number, App.Expression>> = new ReplaySubject<Map<number, App.Expression>>(1);

  constructor() { }

  public code(algorithm: string, tableData: App.TableRowData[]): void {
    switch (algorithm) {
      case CodingAlgorithmsService.UNITARY_D_ALGORITHM:
        this.unitaryD(tableData);
        break;
    }
  }

  public unitaryD(tableData: App.TableRowData[]) {
    const vertexCodes: App.VertexCode[] = [];

    const tableCodingStates: number[] = tableData.map((tableRowData: App.TableRowData) => tableRowData.distState);
    const capacity: number = Math.max(...tableCodingStates);

    for (let i: number = 0; i < capacity; i++) {
      vertexCodes.push({
        id: i + 1,
        code: 1 << i
      });
    }

    const outputBooleanFunctions: Map<number, App.Expression> = new Map();

    tableData
      .filter((tableRow: App.TableRowData) => tableRow.y.size > 0)
      .forEach((tableRow: App.TableRowData) => {
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

    this._triggerMode$$.next(CodingAlgorithmsService.D_TRIGGER_MODE);
    this._outputBooleanFunctions$$.next(outputBooleanFunctions);
    this._vertexCodes$$.next(vertexCodes);
  }

  // DNF -> Sheffer Bassis
  public convertToShefferBasis(expression: App.Expression): ShefferExpression {
    const shefferExpression: ShefferExpression = new ShefferExpression([]);

    if (expression.operands.length === 1) {
      if (expression.operands[0] instanceof Operand) {
        shefferExpression.addOperand({ ...expression.operands[0] });
      }

      if (expression.operands[0] instanceof Expression) {
        shefferExpression.addOperand(
          new ShefferExpression((expression.operands[0] as App.Expression).operands)
        );

        shefferExpression.addOperand(new OneOperand());
      }

      return shefferExpression;
    }

    expression.operands.forEach((operand) => {
      if (operand instanceof Expression) {
        shefferExpression.addOperand(new ShefferExpression(operand.operands));
      }

      if (operand instanceof SignalOperand) {
        shefferExpression.addOperand({
          ...operand,
          inverted: !operand.inverted
        } as App.SignalOperand);
      }
    });

    return shefferExpression;
  }
}
