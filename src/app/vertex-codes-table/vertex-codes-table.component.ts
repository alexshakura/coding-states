import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TableDataService } from '../services/table-data.service';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';

import { BaseComponent } from '../shared/base-component';
import { TVertexData } from '../../types/helper-types';


@Component({
  selector: 'app-vertex-codes-table',
  templateUrl: './vertex-codes-table.component.html',
  host: { class: 'component-wrapper' }
})
export class VertexCodesTableComponent extends BaseComponent implements OnInit {

  public readonly displayedColumns: string[] = ['id', 'code'];

  public dataSource: MatTableDataSource<{ id: number, code: number }> = new MatTableDataSource();
  public capacity: number;

  public triggerMode: string;

  public constructor(
    private _tableDataService: TableDataService,
    private _codingAlgorithmsService: CodingAlgorithmsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this._codingAlgorithmsService.vertexCodes$
      .combineLatest(this._codingAlgorithmsService.capacity$)
      .takeUntil(this._destroy$$)
      .subscribe(([vertexCodes, capacity]: [TVertexData, number]) => {
        const newData = [];

        vertexCodes.forEach((value, key) => newData.push({ id: key, code: value }));

        this.dataSource.data = newData;
        this.capacity = capacity;
      });

    this._codingAlgorithmsService.triggerMode$
      .takeUntil(this._destroy$$)
      .subscribe((triggerMode: string) => {
        this.triggerMode = triggerMode;
      });
  }

  public formatStateCode(stateCode: number): string {
    return this._tableDataService.formatStateCode(stateCode, this.capacity);
  }

  public isTriggerModeD(): boolean {
    return this.triggerMode === CodingAlgorithmsService.D_TRIGGER_MODE;
  }
}
