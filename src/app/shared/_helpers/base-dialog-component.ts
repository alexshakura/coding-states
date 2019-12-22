import { BaseComponent } from './base-component';
import { Observable, Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';


export class BaseDialogComponent<S, E> extends BaseComponent implements OnDestroy {

  public get success$(): Observable<S> {
    return this._success$$.asObservable();
  }

  protected _success$$: Subject<S> = new Subject<S>();

  public get error$(): Observable<E> {
    return this._error$$.asObservable();
  }

  protected _error$$: Subject<E> = new Subject<E>();

  public ngOnDestroy(): void {
    super.ngOnDestroy();

    this._success$$.complete();
    this._error$$.complete();
  }

}
