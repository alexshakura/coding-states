import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  FrequencyDAlgorithm,
  Fsm,
  MiliFsm,
  MuraFsm,
  NStateAlgorithm,
  UnitaryDAlgorithm,
  VertexCodingAlgorithm,
} from '@app/models';
import { IExcitationFunctionsDataCell, IOutputFunctionsDataCell, ITableConfig, ITableRow, TVertexData } from '@app/types';
import { CodingAlgorithmType, FsmType } from '@app/enums';
import { ValidationError } from '@app/shared/_helpers/validation-error';
import { SignalOperandGeneratorService } from './signal-operand-generator.service';
import { ConditionalsFlowValidatorService } from './conditionals-flow-validator.service';

@Injectable()
export class CodingAlgorithmsService {

  private static readonly DEFAULT_TIMEOUT: number = 1000;

  public get vertexCodes$(): Observable<TVertexData> {
    return this._vertexCodes$$.asObservable();
  }

  private _vertexCodes$$: ReplaySubject<TVertexData> = new ReplaySubject<TVertexData>(1);

  public get outputFunctions$(): Observable<IOutputFunctionsDataCell[]> {
    return this._outputFunctions$$.asObservable();
  }

  private _outputFunctions$$: ReplaySubject<IOutputFunctionsDataCell[]> = new ReplaySubject<IOutputFunctionsDataCell[]>(1);

  public get transitionFunctions$(): Observable<IExcitationFunctionsDataCell[]> {
    return this._transitionFunctions$$.asObservable();
  }

  private _transitionFunctions$$: ReplaySubject<IExcitationFunctionsDataCell[]> = new ReplaySubject<IExcitationFunctionsDataCell[]>(1);

  public get capacity$(): Observable<number> {
    return this._capacity$$.asObservable();
  }

  private _capacity$$: ReplaySubject<number> = new ReplaySubject<number>(1);

  public get codedTableData$(): Observable<ITableRow[]> {
    return this._codedTableData$$.asObservable();
  }

  private _codedTableData$$: ReplaySubject<ITableRow[]> = new ReplaySubject<ITableRow[]>(1);

  public get warning$(): Observable<ValidationError> {
    return this._warning$$.asObservable();
  }

  private _warning$$: Subject<ValidationError> = new Subject<ValidationError>();

  public constructor(
    private readonly conditionalsFlowValidatorService: ConditionalsFlowValidatorService,
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService
  ) { }

  public code(
    selectedAlgorithm: CodingAlgorithmType,
    tableData: ITableRow[],
    tableConfig: Readonly<ITableConfig>
  ): Observable<void> {
    try {
      this.validateData(tableData, tableConfig);

      this.checkConditionalsFlow(tableConfig, tableData);

      const stateCodingAlgorithm = this.getVertexCodingAlgorithm(selectedAlgorithm, tableData);
      const vertexCodeMap = stateCodingAlgorithm.getCodesMap();

      const codedTableData = this.getCodedTableData(tableData, vertexCodeMap);

      const fsm = this.getFsm(tableConfig.fsmType, codedTableData);

      const capacity = this.getCapacity(vertexCodeMap);

      const outputFunction = fsm.getOutputFunctions();
      const excitationFunctions = fsm.getExcitationFunctions(capacity);

      this._capacity$$.next(capacity);
      this._vertexCodes$$.next(vertexCodeMap);

      this._outputFunctions$$.next(outputFunction);
      this._transitionFunctions$$.next(excitationFunctions);

      this._codedTableData$$.next(codedTableData);

      return of(void 0)
        .pipe(
          delay(CodingAlgorithmsService.DEFAULT_TIMEOUT)
        );
    } catch (error) {
      return throwError(error)
        .pipe(
          delay(CodingAlgorithmsService.DEFAULT_TIMEOUT)
        );
    }
  }

  private validateData(tableData: ITableRow[], tableConfig: Readonly<ITableConfig>): void {
    const invalidRowsIds = this.getInvalidTableRowsIds(tableData);
    const NUM_INVALID_ENTITIES_TO_SHOW = 3;

    if (invalidRowsIds.length > 1) {
      throw new ValidationError(
        'ROOT.CODING_ALGORITHM_DIALOG.ERROR_INVALID_ROWS',
        { ids: invalidRowsIds.slice(0, NUM_INVALID_ENTITIES_TO_SHOW).join(', ') }
      );
    }

    if (invalidRowsIds.length === 1) {
      throw new ValidationError(
        'ROOT.CODING_ALGORITHM_DIALOG.ERROR_INVALID_ROW',
        { id: invalidRowsIds[0].toString() }
      );
    }

    if (!this.isAllStatesUsed(tableData, tableConfig.numberOfStates)) {
      throw new ValidationError('ROOT.CODING_ALGORITHM_DIALOG.ERROR_INVALID_USED_STATES_COUNT');
    }
  }

  private checkConditionalsFlow(tableConfig: Readonly<ITableConfig>, tableData: ITableRow[]): void {
    try {
      this.conditionalsFlowValidatorService.validate(tableConfig, tableData);
    } catch (warning) {
      this._warning$$.next(warning);
    }
  }

  private isAllStatesUsed(tableData: ITableRow[], numberOfStates: number): boolean {
    const selectedSrcStateIds = tableData.map((tableRow) => tableRow.srcStateId);
    const selectedDistStateIds = tableData.map((tableRow) => tableRow.distStateId);

    const uniqueSelectedSrcStateIds = new Set(selectedSrcStateIds);
    const uniqueSelectedDistStateIds = new Set(selectedDistStateIds);

    return uniqueSelectedSrcStateIds.size === numberOfStates && uniqueSelectedDistStateIds.size === numberOfStates;
  }

  private getInvalidTableRowsIds(tableData: ITableRow[]): number[] {
    return tableData
      .filter((tableRow: ITableRow) => {
        return !tableRow.distStateId
          || !tableRow.srcStateId
          || (!tableRow.unconditionalTransition && !tableRow.conditionalSignalsIds.size);
      })
      .map((tableRow: ITableRow) => tableRow.id);
  }

  private getVertexCodingAlgorithm(
    selectedAlgorithm: CodingAlgorithmType,
    tableData: ITableRow[]
  ): VertexCodingAlgorithm {
    const algorithmsMap = {
      [CodingAlgorithmType.UNITARY_D_TRIGGER]: UnitaryDAlgorithm,
      [CodingAlgorithmType.FREQUENCY_D_TRIGGER]: FrequencyDAlgorithm,
      [CodingAlgorithmType.STATE_N_D_TRIGGER]: NStateAlgorithm,
    };

    const algorithm = algorithmsMap[selectedAlgorithm];

    return new algorithm(tableData, this.signalOperandGeneratorService.getStates());
  }

  private getFsm(fsmType: FsmType, codedTableData: ITableRow[]): Fsm {
    const fsmMap = {
      [FsmType.MILI]: MiliFsm,
      [FsmType.MURA]: MuraFsm,
    };

    const fsm = fsmMap[fsmType];

    return new fsm(
      codedTableData,
      this.signalOperandGeneratorService.getStates(),
      this.signalOperandGeneratorService.getConditionalSignals(),
      this.signalOperandGeneratorService.getOutputSignals()
    );
  }

  private getCodedTableData(tableData: ITableRow[], vertexCodeMap: Map<number, number>): ITableRow[] {
    return tableData.map(tableRow => {
      const distStateCode = vertexCodeMap.get(tableRow.distStateId as number) as number;
      const srcStateCode = vertexCodeMap.get(tableRow.srcStateId as number) as number;

      return {
        ...tableRow,
        distStateCode,
        srcStateCode,
        triggerExcitationSignals: distStateCode,
      };
    });
  }

  private getCapacity(vertexCodeMap: TVertexData): number {
    const maxValue: number = Math.max(...Array.from(vertexCodeMap.values()));

    return maxValue.toString(2).length;
  }

}
