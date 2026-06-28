<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { transitions } from "../../../animations";
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
      <!-- Headline with modern filled/outlined text styles -->
      <h2 class="contact-title" ref="titleRef">
        <span class="word-clip"><span class="word title-filled">LET'S</span></span>
        <span class="word-clip"><span class="word title-outlined">WORK</span></span>
        <br />
        <span class="word-clip"><span class="word title-filled title-accent">TOGETHER.</span></span>
      </h2>

      <!-- Email with copy-on-click button -->
      <div class="contact-email-wrap" ref="emailRef">
        <button
          class="contact-email"
          data-cursor="circle-white"
          @click="copyEmail"
          aria-label="Copy email address"
        >
          <span class="contact-email-text">{{ profile.email }}</span>
          <svg class="contact-email-copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="contact-email-underline"></span>
        </button>
        <transition name="fade">
          <span v-if="copied" class="contact-copied">Copied!</span>
        </transition>
      </div>

      <!-- Social icons with modern pill layout -->
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
          @mousemove="handleMagnet($event, $event.currentTarget as HTMLElement)"
          @mouseleave="resetMagnet($event.currentTarget as HTMLElement)"
        >
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

.contact-title {
  font-family: "Urbanist", sans-serif;
  font-weight: 900;
  letter-spacing: -0.02em;
  font-size: clamp(2.2rem, 6.5vw, 4rem);
  line-height: 1.05;
  perspective: 800px;
  text-transform: uppercase;
}

.title-filled {
  color: var(--color-text-400);
}

.title-outlined {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--color-text-400);
}

.title-accent {
  color: var(--color-orange-400);
}

.word-clip {
  display: inline-block;
  overflow: hidden;
  margin-right: 0.18em;
  vertical-align: bottom;
}

.word {
  display: inline-block;
}

/* ── Email ──────────────────────────────────────────────────────────── */
.contact-email-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-top: var(--space-xs);
}

.contact-email {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  font-weight: 700;
  color: var(--color-text-400);
  background: none;
  border: none;
  padding: 0 0 4px 0;
  cursor: pointer;
  font-family: "Urbanist", sans-serif;
  transition: color 0.3s ease;

  .contact-email-copy-icon {
    width: 18px;
    height: 18px;
    opacity: 0.65;
    transition: transform 0.25s ease, opacity 0.25s ease, color 0.25s ease;
  }

  .contact-email-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--color-orange-400);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &:hover {
    color: var(--color-orange-400);

    .contact-email-copy-icon {
      opacity: 1;
      color: var(--color-orange-400);
      transform: scale(1.1) rotate(5deg);
    }

    .contact-email-underline {
      transform: scaleX(1);
    }
  }
}

.contact-copied {
  font-family: "ProFontWindows", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-orange-400);
  background: rgba(255, 138, 0, 0.08);
  border: 1px solid rgba(255, 138, 0, 0.2);
  padding: 3px 12px;
  border-radius: 4px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from  { opacity: 0; transform: translateY(6px); }
.fade-leave-to    { opacity: 0; transform: translateY(-6px); }

/* ── Social Icons ────────────────────────────────────────────────── */
.contact-icons {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  margin-top: var(--space-sm);
}

.contact-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--color-text-400);
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: 
    border-color 0.25s ease,
    background-color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;

  .contact-icon-inner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .contact-icon-svg {
    width: 18px;
    height: 18px;
    color: var(--color-text-400);
    transition: transform 0.25s ease, color 0.25s ease;
  }

  .contact-icon-label {
    font-family: "ProFontWindows", monospace;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-text-400);
    transition: color 0.25s ease;
  }

  &:hover {
    border-color: var(--color-orange-400);
    background-color: rgba(255, 138, 0, 0.05);
    box-shadow: 
      0 6px 20px rgba(255, 138, 0, 0.06),
      0 2px 6px rgba(0, 0, 0, 0.04);
    transform: translateY(-2px);

    .contact-icon-svg {
      transform: scale(1.1);
      color: var(--color-orange-400);
    }

    .contact-icon-label {
      color: var(--color-orange-400);
    }
  }
}
</style>
