import * as THREE from 'three';
import { ScenePalette } from '../constants/palette';

const matte = (color: number, roughness = 0.88) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });

export const createMaterials = () => ({
  porcelain: matte(ScenePalette.porcelain),
  porcelainShade: matte(ScenePalette.porcelainShade),
  quay: matte(ScenePalette.quay, 0.95),
  road: matte(ScenePalette.road, 0.95),
  marking: matte(ScenePalette.marking, 0.9),
  navy: matte(ScenePalette.navy, 0.7),
  navyDeep: matte(ScenePalette.navyDeep, 0.75),
  plinth: matte(ScenePalette.plinth, 0.6),
  steel: matte(ScenePalette.steel, 0.6),
  container: matte(0xffffff, 0.8),
  brass: new THREE.MeshStandardMaterial({
    color: ScenePalette.brass,
    metalness: 0.55,
    roughness: 0.32,
    emissive: ScenePalette.brass,
    emissiveIntensity: 0.18,
    envMapIntensity: 1.6,
  }),
  resin: new THREE.MeshPhysicalMaterial({
    color: ScenePalette.resin,
    roughness: 0.6,
    metalness: 0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.35,
    envMapIntensity: 0.35,
  }),
  scan: new THREE.MeshBasicMaterial({
    color: ScenePalette.scan,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  }),
});

export type Materials = ReturnType<typeof createMaterials>;
