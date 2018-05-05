import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Portal } from '@angular/cdk/portal';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export type TooltipVisibility = 'initial' | 'visible' | 'hidden';


@Component({
  selector: 'lms-dynamic-content-tooltip',
  templateUrl: './dynamic-content-tooltip.component.html',
  styleUrls: ['./dynamic-content-tooltip.component.scss'],
  preserveWhitespaces: false,
  animations: [
    trigger('state', [
      state('initial, void, hidden', style({transform: 'scale(0)'})),
      state('visible', style({transform: 'scale(1)'})),
      transition('* => visible', animate('150ms cubic-bezier(0.0, 0.0, 0.2, 1)')),
      transition('* => hidden', animate('150ms cubic-bezier(0.4, 0.0, 1, 1)')),
    ])
  ],
  host: {
    '[style.zoom]': 'visibility === "visible" ? 1 : null',
    '(body:click)': 'this.handleBodyInteraction()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicContentTooltipComponent implements OnDestroy {
  public contentPortal: Portal<Object>;

  public transformOrigin: string = 'bottom';

  public visibility: TooltipVisibility = 'initial';

  private _closeOnInteraction: boolean = false;

  private _onHide: Subject<void> = new Subject<void>();

  public constructor(
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  public ngOnDestroy(): void {
    this._onHide.complete();
  }

  public show(): void {
    this._closeOnInteraction = true;

    setTimeout(() => {
      this.visibility = 'visible';
      this.markForCheck();
    }, 0);
  }

  public hide(): void {
    setTimeout(() => {
      this.visibility = 'hidden';
      this.markForCheck();
    }, 0);
  }

  public isVisible(): boolean {
    return this.visibility === 'visible';
  }

  public afterHidden(): Observable<void> {
    return this._onHide.asObservable();
  }


  public animationStart(): void {
    this._closeOnInteraction = false;
  }

  public animationDone(event: AnimationEvent): void {
    const toState: TooltipVisibility = event['toState'] as TooltipVisibility;

    if (toState === 'hidden' && !this.isVisible()) {
      this._onHide.next();
    }

    if (toState === 'visible' || toState === 'hidden') {
      Promise.resolve().then(() => this._closeOnInteraction = true);
    }
  }

  public handleBodyInteraction(): void {
    if (this._closeOnInteraction) {
      this.hide();
    }
  }

  public markForCheck(): void {
    this._changeDetectorRef.markForCheck();
  }
}
