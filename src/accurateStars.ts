import $ from "jquery";
import _ from "lodash";

import { getStarsAndRanks } from "~/utils";

interface Stars {
  duel?: number,
  "duel-alltime"?: number,
  ffa?: number,
  "ffa-alltime"?: number,
  "2v2"?: number,
  "2v2-alltime"?: number
}

export default async () => {
  const username = window.location.href.match(/profiles\/([\s\S]+)$/)?.at(1);
  const stars = (username ? (await getStarsAndRanks(username)).stars :
    JSON.parse(localStorage.stars ?? "{}")) as Stars;

  function displayStar(star: number) {
    return _.round(star, 3).toFixed(3);
  }

  function setStar(mode: "1v1" | "FFA" | "2v2", star: number) {
    const selector = $(`h3:contains(${mode}) + h2 > span`);
    selector.attr("title", star);

    const str = displayStar(star);
    const dotIndex = str.indexOf(".");
    selector[0].children[1].innerHTML = str.substring(0, dotIndex + 2);
    selector[0].children[2].innerHTML = str.substring(dotIndex + 2);
  }

  function removeText() {
    for (const span of $("h3 + h2 > span")) {
      $(span).append("<span></span><span style='font-size: 18px'></span>");
      span.childNodes[1].remove();
    }
  }

  function showCurrent() {
    if (stars.duel) {
      setStar("1v1", stars.duel);
    }
    if (stars.ffa) {
      setStar("FFA", stars.ffa);
    }
    if (stars["2v2"]) {
      setStar("2v2", stars["2v2"]);
    }
  }

  function showAllTime() {
    if (stars["duel-alltime"]) {
      setStar("1v1", stars["duel-alltime"]);
    }
    if (stars["ffa-alltime"]) {
      setStar("FFA", stars["ffa-alltime"]);
    }
    if (stars["2v2-alltime"]) {
      setStar("2v2", stars["2v2-alltime"]);
    }
  }


  removeText();
  showCurrent();

  $("#tabs-main-menu-rankitem-types > div:nth-child(1)").on("click", showCurrent);
  $("#tabs-main-menu-rankitem-types > div:nth-child(2)").on("click", showAllTime);
}