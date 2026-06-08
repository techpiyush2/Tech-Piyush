import { sounds as items, pools } from "../definitions/sounds";
import { sprites } from "../definitions/sprites";
import { isFeatureEnabled } from "../../../utils/features";
import { isAudioReady, unlockAudio } from "./unlockAudio";

import type { SoundKey, PoolKey } from "../types";

export const getSoundsHowl = (sound: SoundKey) => {
  const data = items[sound];
  if ("spriteKey" in data) {
    return sprites[data.spriteKey].howl;
  }
  return data.howl;
};

const playPoolSound = (poolKey: PoolKey): number | undefined => {
  const pool = pools[poolKey];
  const randomSound = pool[Math.floor(Math.random() * pool.length)];
  return playSound(randomSound as SoundKey);
};

const playResolved = (key: SoundKey | PoolKey): number | undefined => {
  if (key in pools) {
    return playPoolSound(key as PoolKey);
  }

  const data = items[key as SoundKey];
  if (!data) return;

  const howl = getSoundsHowl(key as SoundKey);

  if ("spriteKey" in data) {
    return howl.play(data.name);
  }

  return howl.play();
};

export const playSound = (key: SoundKey | PoolKey): number | undefined => {
  if (!isFeatureEnabled("sounds")) return;

  if (!isAudioReady()) {
    void unlockAudio().then(() => {
      if (isAudioReady()) playResolved(key);
    });
    return undefined;
  }

  return playResolved(key);
};
