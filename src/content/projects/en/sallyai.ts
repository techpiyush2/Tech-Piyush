import type { ProjectContent } from "../../types";

export default {
  title: "Sally AI — E-commerce Chatbot",
  theme: "dark",
  tags: ["node", "express", "mongodb", "ai"],
  description:
    "Sally AI is a retrieval-augmented generation (RAG) chatbot designed for conversational product discovery and instant customer support.<br/><br/>I built the semantic search engine, integrated vector databases for embeddings retrieval, and set up intent detection logic to improve user recommendation quality.",
} as const satisfies ProjectContent;
