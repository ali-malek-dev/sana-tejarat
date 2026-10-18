import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ScenePalette } from '../constants/palette';
import { CAMERA_STOPS, SETTLED_U, STORY_END } from '../constants/story';
import { createMaterials } from './materials';
import { lerp, smooth } from './timing';
import { buildWorld } from './world';

const FOV = 30;
const REFERENCE_ASPECT = 16 / 9;
const MAX_FOV = 58;
const DAMPING = 5;
const INTRO_SECONDS = 2.6;
const WIDE_LAYOUT = 960;
/** Shift the frame so the action sits beside the text column (desktop) or above the text card (mobile). */
const DESKTOP_SHIFT_X = 0.16;
const MOBILE_SHIFT_Y = 0.2;

const toVectors = (pick: 'position' | 'target') => CAMERA_STOPS.map((stop) => new THREE.Vector3(...stop[pick]));

export interface StageOptions {
  reducedMotion: boolean;
}

/** Owns the renderer and camera; renders only while something is changing. */
export const createStage = (canvas: HTMLCanvasElement, { reducedMotion }: StageOptions) => {
  const isSmall = Math.min(window.innerWidth, window.innerHeight) < 700;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45;

  scene.add(new THREE.HemisphereLight(ScenePalette.sky, ScenePalette.plinth, 0.7));
  // Low western sun: long shadows give the porcelain model its relief.
  const sun = new THREE.DirectionalLight(ScenePalette.sun, 3.2);
  sun.position.set(-260, 190, 130);
  sun.target.position.set(0, 0, -10);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(isSmall ? 2048 : 4096);
  Object.assign(sun.shadow.camera, { left: -260, right: 260, top: 200, bottom: -200, near: 50, far: 800 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.4;
  scene.add(sun, sun.target);

  const world = buildWorld(scene, createMaterials());
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 3000);
  const positions = new THREE.CatmullRomCurve3(toVectors('position'), false, 'centripetal');
  const targets = new THREE.CatmullRomCurve3(toVectors('target'), false, 'centripetal');
  const lookAt = new THREE.Vector3();
  const introFrom = new THREE.Vector3(...CAMERA_STOPS[0].position).multiplyScalar(1.45).add(new THREE.Vector3(0, 160, 0));

  let targetU = 0;
  let currentU = 0;
  const introStart = performance.now();
  let introElapsed = reducedMotion ? INTRO_SECONDS : 0;
  let running = false;
  let visible = true;
  let lastTime = 0;

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Keep the horizontal field of view on portrait screens so the model is not cropped.
    const horizontal = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * REFERENCE_ASPECT);
    camera.fov = camera.aspect < REFERENCE_ASPECT ? Math.min(MAX_FOV, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(horizontal / 2) / camera.aspect))) : FOV;
    if (width >= WIDE_LAYOUT) camera.setViewOffset(width, height, width * DESKTOP_SHIFT_X, 0, width, height);
    else camera.setViewOffset(width, height, 0, height * MOBILE_SHIFT_Y, width, height);
    camera.updateProjectionMatrix();
    renderFrame();
  };

  const placeCamera = () => {
    // Ease each leg between stops so the camera settles while a chapter's text is read.
    const leg = Math.min(Math.floor(currentU), STORY_END - 1);
    const t = (leg + smooth(currentU - leg)) / STORY_END;
    positions.getPoint(t, camera.position);
    targets.getPoint(t, lookAt);
    if (introElapsed < INTRO_SECONDS) {
      const intro = 1 - (1 - introElapsed / INTRO_SECONDS) ** 3;
      camera.position.set(
        lerp(introFrom.x, camera.position.x, intro),
        lerp(introFrom.y, camera.position.y, intro),
        lerp(introFrom.z, camera.position.z, intro),
      );
    }
    camera.lookAt(lookAt);
  };

  const renderFrame = () => {
    world.apply(reducedMotion ? SETTLED_U[Math.round(currentU)] : currentU);
    placeCamera();
    renderer.render(scene, camera);
  };

  const tick = (time: number) => {
    // Wall-clock based so slow devices finish the intro and catch up instead of crawling.
    const delta = Math.min(0.25, Math.max(0, (time - lastTime) / 1000));
    lastTime = time;
    if (!reducedMotion) introElapsed = Math.min(INTRO_SECONDS, (time - introStart) / 1000);
    currentU = reducedMotion ? targetU : lerp(currentU, targetU, 1 - Math.exp(-DAMPING * delta));
    if (Math.abs(currentU - targetU) < 1e-4) currentU = targetU;
    renderFrame();
    const settled = currentU === targetU && introElapsed >= INTRO_SECONDS;
    if (settled || !visible) {
      running = false;
      return;
    }
    requestAnimationFrame(tick);
  };

  const wake = () => {
    if (running || !visible) return;
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(tick);
  };

  new ResizeObserver(resize).observe(canvas);
  resize();
  wake();

  return {
    /** Story time from the scroll position, 0..STORY_END. */
    setProgress: (u: number) => {
      targetU = reducedMotion ? Math.round(u) : u;
      wake();
    },
    setVisible: (value: boolean) => {
      visible = value;
      wake();
    },
  };
};
