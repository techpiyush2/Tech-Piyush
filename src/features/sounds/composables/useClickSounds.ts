import { onMounted, onBeforeUnmount } from "vue";
import { playSound } from "../utils/sounds";
import { unlockAudio } from "../utils/unlockAudio";

import type { SoundKey } from "../types";

const SELECTOR = "[data-sound]";

export function useClickSound(): void {
  const findElementWithSound = (target: HTMLElement | null): HTMLElement | null => {
    if (!target) return null;
    return target.closest<HTMLElement>(SELECTOR);
  };

  const playSoundForElement = (el: HTMLElement | null) => {
    if (!el) return;
    const soundName = el.dataset.sound;
    if (soundName) {
      void playSound(soundName as SoundKey);
    }
  };

  const handlePointer = (e: PointerEvent) => {
    void unlockAudio().then(() => {
      const el = findElementWithSound(e.target as HTMLElement | null);
      playSoundForElement(el);
    });
  };

  onMounted(() => {
    document.body.addEventListener("pointerdown", handlePointer, { capture: false });
  });

  onBeforeUnmount(() => {
    document.body.removeEventListener("pointerdown", handlePointer, { capture: false });
  });
}
