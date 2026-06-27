import type { ProjectContent } from "../../types";

export default {
  title: "Shivsangam Arztberatung",
  theme: "light",
  tags: ["node", "express", "mongodb"],
  description:
    "Shivsangam ist eine Online-Arztkonsultationsplattform, die Terminbuchungen und Kalenderplanung vereinfacht.<br/><br/>Ich habe skalierbare Backend-Mikrodienste konzipiert, Datenbankmodelle für Arzt-Zeitfenster erstellt und automatisierte E-Mail-/SMS-Benachrichtigungen eingerichtet.",
} as const satisfies ProjectContent;
