export function getFormattedCode(code: number, capacity: number): string {
  const codeString = code.toString(2);

  return capacity > 1
    ? '0'.repeat(capacity - codeString.length) + codeString
    : codeString;
}
