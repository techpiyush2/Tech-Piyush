import type { ProjectPreview } from "../../types";

export default [
  {
    title: "Thera Tap",
    slug: "theratap",
    thumbnail: "/works/1.svg",
    description: "Telemedicine web & mobile app",
  },
  {
    title: "Employee Management",
    slug: "ems",
    thumbnail: "/works/2.svg",
    description: "HR & workforce dashboard",
  },
  {
    title: "Astrology App",
    slug: "astrology",
    thumbnail: "/works/3.svg",
    description: "Cross-platform consumer app",
  },
  {
    title: "Course Experts",
    slug: "courseexperts",
    thumbnail: "/works/4.svg",
    description: "Course provider platform",
  },
  {
    title: "Iskedo",
    slug: "iskedo",
    thumbnail: "/works/5.svg",
    description: "Service marketplace app",
  },
  {
    title: "Dating App",
    slug: "dating",
    thumbnail: "/works/6.svg",
    description: "Social matching product",
  },
] as const satisfies ProjectPreview[];
