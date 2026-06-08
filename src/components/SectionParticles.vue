<script setup lang="ts">
defineProps<{
  variant?: "light" | "dark";
}>();
</script>

<template>
  <div :class="['section-particles', `section-particles-${variant ?? 'light'}`]" aria-hidden="true">
    <span
      v-for="n in 18"
      :key="n"
      class="section-particles-dot"
      :style="{
        left: `${(n * 17) % 100}%`,
        top: `${(n * 23) % 100}%`,
        animationDuration: `${6 + n * 0.3}s`,
        animationDelay: `${-n * 0.4}s`,
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.section-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;

  &-dark .section-particles-dot {
    background: rgba(52, 191, 255, 0.55);
    box-shadow: 0 0 12px rgba(52, 191, 255, 0.4);
  }

  &-light .section-particles-dot {
    background: rgba(255, 132, 0, 0.45);
    box-shadow: 0 0 10px rgba(255, 132, 0, 0.25);
  }
}

.section-particles-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  animation: particle-float ease-in-out infinite;
  opacity: 0.5;
}

@keyframes particle-float {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(12px, -20px, 0) scale(1.3);
  }
}
</style>
