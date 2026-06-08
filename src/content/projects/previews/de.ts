import type { ProjectPreview } from "../../types";

export default [
  {
    title: "Thera Tap",
    slug: "theratap",
    thumbnail: "/works/1.svg",
    description: "Telemedizin Web- & Mobile-App",
  },
  {
    title: "Mitarbeiterverwaltung",
    slug: "ems",
    thumbnail: "/works/2.svg",
    description: "HR- & Workforce-Dashboard",
  },
  {
    title: "Astrologie-App",
    slug: "astrology",
    thumbnail: "/works/3.svg",
    description: "Cross-Platform Consumer App",
  },
  {
    title: "Course Experts",
    slug: "courseexperts",
    thumbnail: "/works/4.svg",
    description: "Kursanbieter-Plattform",
  },
  {
    title: "Iskedo",
    slug: "iskedo",
    thumbnail: "/works/5.svg",
    description: "Service-Marktplatz-App",
  },
  {
    title: "Dating App",
    slug: "dating",
    thumbnail: "/works/6.svg",
    description: "Social-Matching-Produkt",
  },
] as const satisfies ProjectPreview[];
