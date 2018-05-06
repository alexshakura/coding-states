import { Component, OnInit, OnDestroy } from '@angular/core';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';
import { MatTableDataSource } from '@angular/material';

import { Subject } from 'rxjs/Subject';
import { DisjunctiveExpression } from '../forms/disjunctive-expression';
import { BaseComponent } from '../base-component';


@Component({
  selector: 'app-output-functions-table',
  templateUrl: './output-functions-table.component.html',
  host: { class: 'component-wrapper' }
})
export class OutputFunctionsTableComponent extends BaseComponent implements OnDestroy, OnInit {

  public readonly displayedColumns: string[] = ['id', 'function'];

  public dataSource: MatTableDataSource<{ id: number, function: App.Expression }> = new MatTableDataSource();

  public isBooleanBasisMode: boolean;

  private _booleanFunctions: { id: number, function: App.Expression }[] = [];
  private _shefferFunctions: { id: number, function: App.Expression }[] = [];


  public constructor(
    private _codingAlgorithmsService: CodingAlgorithmsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this._codingAlgorithmsService.outputBooleanFunctions$
      .takeUntil(this._destroy$$)
      .subscribe((outputBooleanFunctions: Map<number, App.Expression>) => {
        this._booleanFunctions = [];
        this._shefferFunctions = [];

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
}
