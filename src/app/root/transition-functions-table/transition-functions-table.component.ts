import { Component, OnDestroy, OnInit } from '@angular/core';
import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Expression } from '@app/models';
import { IFunctions } from '@app/types';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-transition-functions-table',
  templateUrl: './transition-functions-table.component.html',
  host: { class: 'component-wrapper' },
})
export class TransitionFunctionsTableComponent implements  OnDestroy, OnInit {

  public triggerMode: string;

  public isBooleanBasisMode: boolean = true;

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
      .pipe(
        takeUntil(this._destroy$$)
      )
      .subscribe((triggerMode: string) => {
        this.triggerMode = triggerMode;
      });

    this._codingAlgorithmsService.transitionFunctions$
      .pipe(
        takeUntil(this._destroy$$)
      )
      .subscribe((transitionBooleanFunctions: IFunctions) => {
        this._booleanFunctions = [];
        this._shefferFunctions = [];

        transitionBooleanFunctions.boolean.forEach((value, key) => {
          this._booleanFunctions.push({ id: key, function: value });
        });

        transitionBooleanFunctions.sheffer.forEach((value, key) => {
          this._shefferFunctions.push({ id: key, function: value });
        });

        this._setBasisMode(true);
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

    this._setBasisMode(isBooleanBasisMode);
  }

  private _setBasisMode(isBooleanBasisMode: boolean): void {
    this.isBooleanBasisMode = isBooleanBasisMode;

    this.dataSource.data = this.isBooleanBasisMode
      ? [...this._booleanFunctions]
      : [...this._shefferFunctions];
  }
}
