import $ from "jquery";

import { Client } from "~/types";

const publicApi = "/api/games/public";
const pollingInterval = 5000;

let initialized = false;
let listening = false;

interface Room {
  id: string;
  map?: string;
  mods: [string, number][],
  players: string;
}

export default async (socket: Client) => {
  if (initialized) {
    return;
  }

  socket.io.engine.on("packetCreate", ({ data }) => {
    if (!data) {
      return;
    }

    if (data.includes(`"listen_public`)) {
      listening = true;
    } else if (data.includes(`"stop_listen`)) {
      listening = false;
    }
  });

  const tmp = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", () => {
      if (!this.responseURL.includes(publicApi) || $(".scroll-modal-container").length === 0) {
        return;
      }

      const rooms = JSON.parse(this.responseText) as Room[];

      $(".scroll-modal-container > p").remove();

      $(".scroll-modal-container tr").remove();

      const tbody = $(".scroll-modal-container tbody");

      tbody.append(
        "<tr><th>Id</th><th>Map</th><th>Players</th><th>Mods</th></tr>"
      );

      $(".scroll-modal-container table").css("width", "100%");

      for (const room of rooms) {
        const tr = document.createElement("tr");

        $(tr).html(
          `
          <td>${room.id}</td>
          <td class="${room.map ? "public-custom-map" : ""}">
            ${room.map ?
            `<a href="/maps/${encodeURIComponent(room.map)}">${room.map}</a>` :
            "None"}
          </td>
          <td>${room.players}</td>
          <td>
            ${room.mods.length > 0 ? room.mods.map(mod =>
            `<div class="custom-game-mod">${mod.join(": ")}</div>`
          ).join("") : "None"}
          </td>
          `
        ).on("click", () => window.location.href = `/games/${room.id}`);

        tbody.append(tr);
      }
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    tmp.apply(this, arguments);
  };

  setInterval(() => listening && $.get(publicApi), pollingInterval);

  initialized = true;
}