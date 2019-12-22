import { MatPaginatorIntl } from '@angular/material/paginator';

export class CustomMatPaginatorIntlRu extends MatPaginatorIntl {
  public nextPageLabel: string = 'Следующая страница';
  public previousPageLabel: string = 'Предыдущая страница';

  public firstPageLabel: string = 'Первая страница';
  public lastPageLabel: string = 'Последняя страница';

  public itemsPerPageLabel: string = 'Число строк на странице';

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
