<script setup lang="ts">
import { ref } from "vue";
import NotchSection from "../../../components/NotchSection.vue";
import ScrollSectionTitle from "../../../components/ScrollSectionTitle.vue";
import SectionParticles from "../../../components/SectionParticles.vue";
import { t } from "../../../i18n/utils/translate";
import { education, workExperience, highlights } from "../../../content/resume";
import { useScrollReveal } from "../../../composables/useScrollReveal";

const rootRef = ref<HTMLElement | null>(null);
useScrollReveal(rootRef);
</script>

<template>
  <section ref="rootRef" id="experience" class="scroll-section scroll-section--dark">
    <SectionParticles />
    <NotchSection class="scroll-section-notch-end" />
    <div class="grid scroll-section-inner">
      <ScrollSectionTitle :banner="t('career')" :title="t('experience')" />

      <!-- Highlights Bento Grid -->
      <div class="highlights reveal-item">
        <div 
          v-for="item in highlights" 
          :key="item.label" 
          class="bento-tile highlights-item"
          @mousemove="(e: any) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
            e.currentTarget.style.setProperty('--tilt-x', `${-(((e.clientY - rect.top) / rect.height) - 0.5) * 8}deg`);
            e.currentTarget.style.setProperty('--tilt-y', `${(((e.clientX - rect.left) / rect.width) - 0.5) * 8}deg`);
          }"
          @mouseenter="(e: any) => e.currentTarget.classList.add('is-hovered')"
          @mouseleave="(e: any) => {
            e.currentTarget.classList.remove('is-hovered');
            e.currentTarget.style.removeProperty('--tilt-x');
            e.currentTarget.style.removeProperty('--tilt-y');
          }"
        >
          <span class="highlights-value">{{ item.value }}</span>
          <span class="highlights-label">{{ item.label }}</span>
        </div>
      </div>

      <!-- Experience Bento Grids -->
      <div class="bento-experience-grid reveal-item">
        <!-- Section: Work Experience -->
        <div class="experience-group-title">
          <span class="tech-tag">{{ t("work-heading") }}</span>
        </div>
        <div class="work-grid">
          <article 
            v-for="item in workExperience" 
            :key="item.title" 
            class="bento-tile timeline-card"
            @mousemove="(e: any) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
              e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
              e.currentTarget.style.setProperty('--tilt-x', `${-(((e.clientY - rect.top) / rect.height) - 0.5) * 6}deg`);
              e.currentTarget.style.setProperty('--tilt-y', `${(((e.clientX - rect.left) / rect.width) - 0.5) * 6}deg`);
            }"
            @mouseenter="(e: any) => e.currentTarget.classList.add('is-hovered')"
            @mouseleave="(e: any) => {
              e.currentTarget.classList.remove('is-hovered');
              e.currentTarget.style.removeProperty('--tilt-x');
              e.currentTarget.style.removeProperty('--tilt-y');
            }"
          >
            <div class="card-header">
              <time class="timeline-time">{{ item.time }}</time>
              <span class="role-badge">Work</span>
            </div>
            <h4 class="timeline-title">{{ item.title }}</h4>
            <p class="timeline-detail">{{ item.detail }}</p>
          </article>
        </div>

        <!-- Section: Education -->
        <div class="experience-group-title">
          <span class="tech-tag">{{ t("education-heading") }}</span>
        </div>
        <div class="education-grid">
          <article 
            v-for="item in education" 
            :key="item.title" 
            class="bento-tile timeline-card"
            @mousemove="(e: any) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
              e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
              e.currentTarget.style.setProperty('--tilt-x', `${-(((e.clientY - rect.top) / rect.height) - 0.5) * 6}deg`);
              e.currentTarget.style.setProperty('--tilt-y', `${(((e.clientX - rect.left) / rect.width) - 0.5) * 6}deg`);
            }"
            @mouseenter="(e: any) => e.currentTarget.classList.add('is-hovered')"
            @mouseleave="(e: any) => {
              e.currentTarget.classList.remove('is-hovered');
              e.currentTarget.style.removeProperty('--tilt-x');
              e.currentTarget.style.removeProperty('--tilt-y');
            }"
          >
            <div class="card-header">
              <time class="timeline-time">{{ item.time }}</time>
              <span class="role-badge role-badge--edu">Education</span>
            </div>
            <h4 class="timeline-title">{{ item.title }}</h4>
            <p class="timeline-detail">{{ item.detail }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.scroll-section {
  position: relative;
  width: 100%;
  padding: 48px var(--space-outer);
  min-height: calc(var(--lvh) * 90);
  background-color: transparent; // Transparent to share parent mesh background
  color: #ffffff;

  @include mixins.mq("md") {
    padding-top: 120px;
    padding-bottom: 120px;
  }

  &-inner {
    position: relative;
    z-index: 1;
    gap: var(--space-xl);
  }

  &-notch-end {
    position: absolute;
    bottom: 0;
    left: 0;
    color: #131313;
    --icon-color: #131313;
  }
}

// Reusable Bento Tile style
.bento-tile {
  position: relative;
  border-radius: var(--radius-xl);
  z-index: 1;
  background: rgba(255, 255, 255, 0.02); // Frosted glass
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease-out;
  transform-style: preserve-3d;
  will-change: transform;

  // Background light reflection spotlight
  &::before {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    background: radial-gradient(
      350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(0, 240, 255, 0.06),
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

  &.is-hovered {
    border-color: rgba(0, 240, 255, 0.25);
    box-shadow: 0 24px 50px rgba(0, 240, 255, 0.1), 0 16px 40px rgba(0, 0, 0, 0.3);
    transform: perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale3d(1.02, 1.02, 1.02);

    &::before,
    &::after {
      opacity: 1;
    }
  }
}

.highlights {
  grid-column: 1 / 13;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);

  @include mixins.mq("sm") {
    grid-template-columns: repeat(3, 1fr);
  }

  @include mixins.mq("lg") {
    grid-column: 2 / 12;
  }

  &-item {
    text-align: center;
    padding: var(--space-md) var(--space-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &-value {
    display: block;
    font-weight: 900;
    font-size: var(--font-size-title-sm);
    color: var(--color-orange-400);
    letter-spacing: 0.02em;
    font-family: "Sora", var(--font-family-base);
  }

  &-label {
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.6);
    font-family: "JetBrains Mono", var(--font-family-base);
    margin-top: 4px;
  }
}

.bento-experience-grid {
  grid-column: 1 / 13;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);

  @include mixins.mq("lg") {
    grid-column: 2 / 12;
  }
}

.experience-group-title {
  margin-top: var(--space-lg);
  margin-bottom: var(--space-sm);
  display: flex;

  .tech-tag {
    font-family: "ProFontWindows", var(--font-family-base);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: rgba(0, 240, 255, 0.95);
    background: rgba(0, 240, 255, 0.05);
    border: 1px solid rgba(0, 240, 255, 0.25);
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.1);
  }
}

.work-grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: 1fr;

  @include mixins.mq("md") {
    grid-template-columns: repeat(2, 1fr);
  }
}

.education-grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: 1fr;

  @include mixins.mq("md") {
    grid-template-columns: repeat(3, 1fr);
  }
}

.timeline-card {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;

  @include mixins.mq("md") {
    padding: var(--space-lg);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.timeline-time {
  font-family: "ProFontWindows", var(--font-family-base);
  font-size: var(--font-size-xs);
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5);
}

.role-badge {
  font-family: "ProFontWindows", var(--font-family-base);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(0, 240, 255, 0.85);
  background: rgba(0, 240, 255, 0.05);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;

  &--edu {
    color: rgba(255, 132, 0, 0.85);
    background: rgba(255, 132, 0, 0.05);
    border: 1px solid rgba(255, 132, 0, 0.2);
  }
}

.timeline-title {
  font-family: "Sora", var(--font-family-base);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: #ffffff;
  margin-top: var(--space-md);
  margin-bottom: var(--space-xxs);
}

.timeline-detail {
  font-family: "Inter", var(--font-family-base);
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}
</style>
