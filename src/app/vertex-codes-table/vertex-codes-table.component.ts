import { Component, OnInit, ViewEncapsulation, state } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material';
import { TableDataService } from '../services/table-data.service';

@Component({
  selector: 'app-vertex-codes-table',
  templateUrl: './vertex-codes-table.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./vertex-codes-table.component.scss'],
  host: { class: 'component-wrapper vertex-codes-table' }
})
export class VertexCodesTableComponent implements OnInit {

  public readonly displayedColumns: string[] = ['id', 'code'];

  public dataSource: DataSource<{}> = new MatTableDataSource([
    {
      id: 1,
      code: 3
    },
    {
      id: 3,
      code: 4
    }
  ]);

  public constructor(
    private _tableDataService: TableDataService
  ) { }

  ngOnInit() {
  }

  public formatStateCode(stateCode: number): string {
    return this._tableDataService.formatStateCode(stateCode, 3);
  }

}
