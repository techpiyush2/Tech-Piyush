<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { transitions } from "../../../animations";
import { t } from "../../../i18n/utils/translate";
import { profile } from "../../../content/profile";
import { social } from "../../../content/social";
import gsap from "gsap";
import Github from "../../../components/icons/Github.vue";
import Linkedin from "../../../components/icons/Linkedin.vue";
import Mail from "../../../components/icons/Mail.vue";

const contactElement = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const emailRef = ref<HTMLElement | null>(null);
const iconsRef = ref<HTMLElement | null>(null);
const copied = ref(false);

const icons = { mail: Mail, github: Github, linkedin: Linkedin } as const;
const iconLabels: Record<string, string> = {
  mail: "Email",
  github: "GitHub",
  linkedin: "LinkedIn",
};

// Copy email to clipboard
const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(profile.email);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    // fallback — just navigate
    window.open(`mailto:${profile.email}`);
  }
};

// Magnetic hover effect on icons
const handleMagnet = (e: MouseEvent, el: HTMLElement, strength = 0.35) => {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) * strength;
  const dy = (e.clientY - cy) * strength;
  gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
};

const resetMagnet = (el: HTMLElement) => {
  gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
};

let ctx: gsap.Context | null = null;

onMounted(() => {
  if (contactElement.value) {
    transitions.contact.setup(contactElement.value);
  }

  ctx = gsap.context(() => {
    // Word-by-word headline reveal on scroll
    if (titleRef.value) {
      const words = titleRef.value.querySelectorAll(".word");
      gsap.fromTo(
        words,
        { y: "110%", opacity: 0, rotateX: -40 },
        {
          y: "0%",
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: titleRef.value,
            start: "top 80%",
          },
        }
      );
    }

    // Email fade-up
    if (emailRef.value) {
      gsap.fromTo(
        emailRef.value,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: emailRef.value,
            start: "top 85%",
          },
        }
      );
    }

    // Staggered icon entrance
    if (iconsRef.value) {
      const items = iconsRef.value.querySelectorAll(".contact-icon-wrap");
      gsap.fromTo(
        items,
        { y: 40, opacity: 0, scale: 0.6 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.12,
          scrollTrigger: {
            trigger: iconsRef.value,
            start: "top 85%",
          },
        }
      );
    }
  }, contactElement.value!);
});

onUnmounted(() => {
  transitions.contact.destroy();
  ctx?.revert();
});
</script>

<template>
  <div class="contact grid" ref="contactElement">
    <!-- floating orbs -->
    <div class="contact-orb contact-orb--1" aria-hidden="true"></div>
    <div class="contact-orb contact-orb--2" aria-hidden="true"></div>

    <div class="contact-content">
      <!-- Headline with word-clip reveal -->
      <h2 class="contact-title" ref="titleRef">
        <span class="word-clip"><span class="word">Let's</span></span>
        <span class="word-clip"><span class="word">work</span></span>
        <br />
        <span class="word-clip"><span class="word">together!</span></span>
      </h2>

      <!-- Email with shimmer + copy -->
      <div class="contact-email-wrap" ref="emailRef">
        <a
          :href="`mailto:${profile.email}`"
          class="contact-email"
          data-cursor="circle-white"
          @click.prevent="copyEmail"
        >
          <span class="contact-email-text">{{ profile.email }}</span>
          <span class="contact-email-shimmer" aria-hidden="true"></span>
        </a>
        <transition name="fade">
          <span v-if="copied" class="contact-copied">Copied!</span>
        </transition>
      </div>

      <!-- Divider -->
      <div class="contact-divider" aria-hidden="true">
        <span class="contact-divider-line"></span>
        <span class="contact-divider-dot"></span>
        <span class="contact-divider-line"></span>
      </div>

      <!-- Social icons with magnetic hover -->
      <div class="contact-icons" ref="iconsRef">
        <a
          v-for="item in social"
          :key="item.name"
          :href="item.url"
          :target="item.name !== 'mail' ? '_blank' : undefined"
          :rel="item.name !== 'mail' ? 'noopener noreferrer' : undefined"
          class="contact-icon-wrap"
          :aria-label="iconLabels[item.name]"
          data-cursor="circle-white"
          data-hoversound="hover"
          @mousemove="(e) => handleMagnet(e, $event.currentTarget as HTMLElement)"
          @mouseleave="(e) => resetMagnet($event.currentTarget as HTMLElement)"
        >
          <span class="contact-icon-ring" aria-hidden="true"></span>
          <span class="contact-icon-inner">
            <component :is="icons[item.name as keyof typeof icons]" class="contact-icon-svg" />
          </span>
          <span class="contact-icon-label">{{ iconLabels[item.name] }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ── Layout ─────────────────────────────────────────────────────────── */
.contact {
  width: 100%;
  max-width: calc(var(--svw) * 100);
  overflow: hidden;
  min-height: calc(var(--lvh) * 100);
  padding: var(--space-outer);
  padding-top: var(--space-lg);
  position: relative;

  @include mixins.mq("md") {
    padding-top: var(--space-xxl);
  }
}

/* ── Background orbs ──────────────────────────────────────────────── */
.contact-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  animation: orbFloat 8s ease-in-out infinite alternate;

  &--1 {
    width: 340px;
    height: 340px;
    background: radial-gradient(circle, rgba(255, 138, 0, 0.15) 0%, transparent 70%);
    top: 10%;
    left: -80px;
    animation-delay: 0s;
  }

  &--2 {
    width: 260px;
    height: 260px;
    background: radial-gradient(circle, rgba(100, 180, 255, 0.1) 0%, transparent 70%);
    bottom: 20%;
    left: 20%;
    animation-delay: -4s;
  }
}

@keyframes orbFloat {
  from { transform: translateY(0px) scale(1); }
  to   { transform: translateY(-30px) scale(1.08); }
}

/* ── Content ──────────────────────────────────────────────────────── */
.contact-content {
  position: relative;
  z-index: 1;
  padding-top: var(--space-md);
  grid-column: 1 / 13;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);

  @include mixins.mq("sm") { grid-column: 1 / 8; }
  @include mixins.mq("md") {
    gap: var(--space-xl);
    grid-column: 1 / 6;
    padding-top: var(--space-lg);
  }
  @include mixins.mq("lg") { grid-column: 2 / 6; }
}

/* ── Title ──────────────────────────────────────────────────────────── */
.contact-title {
  font-weight: 900;
  letter-spacing: -0.01em;
  font-size: var(--font-size-title-md);
  line-height: 1.1;
  perspective: 800px;

  @include mixins.mq("sm")  { font-size: var(--font-size-title-lg); }
  @include mixins.mq("xl")  { font-size: var(--font-size-title-xl); }
}

.word-clip {
  display: inline-block;
  overflow: hidden;
  margin-right: 0.18em;
  vertical-align: bottom;
}

.word {
  display: inline-block;
  /* initial hidden state set by GSAP */
}

/* ── Email ──────────────────────────────────────────────────────────── */
.contact-email-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.contact-email {
  position: relative;
  display: inline-block;
  font-size: clamp(0.95rem, 2vw, 1.2rem);
  font-weight: 600;
  color: var(--color-cyan-400, #38bdf8);
  text-decoration: none;
  overflow: hidden;
  padding-bottom: 3px;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #FF8A00, #FFD966, #FF8A00);
    background-size: 200% 100%;
    border-radius: 2px;
    animation: shimmerLine 2.5s linear infinite;
  }

  &:hover .contact-email-text {
    color: #FF8A00;
    transition: color 0.25s;
  }
}

.contact-email-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 35%,
    rgba(255, 138, 0, 0.18) 50%,
    transparent 65%
  );
  background-size: 250% 100%;
  animation: shimmerPass 2.8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmerLine {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes shimmerPass {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.contact-copied {
  font-size: 0.75rem;
  font-weight: 700;
  color: #FF8A00;
  background: rgba(255, 138, 0, 0.12);
  border: 1px solid rgba(255, 138, 0, 0.3);
  padding: 2px 10px;
  border-radius: 20px;
  letter-spacing: 0.05em;
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from  { opacity: 0; transform: translateY(6px); }
.fade-leave-to    { opacity: 0; transform: translateY(-6px); }

/* ── Divider ─────────────────────────────────────────────────────── */
.contact-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.3;
}

.contact-divider-line {
  flex: 1;
  height: 1px;
  background: currentColor;
  max-width: 60px;
}

.contact-divider-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #FF8A00;
  opacity: 1;
  box-shadow: 0 0 8px 2px rgba(255,138,0,0.5);
  animation: pulseDot 2s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% { box-shadow: 0 0 8px 2px rgba(255,138,0,0.5); }
  50%       { box-shadow: 0 0 16px 6px rgba(255,138,0,0.3); }
}

/* ── Social Icons ────────────────────────────────────────────────── */
.contact-icons {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.contact-icon-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  will-change: transform;
}

.contact-icon-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  transition: border-color 0.3s, box-shadow 0.3s;
  pointer-events: none;
}

.contact-icon-inner {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.contact-icon-svg {
  width: 20px;
  height: 20px;
  transition: transform 0.25s ease;
}

.contact-icon-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  color: #FF8A00;
}

/* Hover state */
.contact-icon-wrap:hover {
  .contact-icon-ring {
    border-color: rgba(255, 138, 0, 0.5);
    box-shadow: 0 0 0 4px rgba(255, 138, 0, 0.08);
  }

  .contact-icon-inner {
    background: rgba(255, 138, 0, 0.1);
    border-color: rgba(255, 138, 0, 0.4);
    box-shadow:
      0 8px 24px rgba(255, 138, 0, 0.2),
      0 2px 8px rgba(0, 0, 0, 0.08);
    transform: scale(1.08);
  }

  .contact-icon-svg {
    transform: scale(1.12);
  }

  .contact-icon-label {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
