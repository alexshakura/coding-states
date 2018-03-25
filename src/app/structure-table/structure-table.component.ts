import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TableDataService } from '../services/table-data.service';


@Component({
  selector: 'app-structure-table',
  templateUrl: './structure-table.component.html',
  styleUrls: ['./structure-table.component.css']
})
export class StructureTableComponent implements OnInit, AfterViewInit {
  @Input('tableConfig') public set defineTableData(tableConfig: App.TableConfig) {
    if (!this._tableConfig || this._tableDataService.shouldResetTableData(tableConfig, this._tableConfig)) {
      this.dataSource.data = this._tableDataService.generateRaw(tableConfig.length);
    } else {
      this.dataSource.data = this._tableDataService.rearrangeTableData(this.dataSource.data, tableConfig.length);
    }

    this.states = this._tableDataService.generateStates(tableConfig.numberOfStates);
    this.conditionalSignals = this._tableDataService.generateConditionalSignals(tableConfig.numberOfX);
    this.outputSignals = this._tableDataService.generateOutputSignals(tableConfig.numberOfY);

    this.bitStateCapacity = Math.ceil(Math.log2(tableConfig.length));

    this._tableConfig = tableConfig;
  }

  private _tableConfig: App.TableConfig;

  public editMode: boolean = false;

  public states: number[] = [];
  public conditionalSignals: App.ConditionalSignal[] = [];
  public outputSignals: number[] = [];

  public bitStateCapacity: number;

  @ViewChild(MatSort) public readonly sort: MatSort;

  public dataSource: MatTableDataSource<App.TableRowData> = new MatTableDataSource();

  public readonly displayedColumns: string[] = [
    'num',
    'srcState',
    'codeSrcState',
    'distState',
    'codeDistState',
    'x',
    'y',
    // 'f'
  ];

  @ViewChild(MatPaginator)
  public paginator: MatPaginator;

  public constructor(
    private _tableDataService: TableDataService
  ) { }

  public ngOnInit(): void {

   }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public getSignalsIterator(signalContainer: Set<number | App.ConditionalSignal>): (number | App.ConditionalSignal)[] {
    return Array.from(signalContainer);
  }

  public isConditionalSignalDisabled(
    tableRow: { unconditionalX: boolean, x: Set<App.ConditionalSignal> },
    currentIndex: number,
    isInverted: boolean
  ): boolean {
    const index: number = isInverted
      ? currentIndex - 1
      : currentIndex + 1;

    return tableRow.unconditionalX || tableRow.x.has(this.conditionalSignals[index]);
  }

  public toggleUnconditionalSignal(tableRow): void {
    tableRow.unconditionalX = !tableRow.unconditionalX;
    tableRow.x.clear();
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
