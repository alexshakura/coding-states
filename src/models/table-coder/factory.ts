import { ITableCoder } from '@app/types';
import { DTriggerTableCoder } from './d-trigger-table-coder';
import { TTriggerTableCoder } from './t-trigger-table-coder';
import { NotTTriggerTableCoder } from './not-t-trigger-table-coder';
import { TriggerType } from '@app/enums';

export class TableCoderFactory {

  public static create(triggerType: TriggerType): ITableCoder {
    const coders = {
      [TriggerType.D]: DTriggerTableCoder,
      [TriggerType.T]: TTriggerTableCoder,
      [TriggerType.NOT_T]: NotTTriggerTableCoder,
    };

    const coder = coders[triggerType];

    return new coder();
  }
}
