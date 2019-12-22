import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import {
  ConnectedOverlayPositionChange,
  ConnectedPositionStrategy,
  HorizontalConnectionPos,
  OriginConnectionPosition,
  Overlay,
  OverlayConfig,
  OverlayConnectionPosition,
  OverlayRef,
  VerticalConnectionPos
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal  } from '@angular/cdk/portal';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';

import { merge, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { DynamicContentTooltipComponent } from '../_components/dynamic-content-tooltip/dynamic-content-tooltip.component';

type TInvertedPossition = {
  x: HorizontalConnectionPos,
  y: VerticalConnectionPos
};

type TTooltipPosition =
  'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft';

@Directive({
  selector: '[appDynamicTooltip]',
})
export class DynamicTooltipDirective implements OnDestroy, OnInit {
  public readonly TOOLTIP_PANEL_CLASS: string = 'mat-tooltip-panel';
  public readonly SCROLL_THROTTLE_MS: number = 20;

  @Input('appDynamicTooltip') public tooltipContent: TemplateRef<Object>;
  @Input() public elementPosition: TTooltipPosition;
  @Input() public tooltipPosition: TTooltipPosition;

  private _overlayRef: OverlayRef | null;
  private _tooltipInstance: DynamicContentTooltipComponent | null;

  private _manualListeners: Map<string, Function> = new Map<string, Function>();

  private _elementStartPointMap: {[key in TTooltipPosition]: OriginConnectionPosition}  = {
    topLeft: { originX: 'start', originY: 'top' },
    top: { originX: 'center', originY: 'top' },
    topRight: { originX: 'end', originY: 'top' },
    bottomLeft: { originX: 'start', originY: 'bottom' },
    bottom: { originX: 'center', originY: 'bottom' },
    bottomRight: { originX: 'end', originY: 'bottom' },
    left: { originX: 'start', originY: 'center' },
    right: { originX: 'end', originY: 'center' },
  };

  private _tooltipStartPointMap: { [key in TTooltipPosition]: OverlayConnectionPosition} = {
    topLeft: { overlayX: 'start', overlayY: 'top' },
    top: { overlayX: 'center', overlayY: 'top' },
    topRight: { overlayX: 'end', overlayY: 'top' },
    bottomLeft: { overlayX: 'start', overlayY: 'bottom' },
    bottom: { overlayX: 'center', overlayY: 'bottom' },
    bottomRight: { overlayX: 'end', overlayY: 'bottom' },
    left: { overlayX: 'start', overlayY: 'center' },
    right: { overlayX: 'end', overlayY: 'center' },
  };

  private _destroy$$: Subject<void> = new Subject<void>();

  public constructor(
    private _elementRef: ElementRef,
    private _ngZone: NgZone,
    private _overlay: Overlay,
    private _scrollDispatcher: ScrollDispatcher,
    private _viewContainerRef: ViewContainerRef
  ) { }

  public ngOnInit(): void {
    this._manualListeners.set('mouseenter', () => this.show());
    this._manualListeners.set('mouseleave', () => this.hide());

    this._manualListeners
      .forEach((listener: Function, event: string) => this._elementRef.nativeElement.addEventListener(event, listener));
  }

  public ngOnDestroy(): void {
    if (this._tooltipInstance) {
      this._disposeTooltip();
    }

    this._manualListeners.forEach((listener: Function, event: string) => {
      this._elementRef.nativeElement.removeEventListener(event, listener);
    });

    this._manualListeners.clear();
  }

  public show(): void {
    if (!this.tooltipContent) {
      return;
    }

    if (!this._tooltipInstance) {
      this._createTooltip();
    }

    this._updateTooltipContent();
    (this._tooltipInstance as DynamicContentTooltipComponent).show();
  }

  public hide(): void {
    if (this._tooltipInstance) {
      this._tooltipInstance.hide();
    }
  }

  private _createTooltip(): void {
    const overlayRef: OverlayRef = this._createOverlay();
    const tooltipPortal: ComponentPortal<DynamicContentTooltipComponent>
      = new ComponentPortal<DynamicContentTooltipComponent>(DynamicContentTooltipComponent, this._viewContainerRef);

    this._tooltipInstance = overlayRef.attach(tooltipPortal).instance;
    this._tooltipInstance.contentPortal = new TemplatePortal(this.tooltipContent, this._viewContainerRef);

    merge(
      this._tooltipInstance.afterHidden(),
      overlayRef.detachments()
    )
      .pipe(
        takeUntil(this._destroy$$)
      )
      .subscribe(() => {
        if (this._tooltipInstance) {
          this._disposeTooltip();
        }
      });
  }

  private _createOverlay(): OverlayRef {
    const origin: OriginConnectionPosition = this.elementPosition
      ? this._elementStartPointMap[this.elementPosition]
      : this._elementStartPointMap.bottom;
    const overlay: OverlayConnectionPosition = this.tooltipPosition
      ? this._tooltipStartPointMap[this.tooltipPosition]
      : this._tooltipStartPointMap.top;

    const invertedOrigin: TInvertedPossition = this._invertPosition(origin.originX, origin.originY);

    const invertedOverlay: TInvertedPossition = this._invertPosition(overlay.overlayX, overlay.overlayY);

    const invertOriginPosition: OriginConnectionPosition = {
      originX: invertedOrigin.x,
      originY: invertedOrigin.y,
    };

    const invertOverlayPosition: OverlayConnectionPosition = {
      overlayX: invertedOverlay.x,
      overlayY: invertedOverlay.y,
    };

    const strategy: ConnectedPositionStrategy = this._overlay
      .position()
      .connectedTo(this._elementRef, origin, overlay)
      .withFallbackPosition(invertOriginPosition, invertOverlayPosition);

    const scrollableAncestors: CdkScrollable[] = this._scrollDispatcher
      .getAncestorScrollContainers(this._elementRef);

    strategy.withScrollableContainers(scrollableAncestors);

    strategy.onPositionChange
      .pipe(
        takeUntil(this._destroy$$)
      )
      .subscribe((change: ConnectedOverlayPositionChange) => {
        if (this._tooltipInstance) {
          if (change.scrollableViewProperties.isOverlayClipped && this._tooltipInstance.isVisible()) {
            this.hide();
          }
        }
      });

    const config: OverlayConfig = new OverlayConfig({
      direction: 'ltr',
      positionStrategy: strategy,
      panelClass: this.TOOLTIP_PANEL_CLASS,
      scrollStrategy: this._overlay.scrollStrategies.reposition({ scrollThrottle: this.SCROLL_THROTTLE_MS }),
    });

    this._overlayRef = this._overlay.create(config);

    return this._overlayRef;
  }

  private _disposeTooltip(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }

    this._tooltipInstance = null;
  }

  private _updateTooltipContent(): void {
    if (this._tooltipInstance) {
      this._tooltipInstance.contentPortal = new TemplatePortal(this.tooltipContent, this._viewContainerRef);
      this._tooltipInstance.markForCheck();

      this._ngZone.onMicrotaskEmpty.asObservable()
        .pipe(take(1))
        .subscribe(() => {
          if (this._tooltipInstance && this._overlayRef) {
            this._overlayRef.updatePosition();
        }
      });
    }
  }

  private _invertPosition(x: HorizontalConnectionPos, y: VerticalConnectionPos): TInvertedPossition {
    if (y === 'top') {
      y = 'bottom';
    } else if (y === 'bottom') {
      y = 'top';
    }

    return {x, y};
  }
}
