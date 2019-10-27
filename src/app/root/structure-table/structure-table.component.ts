import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { BaseComponent } from '../../shared/base-component';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';
import { TableDataService } from '../services/table-data.service';
import { ITableConfig, ITableRow } from '@app/types';
import { SignalOperand } from '../../shared/expression/signal-operand';
import { MatSort } from '@angular/material/sort';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FsmType } from '@app/enums';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-structure-table',
  templateUrl: './structure-table.component.html',
  host: { class: 'component-wrapper' },
})
export class StructureTableComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Input() public set data(value: ITableRow[]) {
    this.dataSource.data = value;
  }

  @Input() public set config(config: ITableConfig) {
    this.states = this.tableDataService.generateStates(config.numberOfStates);
    this.conditionalSignals = this.tableDataService.generateConditionalSignals(config.numberOfX);
    this.outputSignals = this.tableDataService.generateOutputSignals(config.numberOfY);

    this.isMuraFsm = config.fsmType === FsmType.MURA;
  }

  @Input() public readonly isCoded: boolean;

  @Input() public readonly editModeControl: FormControl;

  @Output() public readonly onUpdate: EventEmitter<ITableRow[]> = new EventEmitter<ITableRow[]>();

  public states: SignalOperand[] = [];
  public conditionalSignals: SignalOperand[] = [];
  public outputSignals: number[] = [];

  public isMuraFsm: boolean;

  public capacity: number;

  @ViewChild(MatSort, { static: true }) public readonly sort: MatSort;

  public dataSource: MatTableDataSource<ITableRow> = new MatTableDataSource();

  public readonly displayedColumns: string[] = [
    'num',
    'srcState',
    'codeSrcState',
    'distState',
    'codeDistState',
    'x',
    'y',
    'f',
  ];

  @ViewChild('myPaginator', { static: true })
  public myPaginator: MatPaginator;

  public constructor(
    private readonly codingAlgorithmsService: CodingAlgorithmsService,
    private readonly tableDataService: TableDataService
  ) {
    super();
  }

  public ngOnInit(): void {
    combineLatest([
      this.codingAlgorithmsService.codedTableData$,
      this.codingAlgorithmsService.capacity$,
    ])
      .pipe(
        takeUntil(this._destroy$$)
      )
      .subscribe(([codedTableData, capacity]: [ITableRow[], number]) => {
        this.dataSource.data = codedTableData.map((tableRow: ITableRow) => ({ ...tableRow }));
        this.capacity = capacity;
      });

    this.dataSource.sortingDataAccessor = (item: ITableRow, property: string): number => {
      switch (property) {
        case 'srcState':
        case 'distState':
          const state = item[property];
          return (state && state.id) || -1;
        default:
        return -1;
      }
    };
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.myPaginator;
    this.dataSource.sort = this.sort;
  }

  public isConditionalSignalDisabled(
    tableRow: { unconditionalX: boolean, x: Set<SignalOperand> },
    currentIndex: number,
    isInverted: boolean
  ): boolean {
    const index: number = isInverted
      ? currentIndex - 1
      : currentIndex + 1;

    return tableRow.unconditionalX || tableRow.x.has(this.conditionalSignals[index]);
  }

  public toggleUnconditionalSignal(tableRow: ITableRow): void {
    tableRow.unconditionalX = !tableRow.unconditionalX;
    tableRow.x.clear();

    this.emitTableUpdate();
  }

  public selectSignal(value: number, signalContainer: Set<number | SignalOperand>): void {
    signalContainer.has(value)
      ? signalContainer.delete(value)
      : signalContainer.add(value);

    this.emitTableUpdate();
  }

  public formatStateCode(stateCode: number): string {
    return this.tableDataService.formatStateCode(stateCode, this.capacity);
  }

  public emitTableUpdate(): void {
    this.onUpdate.emit(this.dataSource.data);
  }
}
