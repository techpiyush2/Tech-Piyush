import type { ProjectContent } from "../../types";

export default {
  title: "EasyAdmission Plattform",
  theme: "light",
  tags: ["node", "express", "mongodb", "stripe"],
  description:
    "EasyAdmission ist eine skalierbare Studienzulassungs- und Bewerbungsplattform für Studierende.<br/><br/>Ich habe die Onboarding-APIs für Studierende, Dokumenten-Uploads, Admin-Dashboard-Dienste und die Integration von sicheren Zahlungsgateways entwickelt.",
} as const satisfies ProjectContent;
