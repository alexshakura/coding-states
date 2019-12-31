import { Component, OnInit } from '@angular/core';
import { TableDataService } from '../_services/table-data.service';
import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';

import { BaseComponent } from '@app/shared/_helpers/base-component';
import { map, takeUntil } from 'rxjs/operators';
import { DISPLAYED_COLUMNS } from './vertex-codes-table.constants';
import { SignalOperandGeneratorService } from '../_services/signal-operand-generator.service';
import { StateOperand } from '@app/models';

@Component({
  selector: 'app-vertex-codes-table',
  templateUrl: './vertex-codes-table.component.html',
  host: { class: 'component-wrapper' },
})
export class VertexCodesTableComponent extends BaseComponent implements OnInit {

  public readonly displayedColumns: string[] = DISPLAYED_COLUMNS;

  public dataSource: { state: StateOperand, code: number }[] = [];

  public capacity: number;

  public constructor(
    private readonly tableDataService: TableDataService,
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService,
    private readonly codingAlgorithmsService: CodingAlgorithmsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.codingAlgorithmsService.vertexCodes$
      .pipe(
        map((vertexCodesMap) => this.getDataSource(vertexCodesMap)),
        takeUntil(this.destroy$$)
      )
      .subscribe((dataSource) => this.dataSource = dataSource);

    this.codingAlgorithmsService.capacity$
      .pipe(takeUntil(this.destroy$$))
      .subscribe((capacity) => this.capacity = capacity);
  }

  private getDataSource(vertexCodesMap: Map<number, number>): { state: StateOperand, code: number }[] {
    const statesMap = this.signalOperandGeneratorService.getStates();

    return Array.from(vertexCodesMap.entries())
      .sort(([leftStateId, _leftVertexCode], [rightStateId, _rightVertexCode]) => {
        const leftState = statesMap.get(leftStateId) as StateOperand;
        const rightState = statesMap.get(rightStateId) as StateOperand;

        if (leftState.index > rightState.index) {
          return 1;
        }

        if (rightState.index > leftState.index) {
           return -1;
         }

        return 0;
      })
      .map(([id, code]) => {
        return {
          state: statesMap.get(id) as StateOperand,
          code,
        };
      });
  }

  public formatStateCode(stateCode: number): string {
    return this.tableDataService.formatStateCode(stateCode, this.capacity);
  }

}
