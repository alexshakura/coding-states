import { Component, OnInit } from '@angular/core';
import { TableDataService } from '../_services/table-data.service';
import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';

import { BaseComponent } from '@app/shared/_helpers/base-component';
import { TVertexData } from '@app/types';
import { map, takeUntil } from 'rxjs/operators';
import { DISPLAYED_COLUMNS } from './vertex-codes-table.constants';

@Component({
  selector: 'app-vertex-codes-table',
  templateUrl: './vertex-codes-table.component.html',
  host: { class: 'component-wrapper' },
})
export class VertexCodesTableComponent extends BaseComponent implements OnInit {

  public readonly displayedColumns: string[] = DISPLAYED_COLUMNS;

  public dataSource: { id: number, code: number }[] = [];
  public capacity: number;

  public constructor(
    private readonly tableDataService: TableDataService,
    private readonly codingAlgorithmsService: CodingAlgorithmsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.codingAlgorithmsService.vertexCodes$
      .pipe(
        map((vertexCodes: TVertexData) => {
          const newData: { id: number, code: number }[] = [];

          vertexCodes.forEach((value, key) => newData.push({ id: key, code: value }));

          return newData;
        }),
        takeUntil(this.destroy$$)
      )
      .subscribe((newData) => this.dataSource = newData);

    this.codingAlgorithmsService.capacity$
      .pipe(takeUntil(this.destroy$$))
      .subscribe((capacity) => this.capacity = capacity);
  }

  public formatStateCode(stateCode: number): string {
    return this.tableDataService.formatStateCode(stateCode, this.capacity);
  }

}
