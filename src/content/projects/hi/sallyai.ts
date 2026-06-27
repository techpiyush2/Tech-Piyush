import type { ProjectContent } from "../../types";

export default {
  title: "Sally AI — E-Commerce Chatbot",
  theme: "dark",
  tags: ["node", "express", "mongodb", "ai"],
  description:
    "Sally AI ist ein RAG-basierter Chatbot (Retrieval-Augmented Generation) für die Konversations-Produktsuche und sofortigen Kundensupport.<br/><br/>Ich habe die semantische Suchmaschine aufgebaut, Vektordatenbanken integriert und Intent-Erkennungslogik eingerichtet, um die Qualität der Produktempfehlungen zu verbessern.",
} as const satisfies ProjectContent;
