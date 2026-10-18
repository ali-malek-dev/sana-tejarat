import * as THREE from 'three';
import {
  CRANE_XS,
  Container,
  Crane,
  EXPORT_CRANE_X,
  IMPORT_CRANE_X,
  QUAY_TOP,
  Roads,
  Ship,
  TRUCK_CHASSIS_TOP,
} from '../constants/port-layout';
import { Beat } from '../constants/story';
import { buildCrane } from './build-crane';
import { buildPort } from './build-port';
import { buildShip, buildTug } from './build-ship';
import { buildTruck } from './build-truck';
import { containerGeometry } from './geometry';
import type { Materials } from './materials';
import { easeInOut, lerp, smooth, within } from './timing';

const ON_TRUCK_Y = QUAY_TOP + TRUCK_CHASSIS_TOP + Container.height / 2;
const SPREADER_CLEARANCE = Container.height / 2 + 0.35;
const IMPORT_SHIP_START = { x: -130, z: -72 };
const EXPORT_SHIP_OFFSHORE_Z = -72;
const EXPORT_SAIL_DISTANCE = 40;

const Carry = { SOURCE: 'source', HOIST: 'hoist', TARGET: 'target' } as const;
type Carry = (typeof Carry)[keyof typeof Carry];

interface HoistPose {
  trolleyZ: number;
  spreaderY: number;
  carry: Carry;
}

/** Crane cycle: travel, lower, lift with box, travel, set down, release and raise. */
const hoistPose = (t: number, from: { y: number; z: number }, to: { y: number; z: number }): HoistPose => {
  const top = Crane.hoistTopY;
  const grabFrom = from.y + SPREADER_CLEARANCE;
  const grabTo = to.y + SPREADER_CLEARANCE;
  const phase = (start: number, end: number) => smooth(within(t, [start, end]));
  if (t < 0.18) return { trolleyZ: lerp(Crane.parkZ, from.z, phase(0, 0.18)), spreaderY: top, carry: Carry.SOURCE };
  if (t < 0.34) return { trolleyZ: from.z, spreaderY: lerp(top, grabFrom, phase(0.18, 0.34)), carry: Carry.SOURCE };
  if (t < 0.5) return { trolleyZ: from.z, spreaderY: lerp(grabFrom, top, phase(0.34, 0.5)), carry: Carry.HOIST };
  if (t < 0.66) return { trolleyZ: lerp(from.z, to.z, phase(0.5, 0.66)), spreaderY: top, carry: Carry.HOIST };
  if (t < 0.82) return { trolleyZ: to.z, spreaderY: lerp(top, grabTo, phase(0.66, 0.82)), carry: Carry.HOIST };
  return { trolleyZ: to.z, spreaderY: lerp(grabTo, top, phase(0.82, 1)), carry: Carry.TARGET };
};

const headingOf = (tangent: THREE.Vector3) => Math.atan2(-tangent.z, tangent.x);

/** Builds the whole port and returns `apply(u)`, which poses every moving part for story time u. */
export const buildWorld = (scene: THREE.Scene, materials: Materials) => {
  const port = buildPort(materials);
  const importShip = buildShip(materials, 11);
  const exportShip = buildShip(materials, 29);
  const tugs = [buildTug(materials), buildTug(materials)];
  const cranes = CRANE_XS.map((x) => buildCrane(materials, x));
  const importCrane = cranes[CRANE_XS.indexOf(IMPORT_CRANE_X)];
  const exportCrane = cranes[CRANE_XS.indexOf(EXPORT_CRANE_X)];
  const importTruck = buildTruck(materials);
  const exportTruck = buildTruck(materials);
  const idleTrucks = [
    { x: -80, z: Roads.apronZ },
    { x: 70, z: Roads.apronZ },
  ].map(({ x, z }) => {
    const truck = buildTruck(materials);
    truck.position.set(x, QUAY_TOP, z);
    return truck;
  });

  const brassBox = () => {
    const mesh = new THREE.Mesh(containerGeometry(), materials.brass);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };
  const importCargo = brassBox();
  const exportCargo = brassBox();

  scene.add(
    port.group,
    importShip.group,
    exportShip.group,
    ...tugs,
    ...cranes.map((crane) => crane.group),
    importTruck,
    exportTruck,
    ...idleTrucks,
    importCargo,
    exportCargo,
  );

  const importBerthX = IMPORT_CRANE_X - importShip.goldSlot.x;
  const exportBerthX = EXPORT_CRANE_X - exportShip.goldSlot.x;
  exportShip.group.position.set(exportBerthX, 0, Ship.berthZ);
  exportTruck.position.set(EXPORT_CRANE_X, QUAY_TOP, Roads.apronZ);

  const gatePoint = new THREE.Vector3(Roads.gateX, QUAY_TOP, Roads.gateRoadZ);
  const toGate = new THREE.CatmullRomCurve3(
    [
      [IMPORT_CRANE_X, Roads.apronZ],
      [-24, Roads.apronZ],
      [Roads.laneX - 2, 20],
      [Roads.laneX, 34],
      [Roads.laneX, 80],
      [Roads.laneX + 4, Roads.gateRoadZ - 2],
      [16, Roads.gateRoadZ],
      [Roads.gateX, Roads.gateRoadZ],
    ].map(([x, z]) => new THREE.Vector3(x, QUAY_TOP, z)),
    false,
    'centripetal',
  );
  const fromGate = new THREE.LineCurve3(gatePoint, new THREE.Vector3(182, QUAY_TOP, Roads.gateRoadZ));
  const onTruck = new THREE.Vector3();

  const placeOnTruck = (cargo: THREE.Mesh, truck: THREE.Object3D) => {
    truck.updateMatrixWorld();
    cargo.position.copy(truck.localToWorld(onTruck.set(0, TRUCK_CHASSIS_TOP + Container.height / 2, 0)));
    cargo.rotation.y = truck.rotation.y;
  };

  const placeHoisted = (cargo: THREE.Mesh, craneX: number, pose: HoistPose) => {
    cargo.position.set(craneX, pose.spreaderY - SPREADER_CLEARANCE, pose.trolleyZ);
    cargo.rotation.y = 0;
  };

  const apply = (u: number) => {
    // Import ship sails in, then tugs push it onto the berth.
    const shipX = lerp(IMPORT_SHIP_START.x, importBerthX, easeInOut(within(u, Beat.shipSail)));
    const shipZ = lerp(IMPORT_SHIP_START.z, Ship.berthZ, smooth(within(u, Beat.shipBerth)));
    importShip.group.position.set(shipX, 0, shipZ);
    tugs.forEach((tug, index) => tug.position.set(shipX + (index === 0 ? -30 : 26), 0, shipZ - Ship.beam / 2 - 6));

    // Import crane moves the brass box from the ship onto the waiting truck.
    const importPose = hoistPose(within(u, Beat.importLift), { y: importShip.goldSlot.y, z: Ship.berthZ + importShip.goldSlot.z }, { y: ON_TRUCK_Y, z: Roads.apronZ });
    importCrane.setHoist(importPose.trolleyZ, importPose.spreaderY);

    // Truck drives through the yard to the customs gate, waits for the scan, then leaves.
    const outbound = within(u, Beat.driveOut);
    const curve = outbound > 0 ? fromGate : toGate;
    const along = outbound > 0 ? easeInOut(outbound) : easeInOut(within(u, Beat.driveToGate));
    importTruck.position.copy(curve.getPointAt(along));
    importTruck.rotation.y = headingOf(curve.getTangentAt(along));

    if (importPose.carry === Carry.SOURCE) {
      importCargo.position.set(shipX + importShip.goldSlot.x, importShip.goldSlot.y, shipZ + importShip.goldSlot.z);
      importCargo.rotation.y = 0;
    } else if (importPose.carry === Carry.HOIST) {
      placeHoisted(importCargo, IMPORT_CRANE_X, importPose);
    } else {
      placeOnTruck(importCargo, importTruck);
    }

    const scan = within(u, Beat.scan);
    port.gate.scan.position.x = Roads.gateX - 8 + scan * 18;
    (port.gate.scan.material as THREE.MeshBasicMaterial).opacity = Math.sin(Math.PI * scan) * 0.75;
    port.gate.barrier.rotation.x = -smooth(within(u, Beat.barrier)) * 1.4;

    // Export: crane loads the second brass box, then the ship leaves the berth.
    const exportZ = lerp(Ship.berthZ, EXPORT_SHIP_OFFSHORE_Z, smooth(within(u, Beat.exportUnberth)));
    const exportX = exportBerthX + EXPORT_SAIL_DISTANCE * easeInOut(within(u, Beat.exportSail));
    exportShip.group.position.set(exportX, 0, exportZ);

    const exportPose = hoistPose(within(u, Beat.exportLift), { y: ON_TRUCK_Y, z: Roads.apronZ }, { y: exportShip.goldSlot.y, z: Ship.berthZ + exportShip.goldSlot.z });
    exportCrane.setHoist(exportPose.trolleyZ, exportPose.spreaderY);
    if (exportPose.carry === Carry.SOURCE) {
      placeOnTruck(exportCargo, exportTruck);
    } else if (exportPose.carry === Carry.HOIST) {
      placeHoisted(exportCargo, EXPORT_CRANE_X, exportPose);
    } else {
      exportCargo.position.set(exportX + exportShip.goldSlot.x, exportShip.goldSlot.y, exportZ + exportShip.goldSlot.z);
      exportCargo.rotation.y = 0;
    }
  };

  return { apply };
};
