import { Component, Input, HostBinding } from '@angular/core';
import { Expression } from '../forms/expression';
import { Operand } from '../forms/operand';
import { DisjunctiveExpression } from '../forms/disjunctive-expression';
import { ConjunctiveExpression } from '../forms/conjunctive-expression';


@Component({
  selector: 'app-discrete-expression',
  templateUrl: './discrete-expression.component.html',
  styleUrls: ['./discrete-expression.component.scss'],
  host: { class: 'component-wrapper' }
})
export class DiscreteExpressionComponent {

  @Input() public isBooleanBasisMode: boolean = true;
  @Input() public function: App.Expression;
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
