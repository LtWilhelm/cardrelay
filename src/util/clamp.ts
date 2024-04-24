export function clamp(val: number, max: number, min: number) {
  return Math.max(min, Math.min(max, val));
}
