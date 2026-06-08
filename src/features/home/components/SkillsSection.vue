<script setup lang="ts">
import { ref } from "vue";
import NotchSection from "../../../components/NotchSection.vue";
import ScrollSectionTitle from "../../../components/ScrollSectionTitle.vue";
import SectionParticles from "../../../components/SectionParticles.vue";
import { t } from "../../../i18n/utils/translate";
import { skillBars, techStack } from "../../../content/resume";
import { useScrollReveal, useSkillBarReveal } from "../../../composables/useScrollReveal";

const rootRef = ref<HTMLElement | null>(null);
useScrollReveal(rootRef);
useSkillBarReveal(rootRef);
</script>

<template>
  <section ref="rootRef" id="skills" class="scroll-section scroll-section--cyan">
    <SectionParticles variant="dark" />
    <NotchSection class="scroll-section-notch-start" />
    <NotchSection class="scroll-section-notch-end" />
    <div class="grid scroll-section-inner">
      <ScrollSectionTitle :banner="t('expertise')" :title="t('skills-depth')" />

      <p class="skills-intro reveal-item" v-html="t('about-intro')" />

      <div class="skills-bars reveal-item">
        <div v-for="skill in skillBars" :key="skill.label" class="skills-bar-row">
          <div class="skills-bar-top">
            <span>{{ skill.label }}</span>
            <span>{{ skill.value }}%</span>
          </div>
          <div class="skills-bar-track">
            <div
              class="skills-bar-fill"
              :data-skill="skill.value"
              :style="{ backgroundColor: skill.color, transformOrigin: 'left center' }"
            />
          </div>
        </div>
      </div>

      <div class="tech-block reveal-item">
        <h3 class="tech-title">{{ t("tech-stack") }}</h3>
        <div class="tech-grid">
          <div v-for="tech in techStack" :key="tech.name" class="tech-chip">
            <img :src="tech.src" :alt="tech.name" loading="lazy" />
            <span>{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.scroll-section {
  position: relative;
  width: 100%;
  padding: 96px var(--space-outer);
  min-height: calc(var(--lvh) * 95);
  background: linear-gradient(180deg, var(--color-dark-blue-500) 0%, var(--color-dark-blue-400) 100%);
  color: var(--color-text-cyan-400);

  @include mixins.mq("md") {
    padding-top: 128px;
    padding-bottom: 128px;
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
    color: var(--color-dark-blue-500);
    --icon-color: var(--color-dark-blue-500);
  }

  &-notch-end {
    position: absolute;
    bottom: 0;
    left: 0;
    color: var(--color-beige-600);
    --icon-color: var(--color-beige-600);
  }
}

.skills-intro {
  grid-column: 1 / 13;
  font-size: var(--font-size-md);
  line-height: 1.7;
  color: var(--color-text-cyan-300);
  max-width: 62ch;

  @include mixins.mq("lg") {
    grid-column: 2 / 11;
    font-size: var(--font-size-lg);
  }
}

.skills-bars {
  grid-column: 1 / 13;

  @include mixins.mq("lg") {
    grid-column: 2 / 11;
  }
}

.skills-bar-row {
  margin-bottom: var(--space-md);
}

.skills-bar-top {
  display: flex;
  justify-content: space-between;
  font-family: "ProFontWindows", var(--font-family-base);
  font-weight: 700;
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-xs);
}

.skills-bar-track {
  height: 8px;
  border-radius: 100px;
  background: rgba(0, 0, 0, 0.25);
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.35);
}

.skills-bar-fill {
  height: 100%;
  width: 100%;
  transform: scaleX(0);
  border-radius: 100px;
  box-shadow: 0 0 12px currentColor;
}

.tech-block {
  grid-column: 1 / 13;

  @include mixins.mq("lg") {
    grid-column: 2 / 11;
  }
}

.tech-title {
  font-family: "ProFontWindows", var(--font-family-base);
  font-size: var(--font-size-title-xs);
  font-weight: 700;
  margin-bottom: var(--space-md);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: var(--space-md);
}

.tech-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  border: var(--stroke-sm) solid rgba(52, 191, 255, 0.35);
  background: rgba(0, 36, 116, 0.45);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(52, 191, 255, 0.2);
  }

  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
  }

  span {
    font-size: var(--font-size-xs);
    text-align: center;
    color: var(--color-text-cyan-300);
  }
}
</style>
