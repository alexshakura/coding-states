import { ConjunctionExpression } from './expressions/conjunction-expression';
import { ShefferEquation } from './sheffer-equation';
import { Equation } from './equation';
import { ShefferExpression } from './expressions/sheffer-expression';
import { LogicalOperand } from '../operands';

export class DnfEquation extends Equation<ConjunctionExpression> {

  public toSheffer(): ShefferEquation {
    if (this._terms.length === 1) {
      const singleTerm = this._terms[0];

      const expression = new ShefferExpression(...singleTerm.operands);
      const equation = new ShefferEquation(expression);

      if (singleTerm.operands.length > 1) {
        const logicalTerm = new ShefferExpression(new LogicalOperand(true));

        equation.addTerm(logicalTerm);
      }

      return equation;
    }

    const terms = this.terms.map((term) => {
      if (term.operands.length === 1) {
        const singleOperand = term.operands[0];

        return new ShefferExpression(singleOperand.invert());
      }

      return new ShefferExpression(...term.operands);
    });

    return new ShefferEquation(...terms);
  }

}
