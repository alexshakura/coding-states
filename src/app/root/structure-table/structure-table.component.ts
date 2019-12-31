import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { BaseComponent } from '@app/shared/_helpers/base-component';
import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';
import { TableDataService } from '../_services/table-data.service';
import { ITableConfig, ITableRow } from '@app/types';
import { ConditionSignalOperand, OutputSignalOperand, StateOperand } from '@app/models';
import { MatSort } from '@angular/material/sort';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FsmType } from '@app/enums';
import { FormControl } from '@angular/forms';
import { DISPLAYED_COLUMNS, ROWS_PER_PAGE } from './structure-table.constants';
import { PaginatorComponent } from '@app/shared/_components/paginator/paginator.component';
import { SignalOperandGeneratorService } from '../_services/signal-operand-generator.service';

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
    this.states = this.signalOperandGeneratorService.getStates();
    this.conditionalSignals = this.signalOperandGeneratorService.getConditionalSignals();
    this.outputSignals = this.signalOperandGeneratorService.getOutputSignals();

    this.isMuraFsm = config.fsmType === FsmType.MURA;
  }

  @Input() public readonly isCoded: boolean;

  @Input() public readonly editModeControl: FormControl;

  @Output() public readonly onUpdate: EventEmitter<ITableRow[]> = new EventEmitter<ITableRow[]>();

  public states: Map<number, StateOperand>;
  public conditionalSignals: Map<number, ConditionSignalOperand>;
  public outputSignals: Map<number, OutputSignalOperand>;

  public isMuraFsm: boolean;

  public capacity: number;

  public dataSource: MatTableDataSource<ITableRow> = new MatTableDataSource();

  public readonly displayedColumns: string[] = DISPLAYED_COLUMNS;

  public readonly rowsPerPage: number = ROWS_PER_PAGE;

  @ViewChild(PaginatorComponent, { static: true })
  public readonly tablePaginator: PaginatorComponent;

  @ViewChild(MatSort, { static: true })
  public readonly sort: MatSort;

  public constructor(
    private readonly codingAlgorithmsService: CodingAlgorithmsService,
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService,
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
        takeUntil(this.destroy$$)
      )
      .subscribe(([codedTableData, capacity]: [ITableRow[], number]) => {
        this.dataSource.data = codedTableData.map((tableRow: ITableRow) => ({ ...tableRow }));
        this.capacity = capacity;
      });

    this.dataSource.sortingDataAccessor = (item: ITableRow, property: string): number => {
      switch (property) {
        case 'srcState':
          return item.srcStateId || -1;
        case 'distState':
          return item.distStateId || -1;
        default:
          return -1;
      }
    };
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.tablePaginator;
    this.dataSource.sort = this.sort;
  }

  public selectSrcState(row: ITableRow, value: StateOperand): void {
    row.srcStateId = value.id;
    this.emitTableUpdate();
  }

  public selectDistState(row: ITableRow, value: StateOperand): void {
    row.distStateId = value.id;
    this.emitTableUpdate();
  }

  public onSignalsListChange(selectedIds: Set<number>, signalId: number): void {
    if (selectedIds.has(signalId)) {
      selectedIds.delete(signalId);
    } else {
      selectedIds.add(signalId);
    }

    this.emitTableUpdate();
  }

  public onUnconditionalTransitionChange(row: ITableRow): void {
    row.unconditionalTransition = !row.unconditionalTransition;
    row.conditionalSignalsIds.clear();

    this.emitTableUpdate();
  }

  public isConditionalsItemDisabled(row: ITableRow, item: ConditionSignalOperand): boolean {
    const checkId = item.inverted
      ? item.id - 1
      : item.id + 1;

    return row.conditionalSignalsIds.has(checkId);
  }

  public formatStateCode(value: number): string {
    return this.tableDataService.formatStateCode(value, this.capacity);
  }

  public getConditionalSignal(id: number): ConditionSignalOperand {
    return this.conditionalSignals.get(id) as ConditionSignalOperand;
  }

  public emitTableUpdate(): void {
    this.onUpdate.emit(this.dataSource.data);
  }
}
