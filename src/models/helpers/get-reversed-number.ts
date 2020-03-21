import { getFormattedCode } from './get-formatted-code';

export function getReversedNumber(value: number, capacity: number): number {
  const formattedValue = getFormattedCode(value, capacity);

  const reversedString = formattedValue
    .split('')
    .map((x) => Number(x) ^ 1)
    .join('');

  return parseInt(reversedString, 2);
}
