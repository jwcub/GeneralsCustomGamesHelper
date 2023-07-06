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

      function getClassName(id) {
        return id.toString(36);
      }

      function getStyle(id, amount) {
        return `[class~="${getClassName(id)}"]::before{content:"${amount}"}`;
      }

      function viewElement(id) {
        const land = map[id], element = td[id];

        if (element.classList.contains("fog") || element.classList.contains("obstacle")) {
          element.classList.remove("fog", "obstacle");

          const className = getClassName(id);
          if (!element.classList.contains(className)) {
            element.classList.add(className);
          }

          if (land === "m") {
            element.classList.add("mountain");
            return "";
          } else if (land === "s") {
            element.classList.add("swamp");
            return "";
          } else if (land[0] === "g") {
            element.classList.add("teal", "general");
            return getStyle(id, land.substring(1));
          } else if (land[0] === "n") {
            element.classList.add("neutral");
            return getStyle(id, land.substring(1));
          } else if (land !== " ") {
            element.classList.add("city");
            return getStyle(id, land);
          } else {
            element.classList.add("fog");
          }
        }

        return false;
      }

      const config = { attributes: true };

      let styleHtml = "";

      for (let i = 0; i < map.length; i++) {
        const res = viewElement(i);

        if (res !== false) {
          styleHtml += res;
          new MutationObserver(() => setTimeout(viewElement, 100, i))
            .observe(td[i], config);
        }
      }

      const style = document.createElement("style");
      style.innerHTML = styleHtml;
      $("#react-container").append(style);

      socket.once("game_over", () => style.remove());
    }, 500);
  });
}