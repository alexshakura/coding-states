import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';


@Component({
  selector: 'app-structure-table',
  templateUrl: './structure-table.component.html',
  styleUrls: ['./structure-table.component.css']
})
export class StructureTableComponent implements OnInit, AfterViewInit {
  @Input() public readonly tableLength: number = 8;

  public editMode: boolean = true;

  public editForm;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource([
    {
      num: 1,
      srcState: 1,
      codeSrcState: 0,
      distState: 2,
      codeDistState: 1,
      x: '',
      y: '',
      f: ''
    }
  ]);

  public readonly displayedColumns: string[] = [
    'num',
    'srcState',
    'codeSrcState',
    // 'distState',
    // 'codeDistState',
    // 'x',
    // 'y',
    // 'f'
  ];

  @ViewChild(MatPaginator)
  public paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public formatCodingState(codingState: number): string {
    const formattedCodingState: string = codingState.toString(2);
    const bitStateCapacity: number = Math.ceil(Math.log2(this.tableLength));

    return '0'.repeat(bitStateCapacity - formattedCodingState.length) + formattedCodingState;
  }
}
