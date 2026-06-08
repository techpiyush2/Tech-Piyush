export type TagVariant =
  | "three"
  | "websockets"
  | "react"
  | "redis"
  | "gray"
  | "html"
  | "css"
  | "javascript"
  | "node"
  | "next"
  | "kubernetes"
  | "postgresql"
  | "ogl"
  | "glsl"
  | "mongodb"
  | "fastapi"
  | "python"
  | "ai"
  | "stripe"
  | "express";

export const tagLabels = {
  three: "Three.js",
  websockets: "WebSockets",
  react: "React/Next",
  redis: "Redis",
  gray: "Gray",
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  node: "Node.js",
  next: "Next.js",
  kubernetes: "Kubernetes",
  postgresql: "PostgreSQL",
  ogl: "OGL.js",
  glsl: "GLSL",
  mongodb: "MongoDB",
  fastapi: "FastAPI",
  python: "Python",
  ai: "RAG / AI",
  stripe: "Stripe",
  express: "Express.js",
} as const satisfies Record<TagVariant, string>;
