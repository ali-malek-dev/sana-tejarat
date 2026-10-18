/** Port model layout, in metres. +x = east, +z = inland (south), sea lies at z < 0. */
export const Plinth = { minX: -200, maxX: 200, minZ: -150, maxZ: 112, depth: 14 } as const;

export const QUAY_TOP = 3;

export const Container = { length: 12, height: 2.6, width: 2.45, baySpacing: 12.6, rowSpacing: 2.65 } as const;

export const Ship = { length: 120, beam: 20, deckY: 6, draft: 4, berthZ: -14, goldBay: 5, goldRow: 5 } as const;

export const Crane = {
  seaLegZ: 3,
  landLegZ: 21,
  legSpanX: 16,
  girderY: 41,
  boomFrontZ: -48,
  boomBackZ: 34,
  parkZ: 14,
  hoistTopY: 36,
} as const;

/** Crane x positions: two at the import berth, two at the export berth. */
export const CRANE_XS = [-80, -40, 70, 110] as const;
export const IMPORT_CRANE_X = -40;
export const EXPORT_CRANE_X = 110;

/** Truck lane under the cranes, the inland lane through the yard, and the gate road. */
export const Roads = { apronZ: 12, laneX: -8, gateRoadZ: 96, gateX: 48 } as const;

/** Yard stack blocks (z ranges), with the lane gap kept clear. */
export const Yard = { blocks: [[33, 50], [58, 76]] as const, minX: -192, maxX: 192, laneGap: [-20, 4] as const };

export const TRUCK_CHASSIS_TOP = 1.55;
