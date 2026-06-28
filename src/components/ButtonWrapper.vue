<script setup lang="ts">
import { computed } from "vue";

export interface Props {
  renderAs?: "button" | "a" | "div";
  variant?: "accent" | "border" | "theme" | "background" | "gray";
  rounded?: boolean;
}

const props = defineProps<Props>();

const classes = computed(() => [
  "button-wrapper",
  { [`button-wrapper-${props.variant}`]: props.variant !== undefined },
  { "button-wrapper-rounded": props.rounded },
]);
</script>

<template>
  <component :is="props.renderAs ?? 'button'" :class="classes">
    <slot></slot>
  </component>
</template>

<style scoped lang="scss">
.button-wrapper {
  border: none;
  border-radius: 100px;
  letter-spacing: 0.02em;
  font-size: var(--font-size-md);
  font-weight: 800;
  text-align: center;
  white-space: nowrap;
  text-transform: uppercase;
  background-color: transparent;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &-rounded {
    border-radius: 50%;
    aspect-ratio: 1;
  }

  &-accent {
    background-color: var(--color-accent-400, var(--color-orange-400));
    color: var(--color-accent-text-400, var(--color-white-400));
    --icon-color: var(--color-accent-text-400, var(--color-white-400));
    border: 2px solid transparent;

    @include mixins.hover {
      &:hover {
        background-color: rgba(255, 138, 0, 0.05);
        color: var(--color-orange-400);
        --icon-color: var(--color-orange-400);
        border-color: var(--color-orange-400);
        transform: translateY(-2px);
        box-shadow: 
          0 6px 20px rgba(255, 138, 0, 0.08),
          0 2px 6px rgba(0, 0, 0, 0.04);
      }
    }
  }

  &-theme {
    background-color: var(--color-grayscale-500);
    color: var(--color-text-400);
    --icon-color: var(--color-text-400);
    border: 2px solid transparent;

    @include mixins.hover {
      &:hover {
        background-color: rgba(255, 138, 0, 0.05) !important;
        color: var(--color-orange-400) !important;
        --icon-color: var(--color-orange-400) !important;
        border-color: var(--color-orange-400) !important;
        transform: translateY(-2px);
        box-shadow: 
          0 6px 20px rgba(255, 138, 0, 0.08),
          0 2px 6px rgba(0, 0, 0, 0.04);
      }
    }
  }

  &-background {
    background-color: var(--color-background-400);
    color: var(--color-text-400);
    --icon-color: var(--color-text-400);

    @include mixins.hover {
      &:hover {
        background-color: var(--color-text-400);
        color: var(--color-background-400);
        --icon-color: var(--color-background-400);
      }
    }
  }

  &-gray {
    background-color: var(--color-gray-400);
    color: var(--color-white-400);
    --icon-color: var(--color-white-400);

    @include mixins.hover {
      &:hover {
        background-color: var(--color-gray-500);
      }
    }
  }

  &-border {
    border: 2px solid var(--color-grayscale-400);
    color: var(--color-text-400);
    --icon-color: var(--color-text-400);

    @include mixins.hover {
      &:hover {
        background-color: rgba(255, 138, 0, 0.05);
        color: var(--color-orange-400);
        --icon-color: var(--color-orange-400);
        border-color: var(--color-orange-400);
        transform: translateY(-2px);
        box-shadow: 
          0 6px 20px rgba(255, 138, 0, 0.08),
          0 2px 6px rgba(0, 0, 0, 0.04);
      }
    }
  }
}
</style>
