/* eslint-disable no-undef */
// noinspection JSUnresolvedReference

import chatPreservation from "./chatPreservation.js";
import customMapViewer from "./customMapViewer.js";
import removeAd from "./removeAd.js";
import spectatorsHosting from "./spectatorsHosting.js";

const gameUrl = "https://generals.io/games/";
const detectionInterval = 1000;

let interval;

interval = setInterval(() => {
  if (window.location.href.startsWith(gameUrl) && socket) {
    clearInterval(interval);
    console.log("plugin entry");
    removeAd(socket);
    spectatorsHosting(socket);
    customMapViewer(socket);
    chatPreservation(socket);
  }
}, detectionInterval);