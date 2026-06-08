import type { ProjectContent } from "../../types";

export default {
  title: "Pateron Ship Plattform",
  theme: "dark",
  tags: ["node", "express", "mongodb", "stripe"],
  description:
    "Pateron Ship ist eine abonnementbasierte Plattform, auf der Ersteller Pakete für zahlende Mitglieder anbieten können.<br/><br/>Ich habe den Abonnement-Abrechnungszyklus entworfen, Webhooks für Stripe-Zahlungen eingerichtet und Zugriffskontrollregeln für Premium-Inhalte implementiert.",
} as const satisfies ProjectContent;
