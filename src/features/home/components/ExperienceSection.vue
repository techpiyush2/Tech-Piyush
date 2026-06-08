<script setup lang="ts">
import { ref } from "vue";
import NotchSection from "../../../components/NotchSection.vue";
import ScrollSectionTitle from "../../../components/ScrollSectionTitle.vue";
import HologramPanel from "../../../components/HologramPanel.vue";
import SectionParticles from "../../../components/SectionParticles.vue";
import { t } from "../../../i18n/utils/translate";
import { education, workExperience, highlights } from "../../../content/resume";
import { useScrollReveal } from "../../../composables/useScrollReveal";

const rootRef = ref<HTMLElement | null>(null);
useScrollReveal(rootRef);
</script>

<template>
  <section ref="rootRef" id="experience" class="scroll-section scroll-section--light">
    <SectionParticles />
    <NotchSection class="scroll-section-notch-start" />
    <NotchSection class="scroll-section-notch-end" />
    <div class="grid scroll-section-inner">
      <ScrollSectionTitle :banner="t('career')" :title="t('experience')" />

      <div class="highlights reveal-item">
        <div v-for="item in highlights" :key="item.label" class="highlights-item">
          <span class="highlights-value">{{ item.value }}</span>
          <span class="highlights-label">{{ item.label }}</span>
        </div>
      </div>

      <div class="timeline-grid">
        <HologramPanel class="timeline-col reveal-item">
          <h3 class="timeline-heading">{{ t("education-heading") }}</h3>
          <article v-for="item in education" :key="item.title" class="timeline-entry">
            <time>{{ item.time }}</time>
            <h4>{{ item.title }}</h4>
            <p>{{ item.detail }}</p>
          </article>
        </HologramPanel>

        <HologramPanel class="timeline-col reveal-item">
          <h3 class="timeline-heading">{{ t("work-heading") }}</h3>
          <article v-for="item in workExperience" :key="item.title" class="timeline-entry">
            <time>{{ item.time }}</time>
            <h4>{{ item.title }}</h4>
            <p>{{ item.detail }}</p>
          </article>
        </HologramPanel>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.scroll-section {
  position: relative;
  width: 100%;
  padding: 96px var(--space-outer);
  min-height: calc(var(--lvh) * 90);
  background-color: var(--color-beige-400);

  @include mixins.mq("md") {
    padding-top: 120px;
    padding-bottom: 120px;
  }

  &--light {
    color: var(--color-text-400);
  }

  &-inner {
    position: relative;
    z-index: 1;
    gap: var(--space-xl);
  }

  &-notch-start {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-100%);
    color: var(--color-beige-400);
    --icon-color: var(--color-beige-400);
  }

  &-notch-end {
    position: absolute;
    bottom: 0;
    left: 0;
    color: var(--color-beige-600);
    --icon-color: var(--color-beige-600);
  }
}

.highlights {
  grid-column: 1 / 13;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);

  @include mixins.mq("lg") {
    grid-column: 2 / 12;
  }

  &-item {
    text-align: center;
    padding: var(--space-md);
    border-radius: var(--radius-md);
    background: rgba(255, 255, 255, 0.45);
    border: 1px solid rgba(45, 42, 36, 0.08);
    box-shadow: 0 12px 32px rgba(45, 42, 36, 0.06);
  }

  &-value {
    display: block;
    font-weight: 900;
    font-size: var(--font-size-title-sm);
    color: var(--color-orange-400);
    letter-spacing: 0.02em;
  }

  &-label {
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-300);
  }
}

.timeline-grid {
  grid-column: 1 / 13;
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: 1fr;

  @include mixins.mq("md") {
    grid-template-columns: 1fr 1fr;
  }

  @include mixins.mq("lg") {
    grid-column: 2 / 12;
  }
}

.timeline-col {
  font-family: "ProFontWindows", var(--font-family-base);
  color: var(--color-text-cyan-400);
}

.timeline-heading {
  font-size: var(--font-size-title-xs);
  font-weight: 700;
  margin-bottom: var(--space-md);
  color: var(--color-text-cyan-400);
}

.timeline-entry {
  padding-bottom: var(--space-md);
  margin-bottom: var(--space-md);
  border-bottom: 1px solid rgba(225, 245, 255, 0.15);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  time {
    display: block;
    font-size: var(--font-size-xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-cyan-400);
    margin-bottom: 0.25rem;
  }

  h4 {
    font-size: var(--font-size-md);
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: var(--font-size-sm);
    color: var(--color-text-cyan-300);
    line-height: 1.5;
  }
}
</style>
