import { onMounted, onUnmounted, type Ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(
  rootRef: Ref<HTMLElement | null>,
  selector = ".reveal-item",
  options?: { start?: string; stagger?: number },
) {
  let ctx: gsap.Context | null = null;

  onMounted(() => {
    if (!rootRef.value) return;

    ctx = gsap.context(() => {
      const items = rootRef.value!.querySelectorAll(selector);
      if (!items.length) return;

      gsap.fromTo(
        items,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: options?.stagger ?? 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.value,
            start: options?.start ?? "top 78%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, rootRef.value);
  });

  onUnmounted(() => {
    ctx?.revert();
    ctx = null;
  });
}

export function useSkillBarReveal(rootRef: Ref<HTMLElement | null>) {
  let ctx: gsap.Context | null = null;

  onMounted(() => {
    if (!rootRef.value) return;

    ctx = gsap.context(() => {
      const bars = rootRef.value!.querySelectorAll<HTMLElement>("[data-skill]");
      bars.forEach((bar) => {
        const target = Number(bar.dataset.skill) / 100;
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: target,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bar,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, rootRef.value);
  });

  onUnmounted(() => {
    ctx?.revert();
    ctx = null;
  });
}
