import { onMounted, onBeforeUnmount } from "vue";
import { playSound } from "../utils/sounds";
import { isTransitioning } from "../../../composables/useProjectTransition";

import type { SoundKey, PoolKey } from "../types";

const SELECTOR = "[data-hoversound]";

export function useHoverSound(): void {
  const findElementWithSound = (target: HTMLElement | null): HTMLElement | null => {
    if (!target) return null;
    return target.closest<HTMLElement>(SELECTOR);
  };

  const playSoundForElement = (el: HTMLElement | null) => {
    if (!el || isTransitioning.value) return;
    const soundName = el.dataset.hoversound;
    if (soundName) {
      void playSound(soundName as SoundKey | PoolKey);
    }
  };

  const handleMouseEnter = (e: MouseEvent) => {
    const el = findElementWithSound(e.target as HTMLElement | null);
    playSoundForElement(el);
  };

  onMounted(() => {
    document.body.addEventListener("mouseenter", handleMouseEnter, { capture: true });
  });

  onBeforeUnmount(() => {
    document.body.removeEventListener("mouseenter", handleMouseEnter, { capture: true });
  });
}
