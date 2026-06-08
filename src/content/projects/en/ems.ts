import type { ProjectContent } from "../../types";

export default {
  title: "Employee Management System",
  theme: "dark",
  tags: ["react", "node", "postgresql"],
  live: "http://74.208.25.43:3007/",
  description:
    "A full-stack employee management dashboard for tracking teams, roles, attendance, and internal workflows.<br/><br/>Built with a React front end and Node.js APIs, emphasizing clear data tables, role-based views, and maintainable CRUD modules for HR operations.",
} as const satisfies ProjectContent;
