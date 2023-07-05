/* eslint-disable no-undef */
// noinspection JSUnresolvedReference

import customMapViewer from "./customMapViewer.js";
import spectatorsHosting from "./spectatorsHosting.js";
import { removeAd } from "./utils.js";

const gameUrl = "https://generals.io/games/";
const detectionInterval = 1000;

let interval;

interval = setInterval(() => {
  if (window.location.href.startsWith(gameUrl) && socket) {
    clearInterval(interval);
    console.log("plugin entry");
    removeAd();
    spectatorsHosting(socket);
    customMapViewer(socket);
  }
}, detectionInterval);