import { ITableConfig } from './table-config';

export type TSensitiveTableConfigFields = keyof Pick<ITableConfig, 'numberOfStates' | 'numberOfX' | 'numberOfY'>;
