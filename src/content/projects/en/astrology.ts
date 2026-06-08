import type { ProjectContent } from "../../types";

export default {
  title: "Astrology App",
  theme: "dark",
  tags: ["react", "javascript", "node"],
  live: "https://play.google.com/store/apps/details?id=com.crystalcreation.astrochattalk",
  description:
    "A consumer astrology app with chat-style readings, profiles, and monetized sessions.<br/><br/>Work included mobile-friendly UI, payment and session flows, and back-end integrations to keep real-time features responsive at scale.",
} as const satisfies ProjectContent;
