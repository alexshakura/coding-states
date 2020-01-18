import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export class CustomMatPaginatorIntlRu extends MatPaginatorIntl {

  public nextPageLabel: string = this.translateService.instant('SHARED.CUSTOM_PAGINATOR.NEXT_PAGE_LABEL');
  public previousPageLabel: string = this.translateService.instant('SHARED.CUSTOM_PAGINATOR.PREVIOUS_PAGE_LABEL');

  public firstPageLabel: string = this.translateService.instant('SHARED.CUSTOM_PAGINATOR.FIRST_PAGE_LABEL');
  public lastPageLabel: string = this.translateService.instant('SHARED.CUSTOM_PAGINATOR.LAST_PAGE_LABEL');

  public itemsPerPageLabel: string = this.translateService.instant('SHARED.CUSTOM_PAGINATOR.ITEMS_PER_PAGE_LABEL');

  public constructor(
    private readonly translateService: TranslateService
  ) {
    super();
  }

  public getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 из ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex: number = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex: number = startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} из ${length}`;
  }
}
