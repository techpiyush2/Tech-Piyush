import {
  Box3,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  DoubleSide,
  Color,
} from "three";
import { room } from ".";
import { resources } from "../../../utils/resources";
import { raycast } from "../../utils/raycast";
import { sceneWeights } from "../../../animations/scenes";
import { playSound } from "../../../features/sounds/utils/sounds";
import gsap from "gsap";

import type { ClickableBox3 } from "../../types";

// The pin board sits on the left wall above the desk, on the blackboard area.
// Blackboard world bounds: x ~[-2.67,-2.17], y ~[3.4,5.48]. We pin papers in a
// 2x2 cluster inside that region.
const BOARD = {
  // front face position (just off the wall, facing +x)
  x: -2.16,
  z: 0.0,
};

const PIN_OFFSETS = [
  { y: 5.0, z: 1.6 },
  { y: 3.9, z: 1.6 },
] as const;

const PAPER_W = 0.62;
const PAPER_H = 0.7;
const FLOOR_Y = 0.05; // where a fallen paper settles (near the desk surface)

// Paper colors (pinned sticky notes / sketches). Light, slightly varied hues.
const PAPER_COLORS = ["#fbf2e2", "#eef0f7"];

type Paper = {
  group: Group; // holds mesh; we move/rotate the group so the box stays valid
  mesh: Mesh;
  material: MeshBasicMaterial;
  box: ClickableBox3;
  restPos: { y: number; z: number };
  restRotationZ: number;
  isFalling: boolean;
};

let papers: Paper[] = [];
let initialized = false;

const init = () => {
  if (initialized) return;
  initialized = true;

  const pinTexture = resources.items["icon-spritesheet"];
  pinTexture.colorSpace = SRGBColorSpace;

  PIN_OFFSETS.forEach((offset, i) => {
    const group = new Group();

    const material = new MeshBasicMaterial({
      color: new Color(PAPER_COLORS[i % PAPER_COLORS.length]),
      transparent: true,
      side: DoubleSide,
    });
    const geometry = new PlaneGeometry(PAPER_W, PAPER_H);
    const mesh = new Mesh(geometry, material);

    // Face the room interior (+x).
    mesh.rotation.y = Math.PI / 2;

    // Each paper is pinned slightly rotated for a natural look.
    const restRotationZ = (i % 2 === 0 ? -1 : 1) * (0.06 + Math.random() * 0.07);

    group.position.set(BOARD.x, offset.y, offset.z);
    group.rotation.z = restRotationZ;

    group.add(mesh);
    room.group.add(group);

    const box: ClickableBox3 = new Box3().setFromObject(group);
    box.onClick = () => dropPaper(i);
    box.hoverSound = "hover";
    box.onHoverChange = (isHovering) => {
      if (papers[i]!.isFalling) return;
      gsap.to(mesh.scale, {
        x: isHovering ? 1.06 : 1,
        y: isHovering ? 1.06 : 1,
        duration: 0.25,
        ease: "power2.out",
        overwrite: true,
      });
    };
    raycast.boxesToCheck.push(box);

    papers.push({
      group,
      mesh,
      material,
      box,
      restPos: { y: offset.y, z: offset.z },
      restRotationZ,
      isFalling: false,
    });
  });

  gsap.ticker.add(tick);
};

const dropPaper = (index: number) => {
  const paper = papers[index];
  if (!paper || paper.isFalling) return;
  if (sceneWeights.hero < 0.5) return;

  paper.isFalling = true;
  playSound("click");

  const tl = gsap.timeline({
    onComplete: () => scheduleRepin(index),
  });

  // Phase 1: unpin + tumble down with gravity-like easing.
  const tumble = (Math.random() - 0.5) * 2.2;
  const driftZ = (Math.random() - 0.5) * 0.4;

  tl.to(paper.group.position, { y: FLOOR_Y, duration: 0.9, ease: "power2.in" }, 0);
  tl.to(paper.group.position, { z: paper.restPos.z + driftZ, duration: 0.9, ease: "power1.out" }, 0);
  tl.to(paper.group.rotation, { z: paper.restRotationZ + tumble, duration: 0.9, ease: "power1.in" }, 0);
  tl.to(paper.mesh.rotation, { y: Math.PI / 2 + (Math.random() - 0.5) * 0.6, duration: 0.9, ease: "power1.in" }, 0);
};

const scheduleRepin = (index: number) => {
  // Rest on the floor briefly, then re-pin back to the board.
  gsap.delayedCall(0.7, () => repin(index));
};

const repin = (index: number) => {
  const paper = papers[index];
  if (!paper) return;

  const tl = gsap.timeline({
    onComplete: () => {
      paper.isFalling = false;
      paper.mesh.rotation.y = Math.PI / 2;
    },
  });

  // Slide back up to the board position.
  tl.to(paper.group.position, { z: paper.restPos.z, duration: 0.5, ease: "power2.out" }, 0);
  tl.to(paper.group.position, { y: paper.restPos.y, duration: 0.6, ease: "power2.inOut" }, 0);
  tl.to(paper.group.rotation, { z: paper.restRotationZ, duration: 0.6, ease: "power2.inOut" }, 0);
};

const tick = () => {
  const visible = sceneWeights.hero > 0.05;

  for (const paper of papers) {
    if (paper.group.visible !== visible) paper.group.visible = visible;
    if (!visible) continue;

    // Keep the hit box synced to the moving paper (cheap per-frame recompute).
    paper.box.setFromObject(paper.group);
    paper.box.expandByScalar(0.08);
  }
};

const destroy = () => {
  gsap.ticker.remove(tick);
  for (const paper of papers) {
    gsap.killTweensOf(paper.group.position);
    gsap.killTweensOf(paper.group.rotation);
    gsap.killTweensOf(paper.mesh.rotation);
    gsap.killTweensOf(paper.mesh.scale);
    const index = raycast.boxesToCheck.indexOf(paper.box);
    if (index !== -1) raycast.boxesToCheck.splice(index, 1);
    paper.material.dispose();
    paper.mesh.geometry.dispose();
    room.group.remove(paper.group);
  }
  papers = [];
  initialized = false;
};

export const pinnedPapers = { init, destroy };
