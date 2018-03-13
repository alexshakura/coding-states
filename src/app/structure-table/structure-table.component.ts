import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';


@Component({
  selector: 'app-structure-table',
  templateUrl: './structure-table.component.html',
  styleUrls: ['./structure-table.component.css']
})
export class StructureTableComponent implements OnInit, AfterViewInit {
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public readonly displayedColumns: string[] = [];

  @ViewChild(MatPaginator)
  public paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
