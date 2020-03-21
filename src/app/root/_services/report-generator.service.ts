import { Injectable } from '@angular/core';
import { CodingAlgorithmsService } from './coding-algorithms.service';
import { combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SignalOperandGeneratorService } from './signal-operand-generator.service';
import { IFormattedTableRow, IGeneratedFileInputData, ITableConfig, ITableRow } from '@app/types';
import { ConditionSignalOperand, getFormattedCode, OutputSignalOperand, StateOperand } from '@app/models';
import * as PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { CodingAlgorithmType, FsmType, TriggerType } from '@app/enums';
import { reportParser } from '@app/shared/_helpers/report-parser';
import { getAssetsPath } from '@app/shared/_helpers/get-assets-path';
import * as path from 'path';
import * as fs from 'fs';
import { ValidationError } from '@app/shared/_helpers/validation-error';

@Injectable()
export class ReportGeneratorService {

  public constructor(
    private readonly codingAlgorithmsService: CodingAlgorithmsService,
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService
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
            throw new ValidationError('ROOT.ROOT.ERROR_REPORT_GENERATION');
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
          isUnitaryAlgorithm: chosenCodingAlgorithm === CodingAlgorithmType.UNITARY,
          isFrequencyAlgorithm: chosenCodingAlgorithm === CodingAlgorithmType.FREQUENCY,
          isNStateAlgorithm: chosenCodingAlgorithm === CodingAlgorithmType.STATE_N,
          isCanonicalAlgorithm: chosenCodingAlgorithm === CodingAlgorithmType.CANONICAL,
          isDTrigger: tableConfig.triggerType === TriggerType.D,
          isTTrigger: tableConfig.triggerType === TriggerType.T,
          isNotTTrigger: tableConfig.triggerType === TriggerType.NOT_T,
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
        srcStateCode: getFormattedCode(tableRow.srcStateCode as number, capacity),
        distStateIndex: distState.index,
        distStateCode: getFormattedCode(tableRow.distStateCode as number, capacity),
        conditionalSignals,
        unconditionalTransition: tableRow.unconditionalTransition,
        outputSignalsIndexes,
        triggerExcitationSignals: getFormattedCode(tableRow.triggerExcitationSignals as number, capacity),
      };
    });
  }

  private getTemplateBinary$(): Observable<any> {
    const pathToTemplate = path.join(getAssetsPath(), 'report-template.docx');
    const templateBinary = fs.readFileSync(pathToTemplate, { encoding: 'binary' });

    return of(templateBinary);
  }

}
