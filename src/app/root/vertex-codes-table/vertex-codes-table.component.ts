import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableDataService } from '../services/table-data.service';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';

import { BaseComponent } from '../../shared/base-component';
import { TVertexData } from '@app/types';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vertex-codes-table',
  templateUrl: './vertex-codes-table.component.html',
  host: { class: 'component-wrapper' },
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
    combineLatest([
      this._codingAlgorithmsService.vertexCodes$,
      this._codingAlgorithmsService.capacity$,
    ])
      .pipe(
        takeUntil(this._destroy$$)
      )
      .subscribe(([vertexCodes, capacity]: [TVertexData, number]) => {
        const newData: { id: number, code: number }[] = [];

        vertexCodes.forEach((value, key) => newData.push({ id: key, code: value }));

        this.dataSource.data = newData;
        this.capacity = capacity;
      });

    this._codingAlgorithmsService.triggerMode$
      .pipe(
        takeUntil(this._destroy$$)
      )
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
