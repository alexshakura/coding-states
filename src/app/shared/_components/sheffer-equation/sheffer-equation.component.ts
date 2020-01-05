import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LogicalOperand, Operand, ShefferEquation } from '@app/models';

@Component({
  selector: 'app-sheffer-equation',
  templateUrl: './sheffer-equation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'component-wrapper' },
})
export class ShefferEquationComponent {

  @Input() public function: ShefferEquation;

  public isLogicalOperand(operand: Operand): operand is LogicalOperand {
    return operand instanceof LogicalOperand;
  }

}
