import type { ProjectContent } from "../../types";

export default {
  title: "Shivsangam Doctor Consult",
  theme: "light",
  tags: ["node", "express", "mongodb"],
  description:
    "Shivsangam is an online doctor consultation platform that simplifies appointments and scheduling.<br/><br/>I architected scalable backend microservices, built database models for doctor slots, and set up automatic email/SMS notifications for consultation reminders.",
} as const satisfies ProjectContent;
