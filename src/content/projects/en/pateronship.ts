import type { ProjectContent } from "../../types";

export default {
  title: "Pateron Ship Platform",
  theme: "dark",
  tags: ["node", "express", "mongodb", "stripe"],
  description:
    "Pateron Ship is a subscription-based platform enabling content creators to offer tiered membership packages.<br/><br/>I architected the subscription billing cycle, set up payment hooks, and designed content access control rules preventing unauthenticated/unsubscribed users from accessing premium feeds.",
} as const satisfies ProjectContent;
