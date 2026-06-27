<script setup>
import { preloaderVisible } from "../../../composables/usePreloader";
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import gsap from "gsap";
import { t } from "../../../i18n/utils/translate";
import { locale } from "../../../i18n/store";

// Configurable variables for the premium physics ball animation
const GRAVITY = 1200;       // Gravity coefficient (physics indicator)
const BOUNCE_HEIGHT = 110;  // Maximum bounce height in pixels
const BALL_SIZE = 14;       // Ball diameter in pixels
const GLOW_INTENSITY = 0.8; // Glow intensity multiplier (0 to 1)
const ANIM_SPEED = 1.0;     // Animation timeline speed multiplier (lower = faster)
const STRETCH_FACTOR = 0.05; // Squash & stretch scaling coefficient
const MAX_STRETCH = 0.35;   // Maximum stretch limit

// UI & DOM element references
const heroRef = ref(null);
const canvasRef = ref(null);
const ballRef = ref(null);
const ballInnerRef = ref(null);
const nameRef = ref(null);

const letterP = ref(null);
const letterI = ref(null);
const letterY = ref(null);
const letterU = ref(null);
const letterS = ref(null);
const letterH = ref(null);

const cursorVisible = ref(true);
const timelineInstance = ref(null);
const ballState = { x: 0, y: 0 };
const trailPoints = [];
let blinkInterval = null;

// Dynamic style binding for the ball inner glow
const ballInnerStyle = computed(() => ({
  boxShadow: `
    0 0 ${10 * GLOW_INTENSITY}px ${2 * GLOW_INTENSITY}px rgba(255, 132, 0, 0.75),
    0 0 ${25 * GLOW_INTENSITY}px ${6 * GLOW_INTENSITY}px rgba(255, 80, 0, 0.35),
    0 5px 8px rgba(0, 0, 0, 0.35)
  `
}));

// Calculates coordinates for every letter impact point relative to the hero container
const calculateTargets = () => {
  if (
    !heroRef.value ||
    !letterP.value ||
    !letterI.value ||
    !letterY.value ||
    !letterU.value ||
    !letterS.value ||
    !letterH.value
  ) {
    return null;
  }

  const heroRect = heroRef.value.getBoundingClientRect();
  const getCenter = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left - heroRect.left + rect.width / 2,
      y: rect.top - heroRect.top + rect.height / 2,
      rect
    };
  };

  const pVal = getCenter(letterP.value);
  const iStalkVal = getCenter(letterI.value);
  const yVal = letterY.value.getBoundingClientRect();
  const uVal = letterU.value.getBoundingClientRect();
  const sVal = letterS.value.getBoundingClientRect();
  const hVal = letterH.value.getBoundingClientRect();

  // STEP 1: Floating starting position above P
  const startX = pVal.x;
  const startY = pVal.rect.top - heroRect.top - 60;

  // STEP 2: Solid top of lowercase "i" stalk
  const iX = iStalkVal.x;
  const iY = iStalkVal.rect.top - heroRect.top;

  // STEP 3: The double tips of lowercase "y" (pinball bounce)
  const yLeftX = yVal.left - heroRect.left + yVal.width * 0.22;
  const yLeftY = yVal.top - heroRect.top + yVal.height * 0.15;
  const yRightX = yVal.left - heroRect.left + yVal.width * 0.78;
  const yRightY = yVal.top - heroRect.top + yVal.height * 0.15;

  // STEP 4: Top/inside curve of lowercase "u"
  const uX = uVal.left - heroRect.left + uVal.width * 0.5;
  const uY = uVal.top - heroRect.top + uVal.height * 0.55;

  // STEP 5: Upper curve of lowercase "s"
  const sX = sVal.left - heroRect.left + sVal.width * 0.5;
  const sY = sVal.top - heroRect.top + sVal.height * 0.25;

  // STEP 6: Top-left stem corner of "h"
  const hX = hVal.left - heroRect.left + hVal.width * 0.2;
  const hY = hVal.top - heroRect.top;

  return {
    start: { x: startX, y: startY },
    iDot: { x: iX, y: iY },
    yLeft: { x: yLeftX, y: yLeftY },
    yRight: { x: yRightX, y: yRightY },
    uDip: { x: uX, y: uY },
    sCurve: { x: sX, y: sY },
    hStem: { x: hX, y: hY }
  };
};

// Resizes the Canvas overlay according to the device pixel ratio
const resizeCanvas = () => {
  const canvas = canvasRef.value;
  const hero = heroRef.value;
  if (!canvas || !hero) return;

  const width = hero.offsetWidth;
  const height = hero.offsetHeight;

  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.resetTransform();
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
};

// Emits letters hit glows, shakes, and ripples
const createRipple = (x, y) => {
  const container = heroRef.value;
  if (!container) return;

  const ripple = document.createElement("div");
  ripple.className = "hero-ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  container.appendChild(ripple);

  gsap.fromTo(ripple,
    { scale: 0, opacity: 0.8 },
    { scale: 2.5, opacity: 0, duration: 0.6, ease: "power2.out", onComplete: () => ripple.remove() }
  );
};

const triggerHit = (letterEl, targetPos) => {
  if (!letterEl) return;

  // 1. Subtle, rapid elastic letter shake
  gsap.killTweensOf(letterEl, "x,y");
  gsap.fromTo(letterEl,
    { 
      x: () => (Math.random() - 0.5) * 3.5,
      y: () => (Math.random() - 0.5) * 3.5
    },
    { 
      x: 0,
      y: 0,
      duration: 0.16,
      ease: "elastic.out(1, 0.3)"
    }
  );

  // 2. High-end letters glow effect
  gsap.killTweensOf(letterEl, "textShadow,color");
  const glowShadow = `0 0 16px rgba(255, 132, 0, ${GLOW_INTENSITY})`;
  
  gsap.fromTo(letterEl,
    { 
      textShadow: glowShadow,
      color: "var(--color-orange-400)"
    },
    { 
      textShadow: "none",
      color: "",
      duration: 0.7,
      ease: "power2.out"
    }
  );

  // 3. Spawn floating visual ripple
  createRipple(targetPos.x, targetPos.y);
};

// Creates and starts the GSAP physics-based ball animation timeline
const playTimeline = (targets) => {
  if (!targets) return;

  const radius = BALL_SIZE / 2;
  
  // Set initial position
  ballState.x = targets.start.x;
  ballState.y = targets.start.y;
  
  // Sync positions to DOM Element in GSAP updates
  const updateBallDOM = () => {
    if (ballRef.value) {
      gsap.set(ballRef.value, {
        x: ballState.x - radius,
        y: ballState.y - radius
      });
    }
  };

  const tl = gsap.timeline({
    repeat: -1,
    onUpdate: updateBallDOM
  });

  // STEP 1: Float above P with anticipation wait
  tl.to(ballState, {
    y: targets.start.y - 12,
    duration: 0.3 * ANIM_SPEED,
    ease: "sine.inOut"
  });

  // STEP 2: Drop to i-dot (accels under gravity)
  tl.to(ballState, {
    x: targets.iDot.x,
    y: targets.iDot.y - radius,
    duration: 0.38 * ANIM_SPEED,
    ease: "power2.in",
    onStart: () => {
      // Stretch on descent
      gsap.to(ballInnerRef.value, {
        scaleX: 0.8,
        scaleY: 1.25,
        rotation: 0,
        duration: 0.28 * ANIM_SPEED,
        ease: "power1.in"
      });
    },
    onComplete: () => {
      // Squash on impact
      gsap.timeline()
        .to(ballInnerRef.value, { scaleX: 1.4, scaleY: 0.6, duration: 0.06 * ANIM_SPEED, ease: "power1.out" })
        .to(ballInnerRef.value, { scaleX: 1.0, scaleY: 1.0, duration: 0.1 * ANIM_SPEED, ease: "power1.inOut" });

      triggerHit(letterI.value, targets.iDot);
    }
  });

  // Rebound from i-dot up to a mid peak
  const peak1Y = Math.min(targets.iDot.y, targets.yLeft.y) - BOUNCE_HEIGHT * 0.95;
  const mid1X = (targets.iDot.x + targets.yLeft.x) / 2;

  tl.to(ballState, {
    x: mid1X,
    y: peak1Y,
    duration: 0.35 * ANIM_SPEED,
    ease: "power2.out",
    onStart: () => {
      gsap.to(ballInnerRef.value, {
        scaleX: 0.85,
        scaleY: 1.25,
        duration: 0.25 * ANIM_SPEED,
        ease: "power1.out"
      });
    }
  });

  // STEP 3: Pinball bounce to y-left and y-right
  // Descent to y-left tip
  tl.to(ballState, {
    x: targets.yLeft.x,
    y: targets.yLeft.y - radius,
    duration: 0.32 * ANIM_SPEED,
    ease: "power2.in",
    onStart: () => {
      const angle = Math.atan2(targets.yLeft.y - peak1Y, targets.yLeft.x - mid1X) * 180 / Math.PI;
      gsap.to(ballInnerRef.value, {
        scaleX: 1.3,
        scaleY: 0.75,
        rotation: angle,
        duration: 0.25 * ANIM_SPEED,
        ease: "power1.in"
      });
    },
    onComplete: () => {
      // Impact squash
      gsap.timeline()
        .to(ballInnerRef.value, { scaleX: 1.35, scaleY: 0.65, rotation: -25, duration: 0.05 * ANIM_SPEED, ease: "power1.out" })
        .to(ballInnerRef.value, { scaleX: 1.0, scaleY: 1.0, rotation: 0, duration: 0.08 * ANIM_SPEED, ease: "power1.inOut" });

      triggerHit(letterY.value, targets.yLeft);
    }
  });

  // Pinball mid rebound between y arms
  const peakY2X = (targets.yLeft.x + targets.yRight.x) / 2;
  const peakY2Y = Math.min(targets.yLeft.y, targets.yRight.y) - 35;

  tl.to(ballState, {
    x: peakY2X,
    y: peakY2Y,
    duration: 0.18 * ANIM_SPEED,
    ease: "power1.out"
  });

  // Descent to y-right tip
  tl.to(ballState, {
    x: targets.yRight.x,
    y: targets.yRight.y - radius,
    duration: 0.18 * ANIM_SPEED,
    ease: "power1.in",
    onStart: () => {
      const angle = Math.atan2(targets.yRight.y - peakY2Y, targets.yRight.x - peakY2X) * 180 / Math.PI;
      gsap.to(ballInnerRef.value, {
        scaleX: 1.25,
        scaleY: 0.8,
        rotation: angle,
        duration: 0.14 * ANIM_SPEED,
        ease: "power1.in"
      });
    },
    onComplete: () => {
      // Impact squash
      gsap.timeline()
        .to(ballInnerRef.value, { scaleX: 1.35, scaleY: 0.65, rotation: 25, duration: 0.05 * ANIM_SPEED, ease: "power1.out" })
        .to(ballInnerRef.value, { scaleX: 1.0, scaleY: 1.0, rotation: 0, duration: 0.08 * ANIM_SPEED, ease: "power1.inOut" });

      triggerHit(letterY.value, targets.yRight);
    }
  });

  // STEP 4: Fall toward letter "u"
  // Rise to peak above u
  const peakUX = (targets.yRight.x + targets.uDip.x) / 2;
  const peakUY = Math.min(targets.yRight.y, targets.uDip.y) - BOUNCE_HEIGHT * 0.8;

  tl.to(ballState, {
    x: peakUX,
    y: peakUY,
    duration: 0.35 * ANIM_SPEED,
    ease: "power2.out",
    onStart: () => {
      gsap.to(ballInnerRef.value, {
        scaleX: 0.85,
        scaleY: 1.2,
        duration: 0.25 * ANIM_SPEED,
        ease: "power1.out"
      });
    }
  });

  // Descent to u-dip
  tl.to(ballState, {
    x: targets.uDip.x,
    y: targets.uDip.y - radius,
    duration: 0.35 * ANIM_SPEED,
    ease: "power2.in",
    onStart: () => {
      const angle = Math.atan2(targets.uDip.y - peakUY, targets.uDip.x - peakUX) * 180 / Math.PI;
      gsap.to(ballInnerRef.value, {
        scaleX: 1.3,
        scaleY: 0.75,
        rotation: angle,
        duration: 0.28 * ANIM_SPEED,
        ease: "power1.in"
      });
    },
    onComplete: () => {
      gsap.timeline()
        .to(ballInnerRef.value, { scaleX: 1.4, scaleY: 0.6, duration: 0.05 * ANIM_SPEED, ease: "power1.out" })
        .to(ballInnerRef.value, { scaleX: 1.0, scaleY: 1.0, duration: 0.08 * ANIM_SPEED, ease: "power1.inOut" });

      triggerHit(letterU.value, targets.uDip);
    }
  });

  // STEP 5: Bounce to s-curve
  // Rise to peak
  const peakSX = (targets.uDip.x + targets.sCurve.x) / 2;
  const peakSY = Math.min(targets.uDip.y, targets.sCurve.y) - BOUNCE_HEIGHT * 0.75;

  tl.to(ballState, {
    x: peakSX,
    y: peakSY,
    duration: 0.35 * ANIM_SPEED,
    ease: "power2.out",
    onStart: () => {
      gsap.to(ballInnerRef.value, {
        scaleX: 0.85,
        scaleY: 1.2,
        duration: 0.25 * ANIM_SPEED,
        ease: "power1.out"
      });
    }
  });

  // Descent to s-curve
  tl.to(ballState, {
    x: targets.sCurve.x,
    y: targets.sCurve.y - radius,
    duration: 0.35 * ANIM_SPEED,
    ease: "power2.in",
    onStart: () => {
      const angle = Math.atan2(targets.sCurve.y - peakSY, targets.sCurve.x - peakSX) * 180 / Math.PI;
      gsap.to(ballInnerRef.value, {
        scaleX: 1.3,
        scaleY: 0.75,
        rotation: angle,
        duration: 0.28 * ANIM_SPEED,
        ease: "power1.in"
      });
    },
    onComplete: () => {
      gsap.timeline()
        .to(ballInnerRef.value, { scaleX: 1.35, scaleY: 0.65, duration: 0.05 * ANIM_SPEED, ease: "power1.out" })
        .to(ballInnerRef.value, { scaleX: 1.0, scaleY: 1.0, duration: 0.08 * ANIM_SPEED, ease: "power1.inOut" });

      triggerHit(letterS.value, targets.sCurve);
    }
  });

  // STEP 6: Bounce to h-corner
  // Rise to peak
  const peakHX = (targets.sCurve.x + targets.hStem.x) / 2;
  const peakHY = Math.min(targets.sCurve.y, targets.hStem.y) - BOUNCE_HEIGHT * 0.65;

  tl.to(ballState, {
    x: peakHX,
    y: peakHY,
    duration: 0.32 * ANIM_SPEED,
    ease: "power2.out",
    onStart: () => {
      gsap.to(ballInnerRef.value, {
        scaleX: 0.85,
        scaleY: 1.2,
        duration: 0.22 * ANIM_SPEED,
        ease: "power1.out"
      });
    }
  });

  // Descent to h-corner
  tl.to(ballState, {
    x: targets.hStem.x,
    y: targets.hStem.y - radius,
    duration: 0.32 * ANIM_SPEED,
    ease: "power2.in",
    onStart: () => {
      const angle = Math.atan2(targets.hStem.y - peakHY, targets.hStem.x - peakHX) * 180 / Math.PI;
      gsap.to(ballInnerRef.value, {
        scaleX: 1.3,
        scaleY: 0.75,
        rotation: angle,
        duration: 0.25 * ANIM_SPEED,
        ease: "power1.in"
      });
    },
    onComplete: () => {
      gsap.timeline()
        .to(ballInnerRef.value, { scaleX: 1.35, scaleY: 0.65, duration: 0.05 * ANIM_SPEED, ease: "power1.out" })
        .to(ballInnerRef.value, { scaleX: 1.0, scaleY: 1.0, duration: 0.08 * ANIM_SPEED, ease: "power1.inOut" });

      triggerHit(letterH.value, targets.hStem);
    }
  });

  // Slowly floats back to P start position
  tl.to(ballState, {
    x: targets.start.x,
    y: targets.start.y,
    duration: 1.25 * ANIM_SPEED,
    ease: "power2.inOut",
    onStart: () => {
      gsap.to(ballInnerRef.value, {
        scaleX: 1.0,
        scaleY: 1.0,
        rotation: 0,
        duration: 0.8 * ANIM_SPEED,
        ease: "power1.inOut"
      });
    }
  });

  // 300ms pause at original floating position before looping
  tl.to({}, { duration: 0.3 });

  timelineInstance.value = tl;
};

// Canvas frame loop for drawing the glowing energy trail
const onTick = () => {
  // 1. Store ball position if animation is playing
  if (timelineInstance.value && !timelineInstance.value.paused()) {
    trailPoints.push({
      x: ballState.x,
      y: ballState.y,
      time: Date.now()
    });
  }

  // 2. Filter trails older than 1 second (1000ms)
  const now = Date.now();
  while (trailPoints.length > 0 && now - trailPoints[0].time > 1000) {
    trailPoints.shift();
  }

  // 3. Redraw Canvas
  drawTrail();
};

const drawTrail = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear using logical bounds
  ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

  if (trailPoints.length < 2) return;

  const now = Date.now();
  
  // Pass 1: Broad soft outer glow trail
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let i = 1; i < trailPoints.length; i++) {
    const p1 = trailPoints[i - 1];
    const p2 = trailPoints[i];
    const age = now - p2.time;
    const pct = Math.max(0, 1 - age / 1000);
    if (pct <= 0) continue;

    ctx.strokeStyle = `rgba(255, 132, 0, ${0.12 * pct})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // Pass 2: Bright energy core
  for (let i = 1; i < trailPoints.length; i++) {
    const p1 = trailPoints[i - 1];
    const p2 = trailPoints[i];
    const age = now - p2.time;
    const pct = Math.max(0, 1 - age / 1000);
    if (pct <= 0) continue;

    ctx.strokeStyle = `rgba(255, 170, 40, ${0.65 * pct})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // Pass 3: White center hot core
  for (let i = 1; i < trailPoints.length; i++) {
    const p1 = trailPoints[i - 1];
    const p2 = trailPoints[i];
    const age = now - p2.time;
    const pct = Math.max(0, 1 - age / 1000);
    if (pct <= 0) continue;

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * pct})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
};

const handleResize = () => {
  resizeCanvas();
  const newTargets = calculateTargets();
  if (newTargets) {
    if (timelineInstance.value) {
      timelineInstance.value.kill();
    }
    trailPoints.length = 0;
    playTimeline(newTargets);
  }
};

const handleVisibilityChange = () => {
  if (document.hidden) {
    if (timelineInstance.value) timelineInstance.value.pause();
  } else {
    handleResize();
  }
};

onMounted(() => {
  blinkInterval = setInterval(() => {
    cursorVisible.value = !cursorVisible.value;
  }, 530);

  // Watch preloader state to start animations
  watch(preloaderVisible, (visible) => {
    if (!visible) {
      setTimeout(() => {
        handleResize();
        gsap.ticker.add(onTick);
      }, 150);
    }
  }, { immediate: true });

  window.addEventListener("resize", handleResize);
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onUnmounted(() => {
  if (blinkInterval) clearInterval(blinkInterval);
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  gsap.ticker.remove(onTick);
  if (timelineInstance.value) {
    timelineInstance.value.kill();
  }
});
</script>

<template>
  <div class="hero" ref="heroRef">
    <!-- Trail Energy Canvas -->
    <canvas class="hero-trail-canvas" ref="canvasRef"></canvas>

    <!-- Glowing Physics Ball -->
    <div class="hero-ball" ref="ballRef" :style="{ width: `${BALL_SIZE}px`, height: `${BALL_SIZE}px` }">
      <div class="hero-ball-inner" ref="ballInnerRef" :style="ballInnerStyle"></div>
    </div>

    <!-- Left ambient glow -->
    <div class="hero-glow-left" aria-hidden="true">
      <div class="hero-glow-orb hero-glow-orb-1"></div>
      <div class="hero-glow-orb hero-glow-orb-2"></div>
      <div class="hero-glow-orb hero-glow-orb-3"></div>
    </div>

    <div class="hero-content">
      <div class="hero-left">
        <!-- Greeting label -->
        <div class="hero-greeting" :class="{ 'hero-visible': !preloaderVisible }">
          <span class="hero-greeting-text">{{ t('hero-greeting') }}</span>
          <span class="hero-greeting-line" aria-hidden="true"></span>
        </div>

        <!-- Name with targetable letters -->
        <h1 class="hero-name" :class="{ 'hero-visible': !preloaderVisible }" ref="nameRef">
          <span class="hero-letter" ref="letterP">P</span><!--
          --><span class="hero-letter hero-i" ref="letterI" aria-label="i"><!--
            --><span aria-hidden="true">ı</span><!--
          --></span><!--
          --><span class="hero-letter" ref="letterY">y</span><!--
          --><span class="hero-letter" ref="letterU">u</span><!--
          --><span class="hero-letter" ref="letterS">s</span><!--
          --><span class="hero-letter" ref="letterH">h</span>
          <br />
          Shah<span class="hero-cursor" :class="{ 'hero-cursor-hidden': !cursorVisible }">|</span>
        </h1>

        <!-- Job title -->
        <div class="hero-subtitle" :class="{ 'hero-visible': !preloaderVisible }">
          <span class="hero-subtitle-text">{{ t('hero-subtitle-text') }}</span>
          <span class="hero-subtitle-accent">{{ t('hero-subtitle-accent') }}</span>
        </div>

        <!-- Description -->
        <p class="hero-desc" :class="{ 'hero-visible': !preloaderVisible }">
          <span v-html="t('hero-desc')"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hero {
  max-height: calc(var(--lvh) * 100);
  height: calc(var(--lvh) * 100);
  width: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;

  // ─── Left ambient glow ───────────────────────────────────────────────────
  &-glow-left {
    position: absolute;
    left: 0;
    top: 0;
    width: 52%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  &-glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    mix-blend-mode: screen;
    opacity: 0;
    animation: glowPulse 8s ease-in-out infinite;
  }

  &-glow-orb-1 {
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(255,132,0,0.22) 0%, rgba(255,180,60,0.08) 60%, transparent 100%);
    left: -80px; top: 15%;
    animation-delay: 0s;
  }
  &-glow-orb-2 {
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(255,80,0,0.15) 0%, rgba(200,60,0,0.06) 60%, transparent 100%);
    left: 60px; top: 40%;
    animation-delay: 2.5s;
  }
  &-glow-orb-3 {
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(255,200,60,0.12) 0%, transparent 70%);
    left: 180px; top: 10%;
    animation-delay: 5s;
  }

  // ─── Layout ──────────────────────────────────────────────────────────────
  &-content {
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 0 var(--space-xl);
    display: flex;

    @media (max-width: 768px) {
      transform: translateY(-150px);
    }

    @include mixins.mq("lg") {
      padding: 0 6%;
    }
  }

  &-left {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    max-width: 560px;
  }

  // ─── Greeting label ───────────────────────────────────────────────────────
  &-greeting {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;

    &.hero-visible { opacity: 1; transform: translateY(0); }

    &-text {
      font-family: "Urbanist", sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.18em;
      color: var(--color-text-300);
      text-transform: uppercase;
    }

    &-line {
      display: block;
      width: 36px;
      height: 2px;
      background: var(--color-orange-400);
      flex-shrink: 0;
    }
  }

  // ─── Name ─────────────────────────────────────────────────────────────────
  &-name {
    font-weight: 900;
    letter-spacing: -0.01em;
    line-height: 1;
    color: var(--color-text-400);
    font-size: clamp(4rem, 9vw, 8rem);
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s;

    &.hero-visible { opacity: 1; transform: translateY(0); }
  }

  // ─── Animated "i": dot bounces above the stalk ───────────────────────────
  // The wrapper is inline-block so it sits in normal text flow.
  // The dot is absolutely positioned so it floats above without
  // pushing any sibling text around.
  &-i {
    display: inline-block;
    position: relative;
    // We clip overflow so the dot doesn't escape the hero on extreme squash
    // (we still want it visible, so we DON'T clip – just let it float free)
  }



  // ─── Trail Energy Canvas ─────────────────────────────────────────────────
  &-trail-canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  }

  // ─── Physics Ball ────────────────────────────────────────────────────────
  &-ball {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    z-index: 15;
    will-change: transform;

    &-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #ffffff 0%, #ffaa00 35%, #ff5500 80%, #b32d00 100%);
      transform-origin: center bottom;
      will-change: transform;
    }
  }

  // ─── Bouncing Letters ────────────────────────────────────────────────────
  &-letter {
    display: inline-block;
    will-change: transform;
    transition: text-shadow 0.15s ease, color 0.15s ease;
  }

  // ─── Collision Ripple ────────────────────────────────────────────────────
  &-ripple {
    position: absolute;
    width: 24px;
    height: 24px;
    margin-left: -12px;
    margin-top: -12px;
    border-radius: 50%;
    border: 1.5px solid rgba(255, 132, 0, 0.85);
    box-shadow: 0 0 8px rgba(255, 132, 0, 0.45);
    pointer-events: none;
    z-index: 12;
  }

  // ─── Blinking cursor ──────────────────────────────────────────────────────
  &-cursor {
    display: inline-block;
    color: var(--color-orange-400);
    font-weight: 200;
    margin-left: 4px;
    transition: opacity 0.1s;

    &-hidden { opacity: 0; }
  }

  // ─── Subtitle ─────────────────────────────────────────────────────────────
  &-subtitle {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    align-items: center;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.65s ease 0.4s, transform 0.65s ease 0.4s;

    &.hero-visible { opacity: 1; transform: translateY(0); }

    &-text {
      font-family: "Urbanist", sans-serif;
      font-weight: 700;
      font-size: clamp(0.75rem, 1.4vw, 1rem);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--color-text-400);
    }

    &-accent {
      font-family: "Urbanist", sans-serif;
      font-weight: 700;
      font-size: clamp(0.75rem, 1.4vw, 1rem);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--color-orange-400);
    }
  }

  // ─── Description ─────────────────────────────────────────────────────────
  &-desc {
    font-family: "Urbanist", sans-serif;
    font-size: clamp(0.85rem, 1.2vw, 1.05rem);
    line-height: 1.65;
    color: var(--color-text-300);
    max-width: 420px;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.65s ease 0.55s, transform 0.65s ease 0.55s;

    &.hero-visible { opacity: 1; transform: translateY(0); }
  }
}

// ─── Background glow pulse ───────────────────────────────────────────────────
@keyframes glowPulse {
  0%   { opacity: 0;    transform: scale(1) translateY(0); }
  30%  { opacity: 1;    transform: scale(1.05) translateY(-12px); }
  60%  { opacity: 0.75; transform: scale(0.97) translateY(8px); }
  100% { opacity: 0;    transform: scale(1) translateY(0); }
}
</style>
