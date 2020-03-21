import { IFormattedTableRow } from './formatted-table-row';
import { IOutputFunctionsDataCell } from './output-functions-data-cell';
import { IExcitationFunctionsDataCell } from './excitation-functions-data-cell';

export interface IGeneratedFileInputData {
  isMiliFsm: boolean;
  isUnitaryAlgorithm: boolean;
  isFrequencyAlgorithm: boolean;
  isNStateAlgorithm: boolean;
  isCanonicalAlgorithm: boolean;
  isDTrigger: boolean;
  isTTrigger: boolean;
  isNotTTrigger: boolean;
  tableData: IFormattedTableRow[];
  outputFunctions: IOutputFunctionsDataCell[];
  excitationFunctions: IExcitationFunctionsDataCell[];
}
