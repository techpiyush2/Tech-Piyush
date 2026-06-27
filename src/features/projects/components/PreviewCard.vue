<script setup lang="ts">
import Link from "../../../components/Link.vue";
import Notch from "../../../components/Notch.vue";
import ArrowRightLong from "../../../components/icons/ArrowRightLong.vue";
import gsap from "gsap";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ButtonRound from "../../../components/ButtonRound.vue";
import { t } from "../../../i18n/utils/translate";
import { social } from "../../../content/social";
import Plus from "../../../components/icons/Plus.vue";

import type { ProjectPreview } from "../../../content/types";

const tlRef = ref<gsap.core.Timeline | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);

const props = defineProps<{
  preview?: ProjectPreview;
}>();

// Resolve thumbnail src with correct base URL (needed when base is /Tech-Piyush/)
const thumbnailSrc = computed(() => {
  if (!props.preview?.thumbnail) return '';
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
  const path = props.preview.thumbnail.startsWith('/') ? props.preview.thumbnail : `/${props.preview.thumbnail}`;
  return `${base}${path}`;
});

// 3D Tilt & Glow States
const cardRef = ref<any>(null);
const tiltX = ref(0);
const tiltY = ref(0);
const glowX = ref(50);
const glowY = ref(50);
const isHovered = ref(false);

const handleMouseMove = (e: MouseEvent) => {
  const el = cardRef.value?.$el || cardRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const width = rect.width;
  const height = rect.height;
  
  const maxTilt = 8;
  tiltX.value = -((y / height) - 0.5) * maxTilt;
  tiltY.value = ((x / width) - 0.5) * maxTilt;
  
  glowX.value = (x / width) * 100;
  glowY.value = (y / height) * 100;
};

const handleMouseEnter = () => {
  isHovered.value = true;
};

const handleMouseLeave = () => {
  isHovered.value = false;
  tiltX.value = 0;
  tiltY.value = 0;
};

onMounted(async () => {
  if (!wrapperRef.value || ScrollTrigger.isInViewport(wrapperRef.value)) {
    return;
  }

  // Animate the wrapper container – NOT the img element directly,
  // because GSAP transforms on <img> create a GPU composite layer
  // that freezes GIF animation in Chrome/WebKit.
  const imgWrapper = wrapperRef.value.querySelector('.preview-card-image-wrapper');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapperRef.value,
      start: "top bottom",
    },
  });
  tl.fromTo(wrapperRef.value, { scale: 0.8 }, { scale: 1, duration: 0.4, ease: "power1.out" }, 0);
  if (imgWrapper) {
    tl.fromTo(imgWrapper, { scale: 1.1 }, { scale: 1, duration: 0.4, ease: "power1.out" }, 0);
  }

  tlRef.value = tl;
});

onUnmounted(() => {
  if (tlRef.value) {
    tlRef.value.kill();
    tlRef.value = null;
  }
});
</script>

<template>
  <Link
    ref="cardRef"
    class="preview-card children-unclickable"
    :to="`/project/${props.preview.slug}`"
    :aria-label="t('switch-to-project', { project: props.preview.title })"
    data-cursor="arrow"
    data-sound="click"
    data-hoversound="hover"
    v-if="props.preview"
    :style="{
      transform: isHovered ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)` : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
      '--mouse-x': `${glowX}%`,
      '--mouse-y': `${glowY}%`
    }"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="preview-card-top" ref="wrapperRef">
      <div class="preview-card-image-wrapper">
        <div class="preview-card-image-container">
          <img :src="thumbnailSrc" :alt="props.preview.title" class="preview-card-image" ref="imageRef" />
        </div>
      </div>
      <div class="preview-card-overlay">
        <div class="preview-card-edge">
          <ButtonRound class="preview-card-button" variant="accent" renderAs="div">
            <ArrowRightLong class="preview-card-button-arrow" />
          </ButtonRound>
        </div>
        <Notch class="preview-card-notch preview-card-notch-left" />
        <Notch class="preview-card-notch preview-card-notch-right" />
      </div>
    </div>
    <div class="preview-card-content">
      <div class="preview-card-copys">
        <h3 class="preview-card-title">{{ props.preview.title }}</h3>
        <p class="preview-card-description">{{ props.preview.description }}</p>
      </div>
    </div>
  </Link>

  <Link
    v-else
    ref="cardRef"
    class="preview-card children-unclickable"
    data-cursor="arrow-external"
    data-hoversound="hover"
    external
    :href="social[0].url"
    :style="{
      transform: isHovered ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)` : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
      '--mouse-x': `${glowX}%`,
      '--mouse-y': `${glowY}%`
    }"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="preview-card-top preview-card-top-empty">
      <Plus class="preview-card-top-empty-icon" />
    </div>
    <div class="preview-card-content">
      <div class="preview-card-copys">
        <h3 class="preview-card-title">{{ t("start-a-new-project") }}</h3>
      </div>
    </div>
  </Link>
</template>

<style scoped lang="scss">
.preview-card {
  --hover: 0;
  position: relative;
  border-radius: var(--radius-xl);
  z-index: var(--z-index-layout);
  background: rgba(255, 255, 255, 0.02); // Translucent glass base
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  padding: 16px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease-out;
  // NOTE: No will-change or transform-style here — they create a GPU stacking
  // context that rasterizes child GIF images and freezes their animation.

  // Background light reflection spotlight
  &::before {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    background: radial-gradient(
      350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(0, 240, 255, 0.08),
      transparent 50%
    );
    z-index: -1;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  // Neon Border Highlight Spotlight
  &::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: radial-gradient(
      150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(0, 240, 255, 0.4),
      transparent 60%
    );
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask-composite: xor;
    z-index: 2;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  @include mixins.hover {
    &:hover {
      --hover: 1;
      border-color: rgba(0, 240, 255, 0.25);
      box-shadow: 0 24px 50px rgba(0, 240, 255, 0.12), 0 16px 40px rgba(0, 0, 0, 0.35);

      &::before,
      &::after {
        opacity: 1;
      }
    }
  }

  &-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    padding-top: var(--space-md);
  }

  &-overlay {
    @include mixins.hover {
      display: none;
    }
  }

  &-notch {
    position: absolute;
    color: #131313; // Match the dark projects background
    --icon-color: #131313;
    transform: scale(-1) rotate(90deg);
    height: var(--radius-lg);

    &-left {
      bottom: 0;
      right: 50px;
    }

    &-right {
      bottom: 50px;
      right: 0;
    }
  }

  &-edge {
    position: absolute;
    bottom: -1px;
    right: -1px;
    background-color: #131313; // Match the dark background
    padding-left: 6px;
    padding-top: 6px;
    border-radius: 32px 0 0 0;
    padding-right: 1px;
    padding-bottom: 1px;
  }

  &-button {
    &-arrow {
      transition: transform 0.15s ease-in-out;
      width: 100%;
      transform: rotate(calc(var(--hover) * -45deg));
    }
  }

  &-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    // No transform on the img itself — transforms on <img> freeze GIF animation
    display: block;

    &-container {
      // Use a subtle brightness instead of transform scale for hover effect
      // to avoid GPU layer that would freeze GIFs
      aspect-ratio: 16/9;
      transition: filter 0.25s ease;
      filter: brightness(calc(1 - var(--hover) * 0.05));
    }

    &-wrapper {
      border-radius: var(--radius-md);
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  &-top {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;

    &-empty {
      border: 2px dashed rgba(0, 240, 255, 0.3);
      border-radius: var(--radius-md);
      background-color: rgba(255, 255, 255, 0.01);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.25s ease, background-color 0.25s ease;

      .preview-card:hover & {
        border-color: rgba(0, 240, 255, 0.7);
        background-color: rgba(0, 240, 255, 0.02);
      }

      &-icon {
        width: var(--icon-size-lg);
        color: rgba(0, 240, 255, 0.5);
        --icon-color: rgba(0, 240, 255, 0.5);
        --stroke-width: 3px;
        transition: color 0.25s ease, transform 0.25s ease;

        .preview-card:hover & {
          color: rgba(0, 240, 255, 0.9);
          transform: rotate(90deg);
        }
      }
    }
  }

  &-copys {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &-title {
    font-size: var(--font-size-title-xs);
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.02em;
    font-family: "Sora", var(--font-family-base);
  }

  &-description {
    font-size: var(--font-size-sm);
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
    line-height: 1.4;
    font-family: "Inter", var(--font-family-base);
  }
}
</style>
