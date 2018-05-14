import { Component, OnDestroy, OnInit } from '@angular/core';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';
import { Subject } from 'rxjs/Subject';
import { MatTableDataSource } from '@angular/material';
import { Expression } from '../shared/expression/expression';
import { IFunctions } from '../../types/functions';


@Component({
  selector: 'app-transition-functions-table',
  templateUrl: './transition-functions-table.component.html',
  host: { class: 'component-wrapper' }
})
export class TransitionFunctionsTableComponent implements  OnDestroy, OnInit {

  public triggerMode: string;

  public isBooleanBasisMode: boolean;

  public readonly displayedColumns: string[] = ['id', 'function'];

  public dataSource: MatTableDataSource<{ id: number, function: Expression }> = new MatTableDataSource();

  private _booleanFunctions: { id: number, function: Expression }[] = [];
  private _shefferFunctions: { id: number, function: Expression }[] = [];

  private _destroy$$: Subject<void> = new Subject<void>();

  public constructor(
    private _codingAlgorithmsService: CodingAlgorithmsService
  ) { }

  public ngOnInit(): void {
    this._codingAlgorithmsService.triggerMode$
      .takeUntil(this._destroy$$)
      .subscribe((triggerMode: string) => {
        this.triggerMode = triggerMode;
      });

    this._codingAlgorithmsService.transitionFunctions$
      .takeUntil(this._destroy$$)
      .subscribe((transitionBooleanFunctions: IFunctions) => {
        this._booleanFunctions = [];
        this._shefferFunctions = [];

        transitionBooleanFunctions.boolean.forEach((value, key) => {
          this._booleanFunctions.push({ id: key, function: value });
        });

        transitionBooleanFunctions.sheffer.forEach((value, key) => {
          this._shefferFunctions.push({ id: key, function: value });
        });

        this.toggleBasisMode(true);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$$.next();
    this._destroy$$.complete();
  }

  public isTriggerModeD(): boolean {
    return this.triggerMode === CodingAlgorithmsService.D_TRIGGER_MODE;
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
}
