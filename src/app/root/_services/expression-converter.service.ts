import { Injectable } from '@angular/core';
import { ConstantOneOperand, Expression, Operand, ShefferExpression, SignalOperand } from '@app/models';
import { TFunctionMap } from '@app/types';

@Injectable()
export class ExpressionConverterService {

  public convertBooleanFunctionsToSheffer(booleanFunctions: TFunctionMap): TFunctionMap {
    const shefferFunctions: TFunctionMap = new Map<number, Expression>();

    booleanFunctions.forEach((val: Expression, key: number) => {
      shefferFunctions.set(key, this.convertToShefferBasis(val));
    });

    return shefferFunctions;
  }

  private convertToShefferBasis(expression: Expression): ShefferExpression {
    const shefferExpression: ShefferExpression = new ShefferExpression([]);

    if (expression.operands.length === 1) {
      const expressionOperand = expression.operands[0];

      if (expressionOperand instanceof Operand) {
        shefferExpression.addOperand(expressionOperand);
      }

      if (expressionOperand instanceof Expression) {
        shefferExpression.addOperand(new ShefferExpression(expressionOperand.operands));

        if (expressionOperand.operands.length > 1) {
          shefferExpression.addOperand(new ConstantOneOperand());
        }
      }

      return shefferExpression;
    }

    expression.operands.forEach((operand: Expression | Operand) => {
      if (operand instanceof Expression) {
        shefferExpression.addOperand(new ShefferExpression(operand.operands));
      }

      if (operand instanceof SignalOperand) {
        shefferExpression.addOperand(operand.invert());
      }
    });

    return shefferExpression;
  }

}
