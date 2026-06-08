import type { ProjectContent } from "../../types";

export default {
  title: "Employee Management System",
  theme: "light",
  tags: ["node", "express", "mongodb"],
  description:
    "EMS is a secure, role-based records platform designed to manage organizational workforce hierarchies.<br/><br/>I built the CRUD operations layer, optimized MongoDB schemas, designed roles-based authorization check middleware, and built data aggregation pipelines for custom HR reporting.",
} as const satisfies ProjectContent;
