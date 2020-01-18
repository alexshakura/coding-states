import { Component, OnInit } from '@angular/core';
import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';
import { BaseComponent } from '@app/shared/_helpers/base-component';
import { IOutputFunctionsDataCell } from '@app/types';
import { takeUntil } from 'rxjs/operators';
import { DISPLAYED_COLUMNS } from './output-functions-table.constants';

@Component({
  selector: 'app-output-functions-table',
  templateUrl: './output-functions-table.component.html',
  host: { class: 'component-wrapper' },
})
export class OutputFunctionsTableComponent extends BaseComponent implements OnInit {

  public readonly displayedColumns: string[] = DISPLAYED_COLUMNS;

  public dataSource: IOutputFunctionsDataCell[];

  public isBooleanBasisShown: boolean = true;

  public constructor(
    private readonly codingAlgorithmsService: CodingAlgorithmsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.codingAlgorithmsService.outputFunctions$
      .pipe(
        takeUntil(this.destroy$$)
      )
      .subscribe((outputFunctions) => {
        this.dataSource = outputFunctions;
      });
  }

}
