import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";
import { lerp } from "../../../utils/math";
import { Howler } from "howler";
import { isFeatureEnabled } from "../../../utils/features";
import { tick as contactTick, startSnoreRepetition, stopSnoreRepetition } from "../core/contact";
import { tick as roomTick } from "../core/room";
import { sounds } from "../definitions/sounds";
import { getSoundsHowl } from "../utils/sounds";
import { unlockAudio } from "../utils/unlockAudio";
import { howlerUnlocked, soundsEnabled } from "../state/soundState";

import type { SoundKey } from "../types";

export { howlerUnlocked, soundsEnabled };

Howler.volume(0);

export const useHowler = () => {
  const enabledVolume = ref<number>(0);

  const syncEnabledVolume = () => {
    if (!isFeatureEnabled("sounds")) return;
    enabledVolume.value = soundsEnabled.value ? 1 : 0;
    if (howlerUnlocked.value && soundsEnabled.value) {
      startSnoreRepetition();
    }
  };

  const tick = () => {
    if (!howlerUnlocked.value) {
      if (Howler.ctx?.state === "running") {
        void unlockAudio().then(syncEnabledVolume);
      }
      return;
    }

    contactTick();
    roomTick();

    const currentVolume = Howler.volume();
    if (currentVolume > 0.99 && enabledVolume.value === 1) {
      return;
    }
    const speed = enabledVolume.value === 1 ? 0.01 : 0.05;
    Howler.volume(lerp(currentVolume, enabledVolume.value, speed));
  };

  const handleVisibilityChange = () => {
    Howler.mute(document.visibilityState === "hidden");
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === "KeyM") {
      void unlockAudio().then(() => {
        soundsEnabled.value = !soundsEnabled.value;
      });
    }
  };

  const handlePointerDown = () => {
    void unlockAudio().then(syncEnabledVolume);
  };

  watch(soundsEnabled, (newVal) => {
    if (!isFeatureEnabled("sounds")) return;
    enabledVolume.value = newVal ? 1 : 0;
    localStorage.setItem("portfolio-soundsEnabled", newVal.toString());
    if (newVal && howlerUnlocked.value) {
      startSnoreRepetition();
    }
  });

  const loadAllSounds = () => {
    for (const sound of Object.keys(sounds) as SoundKey[]) {
      const howl = getSoundsHowl(sound);
      howl?.load();
    }
  };

  onMounted(() => {
    if (!isFeatureEnabled("sounds")) return;
    Howler.volume(0);

    if (howlerUnlocked.value) {
      soundsEnabled.value = true;
      syncEnabledVolume();
    }

    gsap.ticker.add(tick);
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("touchstart", handlePointerDown, { passive: true });

    loadAllSounds();
  });

  onUnmounted(() => {
    if (!isFeatureEnabled("sounds")) return;
    gsap.ticker.remove(tick);
    window.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("keydown", handleKeyPress);
    window.removeEventListener("pointerdown", handlePointerDown);
    window.removeEventListener("touchstart", handlePointerDown);
    stopSnoreRepetition();
  });
};
