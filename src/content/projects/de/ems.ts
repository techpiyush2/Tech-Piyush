import type { ProjectContent } from "../../types";

export default {
  title: "Mitarbeiterverwaltung",
  theme: "dark",
  tags: ["react", "node", "postgresql"],
  live: "http://74.208.25.43:3007/",
  description:
    "Full-Stack-Dashboard zur Verwaltung von Teams, Rollen und internen HR-Prozessen.<br/><br/>React-Front-End mit Node.js-APIs, übersichtliche Tabellen und wartbare CRUD-Module.",
} as const satisfies ProjectContent;
