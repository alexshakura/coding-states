import { EventEmitter } from '@angular/core';
import { BaseDialogComponent } from '@app/shared/_helpers/base-dialog-component';
import { CodingAlgorithmType } from '@app/enums';

export interface ICodingDialog extends BaseDialogComponent<CodingAlgorithmType, string> {
  onSubmit: EventEmitter<void>;
}
