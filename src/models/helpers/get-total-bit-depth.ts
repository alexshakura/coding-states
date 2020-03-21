export function getTotalBitDepth(entitiesCount: number): number {
  return Math.ceil(Math.log2(entitiesCount));
}
