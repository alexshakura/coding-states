import { AfterViewInit, Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TableDataService } from '../services/table-data.service';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';

import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-structure-table',
  templateUrl: './structure-table.component.html',
  styleUrls: ['./structure-table.component.css'],
  host: { class: 'component-wrapper' }
})
export class StructureTableComponent implements OnInit, OnDestroy, AfterViewInit {
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

  public editMode: boolean = true;

  public states: number[] = [];
  public conditionalSignals: App.ConditionalSignal[] = [];
  public outputSignals: number[] = [];

  public bitStateCapacity: number;

  @ViewChild(MatSort) public readonly sort: MatSort;

  public dataSource: MatTableDataSource<App.TableRow> = new MatTableDataSource();

  public readonly displayedColumns: string[] = [
    'num',
    'srcState',
    'codeSrcState',
    'distState',
    'codeDistState',
    'x',
    'y',
    'f'
  ];

  @ViewChild('myPaginator')
  public myPaginator: MatPaginator;

  private _destroy$$: Subject<void> = new Subject<void>();

  public constructor(
    private _tableDataService: TableDataService,
    private _codingAlgorithmsService: CodingAlgorithmsService
  ) { }

  public ngOnInit(): void {
    this.dataSource.data = this._tableDataService.getMockDataForUnitaryD();
    this.emitTableUpdate();

    this._codingAlgorithmsService.vertexCodes$
      .takeUntil(this._destroy$$)
      .subscribe((vertexCodes: App.TVertexData) => {
        this.dataSource.data.forEach((tableRow: App.TableRow) => {
          tableRow.codeSrcState = vertexCodes.get(tableRow.srcState);
          tableRow.codeDistState = vertexCodes.get(tableRow.distState);
          tableRow.f = vertexCodes.get(tableRow.distState);
        });

        this.bitStateCapacity = vertexCodes.size;
      });
   }

   public ngOnDestroy(): void {
     this._destroy$$.next();
     this._destroy$$.complete();
   }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.myPaginator;
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

    this.emitTableUpdate();
  }

  public selectSignal(value: number, signalContainer: Set<number | App.ConditionalSignal>): void {
    signalContainer.has(value)
      ? signalContainer.delete(value)
      : signalContainer.add(value);

    this.emitTableUpdate();
  }

  public isStateCodeExist(stateCode: number): boolean {
    return typeof stateCode === 'number';
  }

  public formatStateCode(stateCode: number): string {
    return this._tableDataService.formatStateCode(stateCode, this.bitStateCapacity);
  }

  public emitTableUpdate(): void {
    this._tableDataService.emitUpdatedTableData(this.dataSource.data);
  }
}
