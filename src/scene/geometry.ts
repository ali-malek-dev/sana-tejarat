import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Container } from '../constants/port-layout';

export const containerGeometry = () => new RoundedBoxGeometry(Container.length, Container.height, Container.width, 2, 0.14);

/** A box mesh that casts and receives shadows, centred at (x, y, z). */
export const block = (
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
};

const UP = new THREE.Vector3(0, 1, 0);

/** A square-section strut running from a to b (for crane frames, stays, poles). */
export const strut = (a: THREE.Vector3, b: THREE.Vector3, thickness: number, material: THREE.Material) => {
  const direction = new THREE.Vector3().subVectors(b, a);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(thickness, direction.length(), thickness), material);
  mesh.position.copy(a).addScaledVector(direction, 0.5);
  mesh.quaternion.setFromUnitVectors(UP, direction.normalize());
  mesh.castShadow = true;
  return mesh;
};
