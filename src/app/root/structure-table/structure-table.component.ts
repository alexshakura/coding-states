import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { OverlayContainer } from '@angular/cdk/overlay';

import { BaseComponent } from '../../shared/base-component';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';
import { TableDataService } from '../services/table-data.service';
import { ITableConfig, ITableRow } from '@app/types';
import { SignalOperand } from '../../shared/expression/signal-operand';
import { MatSort } from '@angular/material/sort';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FsmType } from '@app/enums';

@Component({
  selector: 'app-structure-table',
  templateUrl: './structure-table.component.html',
  host: { class: 'component-wrapper' },
})
export class StructureTableComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Input('tableConfig') public set defineTableData(tableConfig: ITableConfig) {
    if (!this._tableConfig || this._tableDataService.shouldResetTableData(tableConfig, this._tableConfig)) {
      this.dataSource.data = this._tableDataService.generateRaw(tableConfig.length);
    } else {
      this.dataSource.data = this._tableDataService.rearrangeTableData(this.dataSource.data, tableConfig.length);
    }

    this.states = this._tableDataService.generateStates(tableConfig.numberOfStates);
    this.conditionalSignals = this._tableDataService.generateConditionalSignals(tableConfig.numberOfX);
    this.outputSignals = this._tableDataService.generateOutputSignals(tableConfig.numberOfY);

    this.dataSource.data = this._tableDataService.reconnectTableData(this.dataSource.data);

    this._tableConfig = tableConfig;

    this.emitTableUpdate();
  }

  private _tableConfig: ITableConfig;

  @Input() public set disabled(isDisabled: boolean) {
    this.editMode = !isDisabled;
    this._disabled = isDisabled;
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  private _disabled: boolean = false;

  public editMode: boolean = true;

  public states: SignalOperand[] = [];
  public conditionalSignals: SignalOperand[] = [];
  public outputSignals: number[] = [];

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

  public readonly MENU_ITEM_HEIGHT: string = '48px';

  public constructor(
    private _codingAlgorithmsService: CodingAlgorithmsService,
    private _overlayContainer: OverlayContainer,
    private _tableDataService: TableDataService
  ) {
    super();
  }

  public ngOnInit(): void {
    combineLatest([
      this._codingAlgorithmsService.codedTableData$,
      this._codingAlgorithmsService.capacity$,
    ])
      .pipe(
        takeUntil(this._destroy$$)
      )
      .subscribe(([codedTableData, capacity]: [ITableRow[], number]) => {
        this.dataSource.data = codedTableData.map((tableRow: ITableRow) => ({ ...tableRow }));
        this.capacity = capacity;
      });

    this.dataSource.sortingDataAccessor = (item: ITableRow, property: string) => {
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

  public getSignalsIterator(signalContainer: Set<number | SignalOperand>): (number | SignalOperand)[] {
    return Array.from(signalContainer);
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

  public isStateCodeExist(stateCode: number): boolean {
    return typeof stateCode === 'number';
  }

  public formatStateCode(stateCode: number): string {
    return this._tableDataService.formatStateCode(stateCode, this.capacity);
  }

  public isMuraFsm(): boolean {
    return this._tableConfig.fsmType === FsmType.MURA;
  }

  public onMenuOpen(menuPanelClass: string): void {
    setTimeout(() => {
      const overlayContainer: HTMLDivElement = this._overlayContainer.getContainerElement() as HTMLDivElement;

      const menuPanel = overlayContainer.querySelector(`.${menuPanelClass}`) as HTMLDivElement;
      const pane = menuPanel.parentElement as HTMLDivElement;

      const paneTop = pane.style.top || pane.style.bottom as string;

      // Had to dynamically set max-height so menu will fit to screen size
      menuPanel.style.maxHeight = `calc(100vh - ${paneTop} - ${this.MENU_ITEM_HEIGHT}`;
    });
  }

  public getStateMenuPanelClass(rowId: number, isSrc: boolean): string {
    const preffix: string = isSrc
      ? 'src'
      : 'dest';

    return `${preffix}-state-panel-${rowId}`;
  }

  public getConditionalMenuPanelClass(rowId: number): string {
    return `condition-panel-${rowId}`;
  }

  public getOutputMenuPanelClass(rowId: number): string {
    return `output-panel-${rowId}`;
  }

  public emitTableUpdate(): void {
    this._tableDataService.emitUpdatedTableData(this.dataSource.data);
  }
}
