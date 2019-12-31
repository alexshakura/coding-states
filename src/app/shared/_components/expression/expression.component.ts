import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConstantOperand, Expression, Operand, ShefferExpression } from '@app/models';

@Component({
  selector: 'app-expression',
  templateUrl: './expression.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'component-wrapper' },
})
export class ExpressionComponent {

  @Input() public function: Expression;

  public isShefferBasisShown(): boolean {
    return this.function instanceof ShefferExpression;
  }

  public isOperand(operand: Operand | Expression): operand is Operand {
    return operand instanceof Operand;
  }

  public isOperandIndexShown(operand: Operand): boolean {
    return !(operand instanceof ConstantOperand);
  }

}
