<script setup lang="ts">
defineProps<{
  tag?: string;
}>();
</script>

<template>
  <div class="hologram-panel">
    <div class="hologram-panel-glow" aria-hidden="true" />
    <div class="hologram-panel-scan" aria-hidden="true" />
    <div class="hologram-panel-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.hologram-panel {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;

  &-glow {
    position: absolute;
    inset: -40%;
    background: radial-gradient(circle at 30% 20%, rgba(52, 191, 255, 0.35), transparent 55%);
    pointer-events: none;
    animation: holo-drift 8s ease-in-out infinite;
  }

  &-scan {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(52, 191, 255, 0.06) 48%,
      transparent 52%
    );
    background-size: 100% 220%;
    animation: holo-scan 4s linear infinite;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  &-inner {
    position: relative;
    z-index: 1;
    border: var(--stroke-sm) solid var(--color-cyan-400);
    border-radius: var(--radius-md);
    background: linear-gradient(165deg, var(--color-hologram-top) 0%, var(--color-hologram-bottom) 100%);
    padding: var(--space-md);
    box-shadow:
      0 0 24px rgba(52, 191, 255, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
}

@keyframes holo-drift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(6%, 4%);
  }
}

@keyframes holo-scan {
  0% {
    background-position: 0 -120%;
  }
  100% {
    background-position: 0 120%;
  }
}
</style>
