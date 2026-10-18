import * as THREE from 'three';
import { Container, Plinth, QUAY_TOP, Roads, Yard } from '../constants/port-layout';
import { ScenePalette } from '../constants/palette';
import { block, containerGeometry, strut } from './geometry';
import type { Materials } from './materials';
import { createRng } from './rng';

const range = (start: number, end: number, step: number) =>
  Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, index) => start + index * step);

const YARD_COLORS = [ScenePalette.porcelain, 0xe3e7ec, 0xd5dbe2, 0xcbd3dc, ScenePalette.navy, ScenePalette.steel];

/** The plinth, resin water and the quay slab. */
const buildBase = (materials: Materials) => {
  const width = Plinth.maxX - Plinth.minX;
  const length = Plinth.maxZ - Plinth.minZ;
  const plinth = block([width, Plinth.depth, length], [0, -0.6 - Plinth.depth / 2, (Plinth.maxZ + Plinth.minZ) / 2], materials.plinth);
  const water = block([width, 0.6, -Plinth.minZ], [0, -0.3, Plinth.minZ / 2], materials.resin);
  water.castShadow = false;
  const quay = block([width, QUAY_TOP + 0.6, Plinth.maxZ], [0, (QUAY_TOP - 0.6) / 2, Plinth.maxZ / 2], materials.quay);
  quay.castShadow = false;
  const fender = block([width, 1.2, 0.6], [0, QUAY_TOP - 1.4, -0.3], materials.navyDeep);
  const bollards = range(Plinth.minX + 8, Plinth.maxX - 8, 16).map((x) => block([0.9, 0.9, 0.9], [x, QUAY_TOP + 0.45, 1.2], materials.navyDeep));
  return [plinth, water, quay, fender, ...bollards];
};

/** Apron, yard lane and gate road surfaces with a dashed centre line on the gate road. */
const buildRoads = (materials: Materials) => {
  const surface = (size: [number, number], center: [number, number], lift: number) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...size), materials.road);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(center[0], QUAY_TOP + lift, center[1]);
    mesh.receiveShadow = true;
    return mesh;
  };
  const roadStartX = Roads.laneX - 6;
  const dashes = range(roadStartX + 6, Plinth.maxX - 4, 9).map((x) => {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.4), materials.marking);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(x, QUAY_TOP + 0.04, Roads.gateRoadZ);
    return dash;
  });
  return [
    surface([Plinth.maxX - Plinth.minX, 12], [0, Roads.apronZ], 0.02),
    surface([12, Roads.gateRoadZ - Roads.apronZ], [Roads.laneX, (Roads.gateRoadZ + Roads.apronZ) / 2], 0.025),
    surface([Plinth.maxX - roadStartX, 14], [(Plinth.maxX + roadStartX) / 2, Roads.gateRoadZ], 0.03),
    ...dashes,
  ];
};

/** Instanced container stacks in the yard. */
const buildYard = (materials: Materials) => {
  const rng = createRng(7);
  const [gapStart, gapEnd] = Yard.laneGap;
  const bays = range(Yard.minX + Container.length / 2, Yard.maxX - Container.length / 2, Container.baySpacing).filter(
    (x) => x + Container.length / 2 < gapStart || x - Container.length / 2 > gapEnd,
  );
  const slots = Yard.blocks.flatMap(([start, end]) =>
    range(start + Container.width / 2, end - Container.width / 2, Container.rowSpacing).flatMap((z) =>
      bays.flatMap((x) => {
        const tiers = Math.floor(rng() * 4.4);
        return range(0, tiers - 1, 1)
          .map((tier) => new THREE.Vector3(x, QUAY_TOP + Container.height / 2 + tier * Container.height, z));
      }),
    ),
  );
  const yard = new THREE.InstancedMesh(containerGeometry(), materials.container, slots.length);
  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();
  slots.forEach((slot, index) => {
    yard.setMatrixAt(index, matrix.makeTranslation(slot.x, slot.y, slot.z));
    const pick = rng();
    yard.setColorAt(index, color.setHex(YARD_COLORS[pick < 0.8 ? Math.floor(pick * 5) : pick < 0.93 ? 4 : 5]));
  });
  yard.castShadow = true;
  yard.receiveShadow = true;
  return yard;
};

/** Floodlight masts along the yard edges. */
const buildMasts = (materials: Materials) =>
  [29, 54, 81].flatMap((z) =>
    range(-170, 170, 68).flatMap((x) => [
      strut(new THREE.Vector3(x, QUAY_TOP, z), new THREE.Vector3(x, QUAY_TOP + 26, z), 0.5, materials.porcelainShade),
      block([3, 0.8, 1.2], [x, QUAY_TOP + 26.2, z], materials.navyDeep),
    ]),
  );

/** Low administrative buildings west of the gate road. */
const buildOffices = (materials: Materials) =>
  [
    { size: [34, 10, 14], at: [-150, 106] },
    { size: [22, 16, 14], at: [-118, 106] },
    { size: [26, 7, 12], at: [-86, 107] },
    { size: [18, 12, 12], at: [-58, 107] },
  ].map(({ size: [w, h, d], at: [x, z] }) => block([w, h, d], [x, QUAY_TOP + h / 2, z], materials.porcelain));

/** Customs gate: canopy, scanning arch with a moving light sheet, and a lifting barrier. */
const buildCustomsGate = (materials: Materials) => {
  const group = new THREE.Group();
  const x = Roads.gateX;
  const z = Roads.gateRoadZ;
  const roofY = QUAY_TOP + 9;
  [-9, 9].forEach((dx) =>
    [-8.5, 8.5].forEach((dz) =>
      group.add(strut(new THREE.Vector3(x + dx, QUAY_TOP, z + dz), new THREE.Vector3(x + dx, roofY, z + dz), 0.8, materials.porcelain)),
    ),
  );
  group.add(block([22, 0.9, 20], [x, roofY + 0.45, z], materials.porcelain));
  group.add(block([22.2, 0.5, 20.2], [x, roofY - 0.05, z], materials.navyDeep));

  // Scanning arch.
  [-5.6, 5.6].forEach((dz) => group.add(block([1.2, 7, 1.2], [x, QUAY_TOP + 3.5, z + dz], materials.navy)));
  group.add(block([1.2, 1.2, 12.4], [x, QUAY_TOP + 7.4, z], materials.navy));
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(10, 6.6), materials.scan);
  scan.rotation.y = Math.PI / 2;
  scan.position.set(x, QUAY_TOP + 3.4, z);
  group.add(scan);

  // Booth and barrier at the exit side.
  group.add(block([3.4, 3.4, 3.4], [x + 6, QUAY_TOP + 1.7, z + 11], materials.porcelainShade));
  const barrier = new THREE.Group();
  barrier.position.set(x + 13, QUAY_TOP + 1.3, z - 6.6);
  const arm = block([0.4, 0.4, 13], [0, 0, 6.5], materials.navy);
  barrier.add(arm, block([0.9, 2.6, 0.9], [0, -0.7, -0.5], materials.navyDeep));
  group.add(barrier);

  return { group, scan, barrier };
};

export const buildPort = (materials: Materials) => {
  const group = new THREE.Group();
  const gate = buildCustomsGate(materials);
  group.add(...buildBase(materials), ...buildRoads(materials), buildYard(materials), ...buildMasts(materials), ...buildOffices(materials), gate.group);
  return { group, gate };
};
