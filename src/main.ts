import chatPreservation from "./chatPreservation.js";
import customMapViewer from "./customMapViewer.js";
import removeAd from "./removeAd";
import spectatorsHosting from "./spectatorsHosting";
import { Client } from "./types";

const gameUrl = "https://generals.io/games/";
const detectionInterval = 1000;

declare global {
  const socket: Client;
}

const interval = setInterval(() => {
  if (window.location.href.startsWith(gameUrl) && socket) {
    clearInterval(interval);
    console.log("plugin entry");
    removeAd(socket);
    spectatorsHosting(socket);
    customMapViewer(socket);
    chatPreservation(socket);
  }
}, detectionInterval);