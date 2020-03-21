export function getNumberOfOnes(value: number): number {
  return Array.from(value.toString(2))
    .map(Number)
    .filter(Boolean)
    .length;
}
