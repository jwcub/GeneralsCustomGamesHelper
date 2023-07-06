import $ from "jquery";

import { disableMutationObserver, downloadMap } from "./utils.js";

export default socket => {
  socket.on("game_start", async ({ options: { map: mapName } }) => {
    disableMutationObserver();

    if (!mapName) {
      return;
    }

    let map;

    try {
      map = (await downloadMap(mapName)).map;
    } catch (_) {
      return;
    }

    map = map.split(",").map(land => land.replace(/^L_/, ""));

    let it;

    it = setInterval(() => {
      const td = $("#gameMap td");

      if (td.length !== map.length) {
        return;
      }

      clearInterval(it);

      function viewElement(id) {
        const land = map[id], element = td[id];

        if (element.classList.contains("fog") || element.classList.contains("obstacle")) {
          element.classList.remove("fog", "obstacle");

          if (land === "m") {
            element.classList.add("mountain");
            return true;
          } else if (land === "s") {
            element.classList.add("swamp");
            return true;
          } else if (land[0] === "g") {
            element.classList.add("teal", "general");
            return true;
          } else if (land[0] === "n") {
            element.classList.add("neutral");
            return true;
          } else if (land !== " ") {
            element.classList.add("city");
            return true;
          } else {
            element.classList.add("fog");
          }
        }

        return false;
      }

      const config = { attributes: true };

      for (let i = 0; i < map.length; i++) {
        if (viewElement(i)) {
          new MutationObserver(() => setTimeout(viewElement, 100, i))
            .observe(td[i], config);
        }
      }
    }, 500);
  });
}