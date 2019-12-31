import { Component, OnDestroy, OnInit } from '@angular/core';
import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';
import { IFunctions, ITransitionFunctionsDataCell } from '@app/types';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@app/shared/_helpers/base-component';
import { DISPLAYED_COLUMNS } from './transition-functions-table.constants';

@Component({
  selector: 'app-transition-functions-table',
  templateUrl: './transition-functions-table.component.html',
  host: { class: 'component-wrapper' },
})
export class TransitionFunctionsTableComponent extends BaseComponent implements OnDestroy, OnInit {

  public readonly displayedColumns: string[] = DISPLAYED_COLUMNS;

  public dataSource: ITransitionFunctionsDataCell[];

  public isBooleanBasisShown: boolean = true;

  private booleanFunctions: ITransitionFunctionsDataCell[];
  private shefferFunctions: ITransitionFunctionsDataCell[];

  public constructor(
    private readonly codingAlgorithmsService: CodingAlgorithmsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.codingAlgorithmsService.transitionFunctions$
      .pipe(
        takeUntil(this.destroy$$)
      )
      .subscribe((transitionFunctions) => {
        this.fillBasisFunctions(transitionFunctions);
        this.toggleBasis(true);
      });
  }

  private fillBasisFunctions(transitionFunctions: IFunctions): void {
    this.booleanFunctions = [];
    this.shefferFunctions = [];

    transitionFunctions.boolean.forEach((expression, index) => {
      this.booleanFunctions.push({
        function: expression,
        index,
      });
    });

    transitionFunctions.sheffer.forEach((expression, index) => {
      this.shefferFunctions.push({
        function: expression,
        index,
      });
    });
  }

  public toggleBasis(isBooleanBasis: boolean): void {
    this.isBooleanBasisShown = isBooleanBasis;

    this.dataSource = this.isBooleanBasisShown
      ? this.booleanFunctions
      : this.shefferFunctions;
  }

}
