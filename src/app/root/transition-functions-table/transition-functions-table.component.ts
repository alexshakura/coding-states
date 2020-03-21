import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';
import { IExcitationFunctionsDataCell, ITableConfig } from '@app/types';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@app/shared/_helpers/base-component';
import { DISPLAYED_COLUMNS } from './transition-functions-table.constants';
import { TriggerType } from '@app/enums';

@Component({
  selector: 'app-transition-functions-table',
  templateUrl: './transition-functions-table.component.html',
  host: { class: 'component-wrapper' },
})
export class TransitionFunctionsTableComponent extends BaseComponent implements OnDestroy, OnInit {

  @Input() public readonly tableConfig: ITableConfig;

  public readonly displayedColumns: string[] = DISPLAYED_COLUMNS;

  public readonly triggerTypes: typeof TriggerType = TriggerType;

  public dataSource: IExcitationFunctionsDataCell[];

  public isBooleanBasisShown: boolean = true;

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
        this.dataSource = transitionFunctions;
      });
  }

}
