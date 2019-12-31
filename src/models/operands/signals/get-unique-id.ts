export function getUniqueId(index: number, inverted: boolean): number {
  const baseId = index + (index - 1);

  return inverted
    ? baseId + 1
    : baseId;
}
