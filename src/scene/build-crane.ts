import * as THREE from 'three';
import { Crane, QUAY_TOP } from '../constants/port-layout';
import { block, strut } from './geometry';
import type { Materials } from './materials';

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Ship-to-shore gantry crane. Exposes a hoist control in world coordinates. */
export const buildCrane = (materials: Materials, x: number) => {
  const group = new THREE.Group();
  group.position.set(x, QUAY_TOP, 0);
  const halfSpan = Crane.legSpanX / 2;
  const top = Crane.girderY - QUAY_TOP - 3;
  const legZs = [Crane.seaLegZ, Crane.landLegZ];

  // Legs, portal beams, sill beams.
  [-halfSpan, halfSpan].forEach((legX) => {
    legZs.forEach((legZ) => group.add(strut(v(legX, 0, legZ), v(legX, top, legZ), 1.5, materials.porcelain)));
    group.add(
      strut(v(legX, top, Crane.seaLegZ), v(legX, top, Crane.landLegZ), 1.4, materials.porcelain),
      strut(v(legX, 14, Crane.seaLegZ), v(legX, 14, Crane.landLegZ), 1, materials.porcelain),
    );
  });
  legZs.forEach((legZ) => group.add(strut(v(-halfSpan, top, legZ), v(halfSpan, top, legZ), 1.4, materials.porcelain)));

  // Boom girders, A-frame and stays.
  const girderY = top + 2;
  const boomLength = Crane.boomBackZ - Crane.boomFrontZ;
  const boomMidZ = (Crane.boomBackZ + Crane.boomFrontZ) / 2;
  const apexY = top + 18;
  const apexZ = (Crane.seaLegZ + Crane.landLegZ) / 2;
  [-3, 3].forEach((side) => {
    group.add(
      block([1.1, 2.2, boomLength], [side, girderY, boomMidZ], materials.porcelain),
      strut(v(side * 2.6, top, Crane.seaLegZ), v(side, apexY, apexZ), 1, materials.porcelain),
      strut(v(side * 2.6, top, Crane.landLegZ), v(side, apexY, apexZ), 1, materials.porcelain),
      strut(v(side, apexY, apexZ), v(side, girderY + 1, Crane.boomFrontZ + 2), 0.35, materials.steel),
      strut(v(side, apexY, apexZ), v(side, girderY + 1, Crane.boomBackZ - 2), 0.35, materials.steel),
    );
  });
  group.add(block([9, 4.5, 8], [0, girderY + 3.2, Crane.boomBackZ - 5], materials.navy));

  // Trolley, spreader and hoist cables.
  const trolley = block([4.6, 1.6, 5], [0, girderY, Crane.parkZ], materials.navy);
  const spreader = block([12.2, 0.7, 2.8], [0, 0, Crane.parkZ], materials.navyDeep);
  const cables = [-4, 4].map((cableX) => {
    const cable = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1, 0.16), materials.steel);
    cable.position.x = cableX;
    return cable;
  });
  group.add(trolley, spreader, ...cables);

  const cableTop = girderY - 0.8;
  /** Move the trolley to world z and hang the spreader's centre at world y. */
  const setHoist = (trolleyZ: number, spreaderY: number) => {
    const localY = spreaderY - QUAY_TOP;
    trolley.position.z = trolleyZ;
    spreader.position.set(0, localY, trolleyZ);
    const length = cableTop - (localY + 0.35);
    cables.forEach((cable) => {
      cable.scale.y = length;
      cable.position.set(cable.position.x, localY + 0.35 + length / 2, trolleyZ);
    });
  };
  setHoist(Crane.parkZ, Crane.hoistTopY);

  return { group, setHoist };
};

export type CraneRig = ReturnType<typeof buildCrane>;
