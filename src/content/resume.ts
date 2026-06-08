export const skillBars = [
  { label: "Front End Development", value: 85, color: "#ff8400" },
  { label: "Back End Development", value: 90, color: "#0086bb" },
  { label: "App Development", value: 70, color: "#052e87" },
] as const;

export const serviceCards = [
  {
    title: "Web Development",
    description:
      "Simple content structure, clean design patterns, and thoughtful interactions that stay fast and accessible.",
    image: "/works/1.svg",
  },
  {
    title: "App Development",
    description: "Ideas brought to life on mobile — from UI flows to store-ready builds and API integration.",
    image: "/works/3.svg",
  },
  {
    title: "Database Development",
    description: "Stable schemas, reliable queries, and data layers that keep applications predictable at scale.",
    image: "/works/2.svg",
  },
] as const;

export const education = [
  { time: "2021 — 2022", title: "Function Up", detail: "Backend training & internship" },
  { time: "2020 — 2021", title: "Board Infinity", detail: "MERN stack training" },
  { time: "2018 — 2021", title: "LNCT University", detail: "Diploma in computer science" },
] as const;

export const workExperience = [
  { time: "2023 — Present", title: "App King Pvt Limited", detail: "Full stack developer" },
  { time: "2022 — 2023", title: "Zimo Infotech Pvt Limited", detail: "Backend developer" },
  { time: "2022", title: "Trilixo Technologies", detail: "Front end internship" },
] as const;

export const techStack = [
  { name: "MongoDB", src: "https://cdn-icons-png.flaticon.com/512/5968/5968322.png" },
  { name: "GraphQL", src: "https://cdn-icons-png.flaticon.com/512/4248/4248443.png" },
  { name: "Express", src: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png" },
  { name: "Node", src: "https://cdn-icons-png.flaticon.com/512/5968/5968672.png" },
  { name: "Java", src: "https://cdn-icons-png.flaticon.com/512/1048/1048877.png" },
  { name: "Git", src: "https://cdn-icons-png.flaticon.com/512/5968/5968242.png" },
  { name: "HTML", src: "https://cdn-icons-png.flaticon.com/512/5968/5968267.png" },
  { name: "CSS", src: "https://cdn-icons-png.flaticon.com/512/760/760457.png" },
] as const;

export const highlights = [
  { value: "6+", label: "Products shipped" },
  { value: "3+", label: "Years building" },
  { value: "24", label: "Age — always learning" },
] as const;
