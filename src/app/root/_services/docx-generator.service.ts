import { Injectable } from '@angular/core';

@Injectable()
export class DocxGeneratorService {

  public static readonly MIME_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  public constructor(
      ) { }

  // public getData$(): Observable<any[]> {
  //   return combineLatest([
  //       this.codingAlgorithmsService.codedTableData$,
  //       this.codingAlgorithmsService.capacity$,
  //       this.codingAlgorithmsService.outputFunctions$,
  //       this.codingAlgorithmsService.transitionFunctions$,
  //     ])
  //     .pipe(
  //       map(([tableData, capacity, outputFunctions, transitionFunctions]: [ITableRow[], number, IFunctions, IFunctions]) => {
  //         const updatedTableData = tableData.map((tableRow: ITableRow) => {
  //           return {
  //             ...tableRow,
  //             codeSrcState: this.tableDataService.formatStateCode(tableRow.srcStateCode as number, capacity),
  //             codeDistState: this.tableDataService.formatStateCode(tableRow.distStateCode as number, capacity),
  //             f: this.tableDataService.formatStateCode(tableRow.triggerExcitationSignals as number, capacity),
  //             x: Array.from(tableRow.conditionalSignalsIds),
  //             y: Array.from(tableRow.outputSignalsIds),
  //           };
  //         });

  //         const rearrangedOutputFunctions: { boolean: Expression, sheffer: Expression }[] = [];
  //         const rearrangedTransitionFunctions: { boolean: Expression, sheffer: Expression }[] = [];

  //         outputFunctions.boolean.forEach((val: Expression, key: number) => {
  //           rearrangedOutputFunctions.push({
  //             boolean: val,
  //             sheffer: outputFunctions.sheffer.get(key) as Expression,
  //           });
  //         });

  //         transitionFunctions.boolean.forEach((val: Expression, key: number) => {
  //           rearrangedTransitionFunctions.push({
  //             boolean: val,
  //             sheffer: transitionFunctions.sheffer.get(key) as Expression,
  //           });
  //         });

  //         return [updatedTableData, rearrangedOutputFunctions, rearrangedTransitionFunctions];
  //       })
  //     );
  // }

  // public getParser() {
  //  return (tag: string) => {
  //     return {
  //         get: (scope: any, context: any) => {
  //           if (tag.includes('$index')) {
  //             const indexes: number[] = context.scopePathItem;
  //             const val: number =  indexes[indexes.length - 1];

  //             return expressions.compile(tag.replace('$index', val.toString(10)))();
  //           }

  //           if (tag === 'isExpression') {
  //             return scope instanceof Expression;
  //           }

  //           if (tag === 'isConstantOperand') {
  //             return scope instanceof ConstantOperand;
  //           }

  //           if (tag === 'isNotLastItem') {
  //             const parent = context.scopeList[context.scopeList.length - 2];
  //             const iterablePath: string[] = context.scopePath[context.scopePath.length - 1].split('.');

  //             let iterable = parent;

  //             iterablePath.forEach((prop: string) => iterable = iterable[prop]);

  //             return iterable.indexOf(scope) !== iterable.length - 1;
  //           }

  //           if (tag === 'expressionSign') {
  //             return this.getParentExpressionSymbol(context);
  //           }

  //           const defaultHandler = tag === '.'
  //             ? (s: string): string => s
  //             : (s: string): string => expressions.compile(tag.replace(/(’|“|”)/g, '\''))(s);

  //           return defaultHandler(scope);
  //         },
  //     };
  //   };
  // }

  // private getParentExpressionSymbol(context: any): string {
  //   const iterableIndex: number = context.scopePath.length - 2;
  //   const iterablePath: string[] = context.scopePath[iterableIndex].split('.');
  //   const parent = context.scopeList[iterableIndex];

  //   iterablePath.pop();
  //   let iterable = parent;

  //   iterablePath.forEach((path: string) => iterable = iterable[path]);

  //   return iterable && iterable.symbol;
  // }
}
