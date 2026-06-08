export const social = [
  { url: "mailto:pk409678@gmail.com", name: "mail" },
  { url: "https://github.com/techpiyush2", name: "github" },
  { url: "https://www.linkedin.com/in/piyush-kumar-b1a962215", name: "linkedin" },
  { url: "https://twitter.com/techpiyush_2", name: "x" },
  { url: "https://www.instagram.com/___piyush_kumar_/", name: "instagram" },
] as const satisfies {
  url: string;
  name: "mail" | "github" | "instagram" | "linkedin" | "x";
}[];
