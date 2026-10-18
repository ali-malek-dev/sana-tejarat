/**
 * Scene palette. Brass is reserved for the visitor's own shipment — nothing else
 * in the model is ever brass, so the eye always knows which container is "yours".
 */
export const ScenePalette = {
  background: 0x081629,
  plinth: 0x0f2440,
  resin: 0x0c2342,
  porcelain: 0xeceff2,
  porcelainShade: 0xd9dee4,
  quay: 0xe2e6ea,
  road: 0xc9d0d8,
  marking: 0xf7f8fa,
  navy: 0x1d3a63,
  navyDeep: 0x13294a,
  steel: 0x9aa8b8,
  brass: 0xc8a050,
  scan: 0xdfeaff,
  sun: 0xffe6c4,
  sky: 0xd4dceb,
} as const;
