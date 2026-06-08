import type { ProjectContent } from "../../types";

export default {
  title: "TruckOne Logistikplattform",
  theme: "light",
  tags: ["node", "express", "mongodb", "websockets"],
  description:
    "TruckOne ist eine Dispositionsplattform für den Flottenbetrieb, die Logistikabläufe und Sendungsverfolgung erleichtert.<br/><br/>Ich habe Tracking-APIs und Karten-Workflows entwickelt sowie Echtzeit-Dispositionsalarme mithilfe von WebSockets implementiert.",
} as const satisfies ProjectContent;
