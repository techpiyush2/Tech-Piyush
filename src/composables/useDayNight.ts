import { ref } from "vue";

export type DayNightMode = "day" | "night";

// Shared day/night state. Day = default light beige, night = deep blue.
// Read by renderer (clear color), room shadow material, particles and the
// ThemeToggle UI. Persisted to match the existing sounds preference pattern.
export const dayNightMode = ref<DayNightMode>(
  localStorage.getItem("portfolio-dayNight") === "night" ? "night" : "day",
);

export const isNight = () => dayNightMode.value === "night";

export const toggleDayNight = () => {
  dayNightMode.value = isNight() ? "day" : "night";
  localStorage.setItem("portfolio-dayNight", dayNightMode.value);
};

export const useDayNight = () => ({ dayNightMode, isNight, toggleDayNight });
