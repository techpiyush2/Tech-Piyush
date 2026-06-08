import { ref, watch, onMounted, onUnmounted } from "vue";
import { lenis } from "./useScroll";
import { sizes } from "../utils/sizes";

const isDarkTheme = ref(false);
const hasScrolledIntoView = ref(false);

let listenerCount = 0;
let aboutElement: HTMLElement | null = null;
let skillsElement: HTMLElement | null = null;

const isInViewport = (el: HTMLElement, topOffset = 0) => {
  const rect = el.getBoundingClientRect();
  const viewHeight = sizes.height;
  return rect.top < viewHeight * 0.55 && rect.bottom > topOffset;
};

const handleScroll = () => {
  if (!aboutElement) {
    aboutElement = typeof window !== "undefined" ? document.querySelector("#about") : null;
  }
  if (!skillsElement) {
    skillsElement = typeof window !== "undefined" ? document.querySelector("#skills") : null;
  }

  if (!aboutElement) return;

  const aboutBounding = aboutElement.getBoundingClientRect();
  const isLandscape = sizes.isLandscape;
  const isScrolledIntoView = aboutBounding.top - (isLandscape ? sizes.height * 0.225 : 0) < 0;
  const isScrolledPastAbout = aboutBounding.bottom - 36 < 0;
  const inSkills = skillsElement ? isInViewport(skillsElement, 80) : false;

  const nextHasScrolledIntoView = isScrolledIntoView || inSkills;
  const nextIsDarkTheme = (isScrolledIntoView && !isScrolledPastAbout) || inSkills;

  if (hasScrolledIntoView.value !== nextHasScrolledIntoView) {
    hasScrolledIntoView.value = nextHasScrolledIntoView;
  }

  if (isDarkTheme.value !== nextIsDarkTheme) {
    isDarkTheme.value = nextIsDarkTheme;
  }
};

const attachScrollListener = () => {
  if (!lenis.value) return;
  lenis.value.on("scroll", handleScroll);
  handleScroll();
};

const detachScrollListener = () => {
  if (!lenis.value) return;
  lenis.value.off("scroll", handleScroll);
};

export const useHeaderTheme = () => {
  onMounted(() => {
    listenerCount += 1;

    if (listenerCount === 1) {
      attachScrollListener();
    } else {
      handleScroll();
    }
  });

  onUnmounted(() => {
    listenerCount -= 1;

    if (listenerCount <= 0) {
      listenerCount = 0;
      detachScrollListener();
      aboutElement = null;
      skillsElement = null;
    }
  });

  watch(
    lenis,
    (instance) => {
      if (listenerCount > 0 && instance) {
        detachScrollListener();
        attachScrollListener();
      }
    },
    { flush: "post" },
  );

  return {
    isDarkTheme,
    hasScrolledIntoView,
  };
};
