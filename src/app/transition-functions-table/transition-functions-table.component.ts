import { Component, OnInit, OnDestroy } from '@angular/core';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';
import { Subject } from 'rxjs/Subject';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-transition-functions-table',
  templateUrl: './transition-functions-table.component.html',
  styleUrls: ['./transition-functions-table.component.scss']
})
export class TransitionFunctionsTableComponent implements  OnDestroy, OnInit {

  public triggerMode: string;

  public isBooleanBasisMode: boolean;

  public readonly displayedColumns: string[] = ['id', 'function'];

  public dataSource: MatTableDataSource<{ id: number, function: App.Expression }> = new MatTableDataSource();

  private _booleanFunctions: { id: number, function: App.Expression }[] = [];
  private _shefferFunctions: { id: number, function: App.Expression }[] = [];

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

    this._codingAlgorithmsService.transitionBooleanFunctions$
      .takeUntil(this._destroy$$)
      .subscribe((transitionBooleanFunctions) => {
        this._booleanFunctions = [];
        this._shefferFunctions = [];

        for (let i: number = 1; i <= transitionBooleanFunctions.size; i++) {
          const expression = transitionBooleanFunctions.get(i);

          this._booleanFunctions[i - 1] = { id: i, function: expression };
          this._shefferFunctions[i - 1] = { id: i, function: this._codingAlgorithmsService.convertToShefferBasis(expression) };
        }

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
