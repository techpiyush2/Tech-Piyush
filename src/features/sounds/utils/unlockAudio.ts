import { Howler } from "howler";
import { isFeatureEnabled } from "../../../utils/features";
import { howlerUnlocked, soundsEnabled } from "../state/soundState";

const STORAGE_KEY = "portfolio-soundsEnabled";

/** Resume Web Audio and mark the experience as unlocked (required on modern browsers). */
export async function unlockAudio(): Promise<boolean> {
  if (!isFeatureEnabled("sounds")) return false;

  try {
    const ctx = Howler.ctx;
    if (ctx && ctx.state === "suspended") {
      await ctx.resume();
    }
  } catch {
    // continue — Howler may still unlock via html5 pool
  }

  if (!howlerUnlocked.value) {
    howlerUnlocked.value = true;
    soundsEnabled.value = true;
    localStorage.setItem(STORAGE_KEY, "true");
  }

  return howlerUnlocked.value;
}

export function isAudioReady(): boolean {
  return isFeatureEnabled("sounds") && howlerUnlocked.value && soundsEnabled.value;
}
