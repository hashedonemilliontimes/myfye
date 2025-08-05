// Utility function to format balances
export function formatBalance(value: number, type: string): string {
  if (type === "usd") {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return value.toString();
}
