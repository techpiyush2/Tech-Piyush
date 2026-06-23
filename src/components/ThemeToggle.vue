<script setup lang="ts">
import ButtonRound from "./ButtonRound.vue";
import { useDayNight } from "../composables/useDayNight";
import { t } from "../i18n/utils/translate";
import { isFeatureEnabled } from "../utils/features";

const props = defineProps<{
  isDarkTheme: boolean;
}>();

const { isNight, toggleDayNight } = useDayNight();
</script>

<template>
  <ButtonRound
    v-if="isFeatureEnabled('dayNight')"
    variant="theme"
    :class="{ 'theme-toggle': true, 'theme-toggle-dark': props.isDarkTheme, 'children-unclickable': true }"
    @click="toggleDayNight"
    :aria-label="isNight() ? t('switch-to-day') : t('switch-to-night')"
    data-cursor="circle-white"
  >
    <svg
      class="theme-toggle-icon"
      :class="{ 'theme-toggle-icon-night': isNight() }"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- Sun -->
      <circle v-if="!isNight()" cx="12" cy="12" r="5" />
      <line v-if="!isNight()" x1="12" y1="1" x2="12" y2="3" />
      <line v-if="!isNight()" x1="12" y1="21" x2="12" y2="23" />
      <line v-if="!isNight()" x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line v-if="!isNight()" x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line v-if="!isNight()" x1="1" y1="12" x2="3" y2="12" />
      <line v-if="!isNight()" x1="21" y1="12" x2="23" y2="12" />
      <line v-if="!isNight()" x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line v-if="!isNight()" x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      <!-- Moon -->
      <path v-if="isNight()" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </ButtonRound>
</template>

<style scoped lang="scss">
.theme-toggle {
  &-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  &-dark {
    background-color: var(--color-dark-blue-500);
    color: var(--color-white-400);
    --icon-color: var(--color-white-400);
  }
}
</style>
