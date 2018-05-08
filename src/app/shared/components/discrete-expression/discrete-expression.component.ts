import { Component, Input } from '@angular/core';

import { Expression } from '../../expression/expression';
import { Operand } from '../../expression/operand';
import { DisjunctiveExpression } from '../../expression/disjunctive-expression';
import { ConjunctiveExpression } from '../../expression/conjunctive-expression';


@Component({
  selector: 'app-discrete-expression',
  templateUrl: './discrete-expression.component.html',
  host: { class: 'component-wrapper' }
})
export class DiscreteExpressionComponent {

  @Input() public isBooleanBasisMode: boolean = true;
  @Input() public function: App.IExpression;
  @Input() public nested: boolean = false;

  public isOperand(operand): boolean {
    return operand instanceof Operand;
  }

  public isDisjunctiveExpression(): boolean {
    return this.function instanceof DisjunctiveExpression;
  }

  public isBracketsShown(): boolean {
    return this.nested
      && !this.isBooleanBasisMode
      && this.function.operands.length > 1;
  }
}
