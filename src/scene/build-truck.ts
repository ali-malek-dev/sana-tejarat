import * as THREE from 'three';
import { TRUCK_CHASSIS_TOP } from '../constants/port-layout';
import { block } from './geometry';
import type { Materials } from './materials';

const WHEEL_XS = [-5, -3.8, 4.4, 8.6];

/** Terminal tractor with a skeletal chassis; local +x is forward. */
export const buildTruck = (materials: Materials) => {
  const group = new THREE.Group();
  group.add(
    block([12.6, 0.5, 2.5], [0, TRUCK_CHASSIS_TOP - 0.25, 0], materials.steel),
    block([3.2, 3.2, 2.6], [8.3, 2.1, 0], materials.navy),
    block([3.24, 1, 2.64], [8.3, 2.9, 0], materials.navyDeep),
  );
  const wheel = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 14);
  wheel.rotateX(Math.PI / 2);
  WHEEL_XS.forEach((x) =>
    [-1.05, 1.05].forEach((z) => {
      const mesh = new THREE.Mesh(wheel, materials.navyDeep);
      mesh.position.set(x, 0.55, z);
      group.add(mesh);
    }),
  );
  return group;
};
