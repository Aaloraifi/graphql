export function formatBytes(bytes: number): string {
if (bytes < 0) return "Invalid size";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const factor = 1000;                    // ← change to 1000

  let index = 0;
  let value = bytes;

  while (value >= factor && index < units.length - 1) {
    value /= factor;
    index++;
  }

  return `${value.toFixed(2)} ${units[index]}`;
}