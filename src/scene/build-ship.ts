import * as THREE from 'three';
import { Container, Ship } from '../constants/port-layout';
import { ScenePalette } from '../constants/palette';
import { block, containerGeometry } from './geometry';
import type { Materials } from './materials';
import { createRng } from './rng';

const BAY_COUNT = 7;
const ROW_COUNT = 7;
const FIRST_BAY_X = -42;
/** The brass box always sits on the top tier so it is never hidden by neighbouring stacks. */
const GOLD_STACK_TIERS = 3;

const CARGO_COLORS = [ScenePalette.porcelain, 0xdfe4ea, 0xd3dae2, ScenePalette.navy, ScenePalette.steel];

const bayX = (bay: number) => FIRST_BAY_X + bay * Container.baySpacing;
const rowZ = (row: number) => (row - (ROW_COUNT - 1) / 2) * Container.rowSpacing;
const tierY = (tier: number) => Ship.deckY + Container.height / 2 + tier * Container.height;

/** Hull outline seen from above: square stern, tapered bow at +x. */
const hullShape = () => {
  const half = Ship.length / 2;
  const beam = Ship.beam / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-half, -beam);
  shape.lineTo(half - 20, -beam);
  shape.quadraticCurveTo(half - 2, -beam * 0.8, half, 0);
  shape.quadraticCurveTo(half - 2, beam * 0.8, half - 20, beam);
  shape.lineTo(-half, beam);
  shape.closePath();
  return shape;
};

/** A feeder container ship. Its cargo is instanced; one stack is kept one tier short for the brass container. */
export const buildShip = (materials: Materials, seed: number) => {
  const group = new THREE.Group();
  const rng = createRng(seed);

  const hullGeometry = new THREE.ExtrudeGeometry(hullShape(), { depth: Ship.deckY + Ship.draft, bevelEnabled: false });
  hullGeometry.rotateX(-Math.PI / 2);
  hullGeometry.translate(0, -Ship.draft, 0);
  const hull = new THREE.Mesh(hullGeometry, [materials.porcelainShade, materials.navy]);
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  const sternX = -Ship.length / 2 + 6;
  group.add(
    block([10, 16, 17], [sternX, Ship.deckY + 8, 0], materials.porcelain),
    block([10.3, 1.3, 17.3], [sternX, Ship.deckY + 13.5, 0], materials.navyDeep),
    block([4.5, 1, 23], [sternX + 2, Ship.deckY + 16.4, 0], materials.porcelain),
    block([4, 6, 4], [sternX - 2.5, Ship.deckY + 19, 0], materials.navy),
  );

  const slots = Array.from({ length: BAY_COUNT }, (_, bay) => bay).flatMap((bay) =>
    Array.from({ length: ROW_COUNT }, (_, row) => row).flatMap((row) => {
      const isGoldStack = bay === Ship.goldBay && row === Ship.goldRow;
      const edgeBay = bay === 0 || bay === BAY_COUNT - 1;
      const tiers = isGoldStack ? GOLD_STACK_TIERS : 1 + Math.floor(rng() * (edgeBay ? 2.5 : 3.6));
      return Array.from({ length: tiers }, (_, tier) => ({ x: bayX(bay), y: tierY(tier), z: rowZ(row) }));
    }),
  );

  const cargo = new THREE.InstancedMesh(containerGeometry(), materials.container, slots.length);
  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();
  slots.forEach((slot, index) => {
    cargo.setMatrixAt(index, matrix.makeTranslation(slot.x, slot.y, slot.z));
    const pick = rng();
    cargo.setColorAt(index, color.setHex(CARGO_COLORS[pick < 0.62 ? Math.floor(pick * 4.8) : pick < 0.86 ? 3 : 4]));
  });
  cargo.castShadow = true;
  cargo.receiveShadow = true;
  group.add(cargo);

  /** Centre of the brass container's slot, in ship-local coordinates. */
  const goldSlot = new THREE.Vector3(bayX(Ship.goldBay), tierY(GOLD_STACK_TIERS), rowZ(Ship.goldRow));

  return { group, goldSlot };
};

/** A small harbour tug, bow pointing +z (towards the quay, pushing). */
export const buildTug = (materials: Materials) => {
  const group = new THREE.Group();
  group.add(
    block([5, 3.4, 11], [0, -0.3, 0], materials.navy),
    block([3.8, 2.4, 4.2], [0, 2.6, -0.6], materials.porcelain),
    block([1, 1.6, 1], [0, 4.6, -1.8], materials.navyDeep),
  );
  return group;
};
