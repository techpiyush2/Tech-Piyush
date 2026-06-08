import type { ProjectContent } from "../../types";

export default {
  title: "TruckOne Logistics platform",
  theme: "light",
  tags: ["node", "express", "mongodb", "websockets"],
  description:
    "TruckOne is an operations and fleet dispatch platform facilitating shipment tracking and logistics management.<br/><br/>I built shipment tracking APIs, integrated mapping workflows, and enabled real-time dispatch alerts using WebSockets.",
} as const satisfies ProjectContent;
