import { Box3, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, DoubleSide } from "three";
import { room } from ".";
import { resources } from "../../../utils/resources";
import { raycast } from "../../utils/raycast";
import { sceneWeights } from "../../../animations/scenes";
import { playSound } from "../../../features/sounds/utils/sounds";
import gsap from "gsap";

import type { Texture } from "three";
import type { ClickableBox3 } from "../../types";

// Project thumbnails shown in the wall photo frame, cycled on click.
const FRAME_PROJECTS = [
  "frame-project-cubewar",
  "frame-project-particles",
  "frame-project-pokedex",
  "frame-project-quibbo",
  "frame-project-sharkie",
  "frame-project-streakon",
] as const;

// Frame is the wall picture on the left wall: world center ~(-2.64, 3.27, -2.89),
// facing +x, ~1.3 wide x 1.2 tall.
const FRAME_POSITION = { x: -2.638, y: 3.265, z: -2.89 };
const FRAME_SIZE = { w: 1.3, h: 1.2 };

let mesh: Mesh | null = null;
let material: MeshBasicMaterial | null = null;
let box3: ClickableBox3 | null = null;

let currentIndex = 0;
let isTransitioning = false;
const hoverScale = { value: 1 };

const init = () => {
  initMesh();
};

const initMesh = () => {
  if (mesh) return;

  const texture = resources.items[FRAME_PROJECTS[0]] as Texture;
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = false;

  material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: DoubleSide,
  });

  const geometry = new PlaneGeometry(FRAME_SIZE.w, FRAME_SIZE.h);
  mesh = new Mesh(geometry, material);

  // Frame faces +x (the room interior), so rotate so its front points that way.
  mesh.position.set(FRAME_POSITION.x, FRAME_POSITION.y, FRAME_POSITION.z);
  mesh.rotation.y = Math.PI / 2;

  room.group.add(mesh);

  box3 = new Box3().setFromObject(mesh);
  box3.onClick = handleClick;
  box3.hoverSound = "hover";
  box3.onHoverChange = (isHovering) => {
    gsap.to(hoverScale, {
      value: isHovering ? 1.04 : 1,
      duration: 0.3,
      ease: "power2.out",
      overwrite: true,
    });
  };
  raycast.boxesToCheck.push(box3);

  gsap.ticker.add(tick);
};

const handleClick = () => {
  if (isTransitioning) return;
  if (sceneWeights.hero < 0.5) return;

  isTransitioning = true;
  playSound("click");

  const nextIndex = (currentIndex + 1) % FRAME_PROJECTS.length;
  const nextTexture = resources.items[FRAME_PROJECTS[nextIndex]] as Texture;
  nextTexture.colorSpace = SRGBColorSpace;
  nextTexture.flipY = false;

  const tl = gsap.timeline({
    onComplete: () => {
      currentIndex = nextIndex;
      isTransitioning = false;
    },
  });

  // Fade + zoom out current image
  tl.to(material!, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0);
  tl.to(mesh!.scale, { x: 0.9, y: 0.9, duration: 0.25, ease: "power2.in" }, 0);

  // Swap texture and fade + zoom in the next image
  tl.add(() => {
    material!.map = nextTexture;
    material!.needsUpdate = true;
  });
  tl.fromTo(material!, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
  tl.fromTo(mesh!.scale, { x: 1.12, y: 1.12 }, { x: 1, y: 1, duration: 0.35, ease: "power2.out" }, "<");
};

const tick = () => {
  if (!mesh || !box3) return;

  // Only show/clickable while the hero scene is visible.
  const visible = sceneWeights.hero > 0.05;
  if (mesh.visible !== visible) mesh.visible = visible;

  if (!visible) return;

  // Recompute the box each frame (cheap) to stay aligned with the mesh.
  box3.setFromObject(mesh);
  box3.expandByScalar(0.1);

  // Apply combined idle breathing + hover scale.
  const breathe = 1 + Math.sin(gsap.ticker.time * 0.8) * 0.004;
  const target = breathe * hoverScale.value;
  mesh.scale.x += (target - mesh.scale.x) * 0.2;
  mesh.scale.y += (target - mesh.scale.y) * 0.2;
};

const destroy = () => {
  gsap.ticker.remove(tick);
  gsap.killTweensOf(hoverScale);
  if (material) {
    gsap.killTweensOf(material);
  }
  if (mesh) {
    gsap.killTweensOf(mesh.scale);
  }
  if (box3) {
    const index = raycast.boxesToCheck.indexOf(box3);
    if (index !== -1) raycast.boxesToCheck.splice(index, 1);
  }
  material?.dispose();
  mesh?.geometry.dispose();
  material = null;
  mesh = null;
  box3 = null;
};

export const photoFrame = { init, destroy };
