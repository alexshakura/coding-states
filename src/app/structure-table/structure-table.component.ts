import { AfterViewInit, Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TableDataService } from '../services/table-data.service';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';

import { BaseComponent } from '../shared/base-component';


@Component({
  selector: 'app-structure-table',
  templateUrl: './structure-table.component.html',
  host: { class: 'component-wrapper' }
})
export class StructureTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input('tableConfig') public set defineTableData(tableConfig: App.ITableConfig) {
    if (!this._tableConfig || this._tableDataService.shouldResetTableData(tableConfig, this._tableConfig)) {
      this.dataSource.data = this._tableDataService.generateRaw(tableConfig.length);
    } else {
      this.dataSource.data = this._tableDataService.rearrangeTableData(this.dataSource.data, tableConfig.length);
    }

    this.states = this._tableDataService.generateStates(tableConfig.numberOfStates);
    this.conditionalSignals = this._tableDataService.generateConditionalSignals(tableConfig.numberOfX);
    this.outputSignals = this._tableDataService.generateOutputSignals(tableConfig.numberOfY);

    this._tableConfig = tableConfig;

    this.emitTableUpdate();
  }

  private _tableConfig: App.ITableConfig;

  @Input() public set disabled(isDisabled: boolean) {
    this.editMode = !isDisabled;
    this._disabled = isDisabled;
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  private _disabled: boolean = false;

  public editMode: boolean = true;

  public states: App.ISignalOperand[] = [];
  public conditionalSignals: App.ISignalOperand[] = [];
  public outputSignals: number[] = [];

  public capacity: number;

  @ViewChild(MatSort) public readonly sort: MatSort;

  public dataSource: MatTableDataSource<App.ITableRow> = new MatTableDataSource();

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


  public constructor(
    private _tableDataService: TableDataService,
    private _codingAlgorithmsService: CodingAlgorithmsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.dataSource.data = this._tableDataService.getMockDataForUnitaryD();
    this.emitTableUpdate();

    this._codingAlgorithmsService.vertexCodes$
      .combineLatest(this._codingAlgorithmsService.capacity$)
      .takeUntil(this._destroy$$)
      .subscribe(([vertexCodes, capacity]: [App.TVertexData, number]) => {
        this.dataSource.data.forEach((tableRow: App.ITableRow) => {
          tableRow.codeSrcState = vertexCodes.get(tableRow.srcState.id);
          tableRow.codeDistState = vertexCodes.get(tableRow.distState.id);
          tableRow.f = tableRow.codeDistState;
        });

        this.capacity = capacity;
      });
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.myPaginator;
    this.dataSource.sort = this.sort;
  }

  public getSignalsIterator(signalContainer: Set<number | App.ISignalOperand>): (number | App.ISignalOperand)[] {
    return Array.from(signalContainer);
  }

  public isConditionalSignalDisabled(
    tableRow: { unconditionalX: boolean, x: Set<App.ISignalOperand> },
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

  public selectSignal(value: number, signalContainer: Set<number | App.ISignalOperand>): void {
    signalContainer.has(value)
      ? signalContainer.delete(value)
      : signalContainer.add(value);

    this.emitTableUpdate();
  }

  public isStateCodeExist(stateCode: number): boolean {
    return typeof stateCode === 'number';
  }

  public formatStateCode(stateCode: number): string {
    return this._tableDataService.formatStateCode(stateCode, this.capacity);
  }

  public isMuraFsm(): boolean {
    return this._tableConfig.fsmType === TableDataService.MURA_FSM_TYPE;
  }

  public emitTableUpdate(): void {
    this._tableDataService.emitUpdatedTableData(this.dataSource.data);
  }
}
