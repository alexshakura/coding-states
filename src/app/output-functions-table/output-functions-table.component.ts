import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { CodingAlgorithmsService } from '../services/coding-algorithms.service';
import { DisjunctiveExpression } from '../shared/expression/disjunctive-expression';
import { BaseComponent } from '../shared/base-component';


@Component({
  selector: 'app-output-functions-table',
  templateUrl: './output-functions-table.component.html',
  host: { class: 'component-wrapper' }
})
export class OutputFunctionsTableComponent extends BaseComponent implements OnInit {

  public readonly displayedColumns: string[] = ['id', 'function'];

  public dataSource: MatTableDataSource<{ id: number, function: App.IExpression }> = new MatTableDataSource();

  public isBooleanBasisMode: boolean;

  private _booleanFunctions: { id: number, function: App.IExpression }[] = [];
  private _shefferFunctions: { id: number, function: App.IExpression }[] = [];


  public constructor(
    private _codingAlgorithmsService: CodingAlgorithmsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this._codingAlgorithmsService.outputFunctions$
      .takeUntil(this._destroy$$)
      .subscribe((outputFunctions: App.IFunctions) => {
        this._booleanFunctions = [];
        this._shefferFunctions = [];

        outputFunctions.boolean.forEach((value: App.IExpression, key: number) => {
          this._booleanFunctions.push({ id: key, function: value });
        });

        outputFunctions.sheffer.forEach((value: App.IExpression, key: number) => {
          this._shefferFunctions.push({ id: key, function: value });
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

  public isDisjunctiveExpression(expression: App.IExpression): expression is DisjunctiveExpression {
    return expression instanceof DisjunctiveExpression;
  }
}
