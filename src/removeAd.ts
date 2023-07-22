import $ from "jquery";

import type { Client } from "~/types";

export default async (socket: Client) => {
  function removeAd() {
    $("#custom-queue-ad-top > div, #custom-queue-ad > div, #custom-queue-ad-skyscraper > div").remove();
  }

  removeAd();

  socket.on("queue_update", removeAd);
}