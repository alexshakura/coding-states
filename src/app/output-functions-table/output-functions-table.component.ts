import { Component, OnInit, OnDestroy } from '@angular/core';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';
import { MatTableDataSource } from '@angular/material';

import { Subject } from 'rxjs/Subject';
import { DisjunctiveExpression } from '../forms/disjunctive-expression';

@Component({
  selector: 'app-output-functions-table',
  templateUrl: './output-functions-table.component.html',
  styleUrls: ['./output-functions-table.component.scss']
})
export class OutputFunctionsTableComponent implements OnDestroy, OnInit {

  public readonly displayedColumns: string[] = ['id', 'function'];

  public dataSource: MatTableDataSource<{ id: number, function: App.Expression }> = new MatTableDataSource();

  public isBooleanBasisMode: boolean;

  private _booleanFunctions: { id: number, function: App.Expression }[] = [];
  private _shefferFunctions: { id: number, function: App.Expression }[] = [];

  private _destroy$$: Subject<void> = new Subject<void>();

  public constructor(
    private _codingAlgorithmsService: CodingAlgorithmsService
  ) { }

  public ngOnInit(): void {
    this._codingAlgorithmsService.outputBooleanFunctions$
      .takeUntil(this._destroy$$)
      .subscribe((outputBooleanFunctions: Map<number, App.Expression>) => {
        outputBooleanFunctions.forEach((value, key) => {
          this._booleanFunctions.push({
            id: key,
            function: value
          });

          this._shefferFunctions.push({
            id: key,
            function: this._codingAlgorithmsService.convertToShefferBasis(value)
          });
        });

        this.toggleBasisMode(true);
      });
  }

  public toggleBasisMode(isBooleanBasisMode: boolean): void {
    if (isBooleanBasisMode === this.isBooleanBasisMode) {
      return;
    }

    this.isBooleanBasisMode = isBooleanBasisMode;

    this.dataSource.data = this.isBooleanBasisMode
      ? [...this._booleanFunctions]
      : [...this._shefferFunctions];
  }

  public isDisjunctiveExpression(expression: App.Expression): expression is DisjunctiveExpression {
    return expression instanceof DisjunctiveExpression;
  }

  public ngOnDestroy(): void {
    this._destroy$$.next();
    this._destroy$$.complete();
  }
}
