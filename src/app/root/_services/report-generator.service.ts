import { Injectable } from '@angular/core';
import { CodingAlgorithmsService } from './coding-algorithms.service';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TableDataService } from './table-data.service';
import { SignalOperandGeneratorService } from './signal-operand-generator.service';
import { IFormattedTableRow, IGeneratedFileInputData, ITableConfig, ITableRow } from '@app/types';
import { ConditionSignalOperand, OutputSignalOperand, StateOperand } from '@app/models';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from './electron.service';
import { environment } from '@app/env';
import * as PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { CodingAlgorithmType, FsmType } from '@app/enums';
import { reportParser } from '@app/shared/_helpers/report-parser';

@Injectable()
export class ReportGeneratorService {

  private readonly GENERATE_DOC_ERROR: string = 'Что-то пошло не так, перепроверьте Ваши данные';

  public constructor(
    private readonly codingAlgorithmsService: CodingAlgorithmsService,
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService,
    private readonly tableDataService: TableDataService,
    private readonly httpClient: HttpClient,
    private readonly electronService: ElectronService
  ) { }

  public get$(tableConfig: ITableConfig, chosenCodingAlgorithm: CodingAlgorithmType): Observable<Blob | Buffer> {
    return combineLatest([
      this.getData$(tableConfig, chosenCodingAlgorithm),
      this.getTemplateBinary$(),
    ])
      .pipe(
        map(([data, templateBinary]) => {
          const zip = new PizZip(templateBinary);
          const doc = new Docxtemplater();

          doc.loadZip(zip);
          doc.setOptions({ paragraphLoop: true, parser: reportParser });
          doc.setData(data);

          try {
            doc.render();

            const generatedZipFile = doc.getZip();

            return generatedZipFile.generate({ type: 'nodebuffer' });
          } catch (e) {
            throw new Error(this.GENERATE_DOC_ERROR);
          }
        })
      );
  }

  private getData$(
    tableConfig: ITableConfig,
    chosenCodingAlgorithm: CodingAlgorithmType
  ): Observable<IGeneratedFileInputData> {
    return combineLatest([
      this.codingAlgorithmsService.codedTableData$,
      this.codingAlgorithmsService.capacity$,
      this.codingAlgorithmsService.outputFunctions$,
      this.codingAlgorithmsService.transitionFunctions$,
    ])
    .pipe(
      map(([codedTableData, capacity, outputFunctions, excitationFunctions]) => {
        return {
          isMiliFsm: tableConfig.fsmType === FsmType.MILI,
          isUnitaryAlgorithm: chosenCodingAlgorithm === CodingAlgorithmType.UNITARY_D_TRIGGER,
          isFrequencyAlgorithm: chosenCodingAlgorithm === CodingAlgorithmType.FREQUENCY_D_TRIGGER,
          isNStateAlgorithm: chosenCodingAlgorithm === CodingAlgorithmType.STATE_N_D_TRIGGER,
          tableData: this.getFormattedTableData(codedTableData, capacity),
          outputFunctions,
          excitationFunctions,
        };
      }),
      take(1)
    );
  }

  private getFormattedTableData(codedTableData: ITableRow[], capacity: number): IFormattedTableRow[] {
    const statesMap = this.signalOperandGeneratorService.getStates();
    const conditionalSignalsMap = this.signalOperandGeneratorService.getConditionalSignals();
    const outputSignalsMap = this.signalOperandGeneratorService.getOutputSignals();

    return codedTableData.map((tableRow) => {
      const srcState = statesMap.get(tableRow.srcStateId as number) as StateOperand;
      const distState = statesMap.get(tableRow.distStateId as number) as StateOperand;

      const conditionalSignals = Array.from(tableRow.conditionalSignalsIds)
        .map((conditionalSignalId) => conditionalSignalsMap.get(conditionalSignalId) as ConditionSignalOperand);

      const outputSignalsIndexes = Array.from(tableRow.outputSignalsIds)
        .map((outputSignalId) => {
          const signal = outputSignalsMap.get(outputSignalId) as OutputSignalOperand;

          return signal.index;
        });

      return {
        id: tableRow.id,
        srcStateIndex: srcState.index,
        srcStateCode: this.tableDataService.formatStateCode(tableRow.srcStateCode as number, capacity),
        distStateIndex: distState.index,
        distStateCode: this.tableDataService.formatStateCode(tableRow.distStateCode as number, capacity),
        conditionalSignals,
        unconditionalTransition: tableRow.unconditionalTransition,
        outputSignalsIndexes,
        triggerExcitationSignals: this.tableDataService.formatStateCode(tableRow.triggerExcitationSignals as number, capacity),
      };
    });
  }

  private getTemplateBinary$(): Observable<ArrayBuffer> {
    let pathToTemplate: string = '/assets/report-template.docx';

    if (environment.production) {
      const resourcesPath = window.process.resourcesPath;

      pathToTemplate = this.electronService.path.join(resourcesPath, pathToTemplate);
    }

    return this.httpClient.get(pathToTemplate, { responseType: 'arraybuffer' });
  }

}
