import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-dialog-overlay',
  templateUrl: './dialog-overlay.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'component-wrapper'}
})
export class DialogOverlayComponent {

  @Output() public closed: EventEmitter<void> = new EventEmitter();

  public isClickedInside: boolean = false;


  public checkAndClose(): void {
    if (!this.isClickedInside) {
      this.closed.emit();
    }

    this.isClickedInside = false;
  }
}
