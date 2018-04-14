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

  private _destroy$$: Subject<void> = new Subject<void>();

  public constructor(
    private _codingAlgorithmsService: CodingAlgorithmsService
  ) { }

  public ngOnInit(): void {
    this._codingAlgorithmsService.outputBooleanFunctions$
      .takeUntil(this._destroy$$)
      .subscribe((outputBooleanFunctions: Map<number, App.Expression>) => {
        const newTableData = [];

        outputBooleanFunctions.forEach((value, key) => {
          newTableData.push({ id: key, function: value });
        });

        this.dataSource.data = newTableData;
      });
  }

  public isDisjunctiveExpression(expression: App.Expression): expression is DisjunctiveExpression {
    return expression instanceof DisjunctiveExpression;
  }

  public ngOnDestroy(): void {
    this._destroy$$.next();
    this._destroy$$.complete();
  }
}
