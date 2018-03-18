import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';


@Component({
  selector: 'app-structure-table',
  templateUrl: './structure-table.component.html',
  styleUrls: ['./structure-table.component.css']
})
export class StructureTableComponent implements OnInit, AfterViewInit {
  @Input() public readonly tableData: App.TableData;

  public editMode: boolean = true;

  public states: number[] = [];
  public conditionalSignals: App.ConditionalSignal[] = [];
  public outputSignals: number[] = [];

  public bitStateCapacity: number;

  public editForm;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource([
    {
      num: 1,
      srcState: 1,
      codeSrcState: 0,
      distState: 2,
      codeDistState: 1,
      x: new Set(),
      unconditionalX: false,
      y: new Set(),
      f: ''
    }
  ]);

  public readonly displayedColumns: string[] = [
    'num',
    'srcState',
    'codeSrcState',
    // 'distState',
    // 'codeDistState',
    'x',
    'y',
    // 'f'
  ];

  @ViewChild(MatPaginator)
  public paginator: MatPaginator;

  constructor() { }

  public ngOnInit(): void {
    this.states = new Array(this.tableData.numberOfStates)
      .fill(1)
      .map((val: number, index: number) => index + 1);

    this.bitStateCapacity = Math.ceil(Math.log2(this.tableData.length));

    for (let i: number = 0; i < this.tableData.numberOfX ; i++) {
      this.conditionalSignals.push(
        { id: i + 1, inverted: false },
        { id: i + 1, inverted: true }
      );
    }

    this.outputSignals = new Array(this.tableData.numberOfY)
      .fill(1)
      .map((val: number, index: number) => index + 1);
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public getSignalsIterator(signalContainer: Set<number | App.ConditionalSignal>): (number | App.ConditionalSignal)[] {
    return Array.from(signalContainer);
  }

  public isConditionalSignalDisabled(tableRow: { unconditionalX: boolean, x: Set<App.ConditionalSignal> }, currentIndex: number, isInverted: boolean): boolean {
    return tableRow.unconditionalX
      || (isInverted && tableRow.x.has(this.conditionalSignals[currentIndex - 1]))
      || tableRow.x.has(this.conditionalSignals[currentIndex + 1]);
  }

  public selectSignal(value: number, signalContainer: Set<number | App.ConditionalSignal>): void {
    signalContainer.has(value)
      ? signalContainer.delete(value)
      : signalContainer.add(value);
  }

  public formatCodingState(codingState: number): string {
    const formattedCodingState: string = codingState.toString(2);

    return '0'.repeat(this.bitStateCapacity - formattedCodingState.length) + formattedCodingState;
  }
}
