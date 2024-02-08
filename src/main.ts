import accurateStars from "~/accurateStars";
import autoSpecAndRejoin from "~/autoSpecAndRejoin";
import betterSystemMessages from "~/betterSystemMessages";
import chatPreservation from "~/chatPreservation";
import customMapViewer from "~/customMapViewer";
import removeAd from "~/removeAd";
import spectatorsHosting from "~/spectatorsHosting";
import type { Client } from "~/types";
import { baseUrl, relativeUrl } from "~/utils";

const detectionInterval = 500;

declare global {
  const socket: Client | undefined;
}

let status: "base" | "custom" | null = null;

setInterval(async () => {
  if (!socket) {
    return;
  }

  if (window.location.href === baseUrl || window.location.href.startsWith(relativeUrl("profiles"))) {
    if (status !== "base") {
      status = "base";
      await accurateStars();
    }
  } else if (window.location.href.startsWith(relativeUrl("games"))) {
    if (status !== "custom") {
      status = "custom";
      await removeAd(socket);
      await spectatorsHosting(socket);
      await customMapViewer(socket);
      await chatPreservation(socket);
      await autoSpecAndRejoin(socket);
      await betterSystemMessages();
    }
  }
}, detectionInterval);