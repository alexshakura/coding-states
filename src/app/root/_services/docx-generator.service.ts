import { Injectable } from '@angular/core';
import { CodingAlgorithmsService } from './coding-algorithms.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableDataService } from './table-data.service';
import { SignalOperandGeneratorService } from './signal-operand-generator.service';
import { IFormattedTableRow, IGeneratedFileInputData, ITableConfig, ITableRow } from '@app/types';
import { ConditionSignalOperand, LogicalOperand, OutputSignalOperand, StateOperand } from '@app/models';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from './electron.service';
import { environment } from '@app/env';
import * as PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { compile } from 'angular-expressions';
import { CodingAlgorithmType, FsmType } from '@app/enums';

@Injectable()
export class DocxGeneratorService {

  private readonly MIME_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  public constructor(
    private readonly codingAlgorithmsService: CodingAlgorithmsService,
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService,
    private readonly tableDataService: TableDataService,
    private readonly httpClient: HttpClient,
    private readonly electronService: ElectronService
  ) { }

  public get$(tableConfig: ITableConfig, chosenCodingAlgorithm: CodingAlgorithmType): Observable<any> {
    return combineLatest([
      this.getData$(tableConfig, chosenCodingAlgorithm),
      this.getTemplateBinary$(),
    ])
      .pipe(
        map(([data, templateBinary]) => {
          const zip = new PizZip(templateBinary);
          const doc = new Docxtemplater();

          doc.loadZip(zip);
          doc.setOptions({ paragraphLoop: true, parser: this.getParser() });
          doc.setData(data);

          try {
            doc.render();

            const generatedZipFile = doc.getZip();
            let generatedFile;

            // if (this._electronService.isElectron()) {
            //   generatedFile = generatedZipFile.generate({ type: 'nodebuffer' });

            //   const savePath: string = this._electronService.dialog.showSaveDialog({
            //     defaultPath: 'coding_results',
            //     filters: [{ name: 'Microsoft office document', extensions: ['docx'] }],
            //   });

            //   if (savePath) {
            //     if (this._electronService.fs.existsSync(savePath)) {
            //       this._electronService.fs.unlinkSync(savePath);
            //     }

            //     this._electronService.fs.writeFileSync(savePath, generatedFile);
            //     this._snackBarService.showMessage(this.GENERATE_DOC_SUCCESS);
            //   }
            // }else {
            generatedFile = generatedZipFile.generate({
                type: 'blob',
                mimeType: this.MIME_TYPE,
              });

            const url = window.URL.createObjectURL(generatedFile);
            window.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 40);

              // this.snackBarService.showMessage(this.GENERATE_DOC_SUCCESS);
            // }
          } catch (e) {
            console.log(e);

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
      })
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
    let pathToTemplate: string = '/assets/doc-templates/table_min.docx';

    if (this.electronService.isElectron() && environment.production) {
      const resourcesPath = window.process.resourcesPath;

      pathToTemplate = this.electronService.path.join(resourcesPath, pathToTemplate);
    }

    return this.httpClient.get(pathToTemplate, { responseType: 'arraybuffer' });
  }

  public getParser() {
   return (tag: string) => {
      return {
          get: (scope: any, context: any) => {
            if (tag === 'isLastItem') {
              return this.isLastItem(context);
            }

            if (tag === 'isLogicalOperand') {
              return scope instanceof LogicalOperand;
            }

            if (tag === '.') {
              return scope;
            }

            const parsedExpressionFn = compile(tag.replace(/(’|“|”)/g, '\''));

            return parsedExpressionFn(scope);
          },
      };
    };
  }

  private isLastItem(context: any): boolean {
    const index = context.scopePathItem[context.scopePathItem.length - 1];

    const parent = context.scopeList[context.scopeList.length - 2];
    const iterablePath: string[] = context.scopePath[context.scopePath.length - 1].split('.');

    let iterable = parent;

    iterablePath.forEach((prop) => iterable = iterable[prop]);

    return index === iterable.length - 1;
  }
}
