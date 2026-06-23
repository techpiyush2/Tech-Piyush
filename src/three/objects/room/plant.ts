import { Box3 } from "three";
import { raycast } from "../../utils/raycast";
import { room } from ".";
import { sceneWeights } from "../../../animations/scenes";
import { playSound } from "../../../features/sounds/utils/sounds";
import gsap from "gsap";

import type { Mesh } from "three";
import type { ClickableBox3 } from "../../types";

// The plant is part of room.glb and is already added to room.group by the room
// module. We just attach a click + hover interaction to it: watering triggers a
// subtle grow + leaf-shake, then it settles back to its original scale.
let mesh: Mesh | null = null;
let box3: ClickableBox3 | null = null;
let isAnimating = false;

const restScale = { x: 1, y: 1, z: 1 };
const hoverScale = { value: 1 };

const init = (_mesh: Mesh) => {
  mesh = _mesh;
  restScale.x = mesh.scale.x;
  restScale.y = mesh.scale.y;
  restScale.z = mesh.scale.z;

  box3 = new Box3().setFromObject(mesh);
  box3.onClick = handleClick;
  box3.hoverSound = "hover";
  box3.onHoverChange = (isHovering) => {
    gsap.to(hoverScale, {
      value: isHovering ? 1.05 : 1,
      duration: 0.3,
      ease: "power2.out",
      overwrite: true,
    });
  };
  raycast.boxesToCheck.push(box3);

  gsap.ticker.add(tick);
};

const handleClick = () => {
  if (isAnimating || !mesh) return;
  if (sceneWeights.hero < 0.5) return;

  isAnimating = true;
  playSound("click");

  // Watering: grow up, shake the foliage, settle back down.
  const tl = gsap.timeline({
    onComplete: () => {
      mesh!.scale.set(restScale.x, restScale.y, restScale.z);
      isAnimating = false;
    },
  });

  // Grow phase
  tl.to(
    mesh.scale,
    { x: restScale.x * 1.08, y: restScale.y * 1.12, z: restScale.z * 1.08, duration: 0.5, ease: "power2.out" },
    0,
  );
  // Leaf shake (quick rotations)
  tl.to(mesh.rotation, { z: 0.06, duration: 0.12, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.2);
  tl.to(mesh.rotation, { z: 0, duration: 0.12, ease: "sine.inOut" }, "<");
  // Settle back to rest
  tl.to(mesh.scale, { x: restScale.x, y: restScale.y, z: restScale.z, duration: 0.6, ease: "power2.inOut" }, 0.9);
};

const tick = () => {
  if (!mesh || !box3) return;

  const visible = sceneWeights.hero > 0.05;
  if (mesh.visible !== visible) mesh.visible = visible;
  if (!visible) return;

  box3.setFromObject(mesh);
  box3.expandByScalar(0.12);

  // Idle sway for the foliage (subtle breathing motion).
  if (!isAnimating) {
    const sway = Math.sin(gsap.ticker.time * 0.7) * 0.012;
    const breathe = 1 + Math.sin(gsap.ticker.time * 0.9) * 0.006;
    const target = breathe * hoverScale.value;
    mesh.rotation.z = sway;
    mesh.scale.x = restScale.x * target;
    mesh.scale.z = restScale.z * target;
    // y grows/shrinks a touch with the hover scale too
    mesh.scale.y = restScale.y * target;
  }
};

const destroy = () => {
  gsap.ticker.remove(tick);
  gsap.killTweensOf(hoverScale);
  if (mesh) {
    gsap.killTweensOf(mesh.scale);
    gsap.killTweensOf(mesh.rotation);
    // restore rest scale
    mesh.scale.set(restScale.x, restScale.y, restScale.z);
    mesh.rotation.z = 0;
  }
  if (box3) {
    const index = raycast.boxesToCheck.indexOf(box3);
    if (index !== -1) raycast.boxesToCheck.splice(index, 1);
  }
  box3 = null;
};

export const plant = { init, destroy };
