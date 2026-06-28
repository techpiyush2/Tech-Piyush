import { ref, watch, onMounted, onUnmounted } from "vue";
import { lenis } from "./useScroll";
import { sizes } from "../utils/sizes";

const isDarkTheme = ref(false);
const hasScrolledIntoView = ref(false);

let listenerCount = 0;
let aboutElement: HTMLElement | null = null;
let contactElement: HTMLElement | null = null;

const handleScroll = () => {
  if (!aboutElement) {
    aboutElement = typeof window !== "undefined" ? document.querySelector("#about") : null;
  }
  if (!contactElement) {
    contactElement = typeof window !== "undefined" ? document.querySelector("#contact") : null;
  }

  if (!aboutElement) return;

  const aboutBounding = aboutElement.getBoundingClientRect();
  const isLandscape = sizes.isLandscape;
  
  // Header shows up once we scroll past Hero (start of about section)
  const isScrolledIntoView = aboutBounding.top - (isLandscape ? sizes.height * 0.225 : 0) < 0;
  
  // Theme is dark for all sections between about start and contact start
  const contactInViewport = contactElement ? contactElement.getBoundingClientRect().top < sizes.height * 0.55 : false;
  const nextIsDarkTheme = isScrolledIntoView && !contactInViewport;

  if (hasScrolledIntoView.value !== isScrolledIntoView) {
    hasScrolledIntoView.value = isScrolledIntoView;
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
