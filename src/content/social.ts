export const social = [
  { url: "mailto:techpiyush06@gmail.com", name: "mail" },
  { url: "https://github.com/techpiyush2", name: "github" },
  { url: "https://www.linkedin.com/in/techpiyush2", name: "linkedin" },
] as const satisfies {
  url: string;
  name: "mail" | "github" | "instagram" | "linkedin" | "x";
}[];
