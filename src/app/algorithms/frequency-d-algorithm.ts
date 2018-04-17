import { StateOperand } from "../forms/state-operand";
import { DisjunctiveExpression } from "../forms/disjunctive-expression";
import { ConditionSignalOperand } from "../forms/condition-signal-operand";
import { ConjunctiveExpression } from "../forms/conjunctive-expression";

export class FrequencyDAlgorithm {

  public getTransitionBooleanFunctions(tableData: App.TableRow[], vertexCodesMap: App.TVertexData): App.TFunctionMap {
    const numStates: number = Math.max(...tableData.map((tableRow: App.TableRow) => tableRow.distState));
    const capacity: number = Math.ceil(Math.log2(numStates));

    const transitionCheckList: number[] = [];

    for (let i: number = 0; i < capacity; i++) {
      transitionCheckList.push(1 << i);
    }

    const transitionBooleanFunctions: Map<number, App.Expression> = new Map();

    tableData.forEach((tableRow: App.TableRow) => {
      const fCode: number = vertexCodesMap.get(tableRow.distState);

      const stateOperand = new StateOperand(tableRow.srcState, false);
      let conditionalExpression;

      if (!tableRow.unconditionalX) {
        conditionalExpression = new ConjunctiveExpression([stateOperand]);

        tableRow.x.forEach((conditionalSignal) => {
          conditionalExpression.addOperand(new ConditionSignalOperand(conditionalSignal.id, conditionalSignal.inverted));
        });
      }

      transitionCheckList.forEach((val, index) => {
        if (val & fCode) {
          const functionIndex: number = index + 1;

          if (!transitionBooleanFunctions.has(functionIndex)) {
            transitionBooleanFunctions.set(functionIndex, new DisjunctiveExpression([]));
          }

          const transitionBooleanFunction = transitionBooleanFunctions.get(functionIndex);

          if (conditionalExpression) {
            transitionBooleanFunction.addOperand(conditionalExpression);
          } else if (!transitionBooleanFunction.hasOperand(stateOperand)) {
            transitionBooleanFunction.addOperand(stateOperand);
          }
        }
      });
    });

    return transitionBooleanFunctions;
  }

  public getOutputBooleanFunctions(tableData: App.TableRow[]): App.TFunctionMap {
    const outputBooleanFunctions: App.TFunctionMap = new Map();

    tableData
      .filter((tableRow: App.TableRow) => tableRow.y.size > 0)
      .forEach((tableRow: App.TableRow) => {
        const stateOperand: StateOperand = new StateOperand(tableRow.srcState, false);

        let conditionalExpression: App.Expression;

        if (!tableRow.unconditionalX) {
          conditionalExpression = new ConjunctiveExpression([stateOperand]);

          tableRow.x.forEach((conditionalSignal) => {
            conditionalExpression.addOperand(new ConditionSignalOperand(conditionalSignal.id, conditionalSignal.inverted));
          });
        }

        tableRow.y.forEach((y: number) => {
          if (!outputBooleanFunctions.has(y)) {
            outputBooleanFunctions.set(y, new DisjunctiveExpression([]));
          }

          const outputBooleanFunction: App.Expression = outputBooleanFunctions.get(y);

          if (conditionalExpression) {
            outputBooleanFunction.addOperand(conditionalExpression);
          } else if (!outputBooleanFunction.hasOperand(stateOperand)) {
            outputBooleanFunction.addOperand(stateOperand);
          }
        });
      });

    return outputBooleanFunctions;
  }

  public getVertexCodeMap(tableData: App.TableRow[]): App.TVertexData {
    const numStates: number = Math.max(...tableData.map((tableRow: App.TableRow) => tableRow.distState));
    const capacity: number = Math.ceil(Math.log2(numStates));

    const sortedVertexes = this._getSortedVertexes(tableData);
    const vertexCodesMap: App.TVertexData = new Map();

    const codeMap: Map<number, number[]> = this._getCodeMap(capacity);

    for (let i = 0, numOfDigits = 0; i < numStates; i++) {
      if (codeMap.get(numOfDigits).length === 0) {
        numOfDigits++;
      }

      vertexCodesMap.set(sortedVertexes[i].id, codeMap.get(numOfDigits).shift());
    }

    return vertexCodesMap;
  }

  private _getSortedVertexes(tableData: App.TableRow[]): { id: number, frequency: number}[] {
    const vertexFrequencyMap: Map<number, { id: number, frequency: number }> = new Map();

    tableData.forEach((tableRow: App.TableRow) => {
      if (!vertexFrequencyMap.has(tableRow.distState)) {
        vertexFrequencyMap.set(tableRow.distState, { id: tableRow.distState, frequency: 0 });
      }

      vertexFrequencyMap.get(tableRow.distState).frequency++;
    });

    return Array.from(vertexFrequencyMap.values())
      .sort((a, b) => {
        if (a.frequency < b.frequency) {
          return 1;
        }

        if (a.frequency > b.frequency) {
          return -1;
        }

        return a.id > b.id
          ? 1
          : -1;
      });
  }

  private _getCodeMap(capacity: number): Map<number, number[]> {
    const codeMap: Map<number, number[]> = new Map();
    const maxCapacityValue: number = (2 ** capacity) - 1;

    for (let i: number = 0; i <= maxCapacityValue; i++) {
      const numOfDigits: number = this._getNumOfDigits(i);

      if (!codeMap.has(numOfDigits)) {
        codeMap.set(numOfDigits, []);
      }

      codeMap.get(numOfDigits).push(i);
    }

    return codeMap;
  }

  private _getNumOfDigits(num: number): number {
    return num
      .toString(2)
      .split('1')
      .length - 1;
  }
}
