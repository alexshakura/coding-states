import { CodingAlgorithmType, TriggerType, FsmType } from "@app/enums";

export const DEFAULT_LANGUAGE: string = 'ru';

export const CODING_ALGORITHMS_TRANSLATIONS_MAP: Record<CodingAlgorithmType, string> = {
  [CodingAlgorithmType.FREQUENCY]: 'ROOT.ROOT.FREQUENCY_CODING_ALGORITHM',
  [CodingAlgorithmType.STATE_N]: 'ROOT.ROOT.STATE_N_CODING_ALGORITHM',
  [CodingAlgorithmType.UNITARY]: 'ROOT.ROOT.UNITARY_CODING_ALGORITHM',
  [CodingAlgorithmType.CANONICAL]: 'ROOT.ROOT.CANONICAL_CODING_ALGORITHM',
};

export const TRIGGER_TYPES_TRANSLATIONS_MAP: Record<TriggerType, string> = {
  [TriggerType.D]: 'ROOT.ROOT.D_TRIGGER',
  [TriggerType.T]: 'ROOT.ROOT.T_TRIGGER',
  [TriggerType.NOT_T]: 'ROOT.ROOT.NOT_T_TRIGGER',
};

export const FSM_TYPES_TRANSLATIONS_MAP: Record<FsmType, string> = {
  [FsmType.MILI]: 'ROOT.ROOT.MILI_STATE_MACHINE',
  [FsmType.MURA]: 'ROOT.ROOT.MURA_STATE_MACHINE',
};
