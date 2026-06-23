import gsap from "gsap";
import { avatar } from ".";
import { sceneWeights } from "../../../animations/scenes";
import { animations as avatarAnimations } from "./animations";

import type { Bone } from "three";

// Procedural idle "life" for the avatar: a gentle, looping head sway layered
// on top of the baked idle/typing clips. Breathing + blinking already come
// from the clips and face shader; this adds subtle head motion so the idle
// state never feels frozen. Applied directly to headBone rotation, restored
// on destroy.
let headBone: Bone | null = null;
let swayTween: gsap.core.Tween | null = null;
let restRotationZ = 0;

const init = () => {
  const mesh = avatar.getMesh();
  if (!mesh) return;

  headBone = mesh.getObjectByName("headBone") as Bone | null;
  if (!headBone) return;

  restRotationZ = headBone.rotation.z;

  // Gentle figure-8 sway on the head, looping forever.
  swayTween = gsap.to(headBone.rotation, {
    z: `+=${0.04}`,
    duration: 3.2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  gsap.ticker.add(tick);
};

const tick = () => {
  if (!headBone) return;
  // Only apply the sway visually while seated & idle (hero scene). When the
  // typing or left-desktop action has weight, let those drive the head.
  const idle = avatarAnimations.actions.get("desktop-idle");
  const isIdle = sceneWeights.hero > 0.5 && (!idle || idle.weight > 0.5);
  swayTween?.paused(!isIdle);
};

const destroy = () => {
  gsap.ticker.remove(tick);
  swayTween?.kill();
  if (headBone) headBone.rotation.z = restRotationZ;
  headBone = null;
};

export const idleLife = { init, destroy };
