export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Local 0..1 progress of `u` through a [start, end] window. */
export const within = (u: number, [start, end]: readonly [number, number]) => clamp01((u - start) / (end - start));

export const smooth = (t: number) => t * t * (3 - 2 * t);

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
