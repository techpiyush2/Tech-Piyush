import { BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial } from "three";
import vertexShader from "../../shaders/dust/vertex.glsl";
import fragmentShader from "../../shaders/dust/fragment.glsl";
import { room } from ".";
import { sceneWeights } from "../../../animations/scenes";
import { renderer } from "../../core/renderer";
import { isFeatureEnabled } from "../../../utils/features";
import gsap from "gsap";

// Subtle floating dust motes drifting through the hero room volume. They tint
// warmer by day and cooler/bluer at night to match the day/night toggle.
const PARTICLE_COUNT = 60;

// Room volume the dust wanders within (covers the desk/wall area roughly).
const VOLUME = { x: 2.4, y: 4.0, z: 3.4, cx: -0.8, cy: 2.5, cz: -1.0 };

let points: Points | null = null;
let material: ShaderMaterial | null = null;

const colorDay = new Color("#fff4d6");
const colorNight = new Color("#9fb6ff");
const tmpColor = new Color();

const uniforms = {
  uTime: { value: 0 },
  uColor: { value: new Color("#fff4d6") },
};

const dayNightEnabled = isFeatureEnabled("dayNight");

const init = () => {
  if (points) return;

  const geometry = new BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const seeds = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = VOLUME.cx + (Math.random() - 0.5) * VOLUME.x;
    positions[i3 + 1] = VOLUME.cy + (Math.random() - 0.5) * VOLUME.y;
    positions[i3 + 2] = VOLUME.cz + (Math.random() - 0.5) * VOLUME.z;
    seeds[i] = Math.random();
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));

  material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
  });

  points = new Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = 5;

  room.group.add(points);

  gsap.ticker.add(tick);
};

const tick = () => {
  if (!points || !material) return;

  const visible = sceneWeights.hero > 0.05;
  if (points.visible !== visible) points.visible = visible;
  if (!visible) return;

  uniforms.uTime.value = gsap.ticker.time;

  if (dayNightEnabled) {
    const blend = renderer.getDayNightBlend();
    tmpColor.copy(colorDay).lerp(colorNight, blend);
    uniforms.uColor.value.copy(tmpColor);
  }
};

const destroy = () => {
  gsap.ticker.remove(tick);
  if (points) {
    room.group.remove(points);
    points.geometry.dispose();
  }
  material?.dispose();
  material = null;
  points = null;
};

export const dust = { init, destroy };
