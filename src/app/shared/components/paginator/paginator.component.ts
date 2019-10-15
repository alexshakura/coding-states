import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';


@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  host: { class: 'component-wrapper' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent extends MatPaginator {

  public constructor(
    _intl: MatPaginatorIntl,
    _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_intl, _changeDetectorRef);
  }
}
