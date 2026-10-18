export const Chapter = {
  HERO: 'hero',
  IMPORT: 'import',
  UNLOAD: 'unload',
  CUSTOMS: 'customs',
  EXPORT: 'export',
  OVERVIEW: 'overview',
} as const;
export type Chapter = (typeof Chapter)[keyof typeof Chapter];

/**
 * Story time `u` runs from 0 (hero) to CHAPTER_ORDER.length - 1 (overview); chapter i
 * is centred on screen at u = i. Every beat below is a [start, end] window in u.
 */
export const CHAPTER_ORDER: readonly Chapter[] = [
  Chapter.HERO,
  Chapter.IMPORT,
  Chapter.UNLOAD,
  Chapter.CUSTOMS,
  Chapter.EXPORT,
  Chapter.OVERVIEW,
];

export const STORY_END = CHAPTER_ORDER.length - 1;

export const Beat = {
  shipSail: [0.3, 0.85],
  shipBerth: [0.85, 1.25],
  importLift: [1.4, 2.3],
  driveToGate: [2.4, 2.8],
  scan: [2.8, 3.05],
  barrier: [3.05, 3.15],
  driveOut: [3.15, 3.5],
  exportLift: [3.5, 4.05],
  exportUnberth: [4.05, 4.3],
  exportSail: [4.3, 4.6],
} as const satisfies Record<string, readonly [number, number]>;

/** Camera stops, one per chapter: position then look-at target, in metres. */
export const CAMERA_STOPS: readonly { position: [number, number, number]; target: [number, number, number] }[] = [
  { position: [-250, 330, -560], target: [0, 0, -10] },
  { position: [-95, 120, -250], target: [-45, 6, -40] },
  { position: [20, 80, -125], target: [-38, 16, 0] },
  { position: [92, 30, 168], target: [40, 6, 96] },
  { position: [225, 105, -205], target: [105, 8, -30] },
  { position: [0, 820, 100], target: [0, 0, -18] },
];

/** With reduced motion each chapter shows its finished state instead of animating. */
export const SETTLED_U: readonly number[] = [0, 1.3, 2.35, 3.5, 4.62, 5];
