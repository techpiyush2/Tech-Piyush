import { onMounted, onUnmounted, watchEffect } from "vue";
import { path } from "../../../composables/useRouteObserver";
import gsap from "gsap";
import { BASE_VOLUMES, musicTracks } from "../definitions/music";
import { sceneWeights } from "../../../animations/scenes";
import { howlerUnlocked, soundsEnabled } from "./useHowler";
import { clamp } from "../../../utils/math";
import { isFeatureEnabled } from "../../../utils/features";
import { unlockAudio } from "../utils/unlockAudio";

import type { MusicTrack } from "../types";

export const useMusic = () => {
  const tickVolumes = () => {
    if (path.value !== "/") {
      // On non-home pages: keep luci at base, silence space ambient
      musicTracks.luci.volume(BASE_VOLUMES.luci);
      musicTracks.about.volume(0);
      return;
    }

    // luci (room ambient): full when in hero, fades out as we enter the space section
    const luciVol = clamp(1 - sceneWeights.about, 0, 1) * BASE_VOLUMES.luci;

    // about (space ambient): fades in as soon as sceneWeights.about > 0
    // Use a linear ramp from 0 → full volume across the full about weight range
    const aboutVol = clamp(sceneWeights.about, 0, 1) * BASE_VOLUMES.about;

    musicTracks.luci.volume(luciVol);
    musicTracks.about.volume(aboutVol);
  };

  const tick = () => {
    // Always tick volumes when sounds are ready — no sizes.visible guard
    // so the crossfade works even when tab is in background
    if (!soundsEnabled.value || !howlerUnlocked.value) return;
    tickVolumes();
  };

  const play = (trackId: MusicTrack) => {
    if (!isFeatureEnabled("sounds")) return;
    if (!howlerUnlocked.value || !soundsEnabled.value) return;
    const track = musicTracks[trackId];
    if (!track || track.playing()) return;
    track.load();
    track.play();
  };

  const startAllTracks = () => {
    play("luci");
    play("about");
  };

  watchEffect(() => {
    if (!isFeatureEnabled("sounds")) return;
    if (!howlerUnlocked.value || !soundsEnabled.value) return;
    startAllTracks();
  });

  onMounted(() => {
    if (!isFeatureEnabled("sounds")) return;
    gsap.ticker.add(tick);

    const startMusic = () => {
      void unlockAudio().then(() => {
        startAllTracks();
      });
    };

    window.addEventListener("pointerdown", startMusic, { once: true, passive: true });
    window.addEventListener("touchstart", startMusic, { once: true, passive: true });
  });

  onUnmounted(() => {
    if (!isFeatureEnabled("sounds")) return;
    gsap.ticker.remove(tick);
    musicTracks.luci.stop();
    musicTracks.about.stop();
  });
};
