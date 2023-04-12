export function parseTimeToSeconds(timeString: string): number {
  const [value, unit] = timeString.split(/\s+/);
  switch (unit) {
    case 's':
      return parseInt(value);
    case 'm':
      return parseInt(value) * 60;
    case 'h':
      return parseInt(value) * 60 * 60;
    case 'd':
      return parseInt(value) * 60 * 60 * 24;
    default:
      throw new Error(`Invalid time unit: ${unit}`);
  }
}
