import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DnfEquation } from '@app/models';

@Component({
  selector: 'app-dnf-equation',
  templateUrl: './dnf-equation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'component-wrapper' },
})
export class DnfEquationComponent {

  @Input() public function: DnfEquation;

}
