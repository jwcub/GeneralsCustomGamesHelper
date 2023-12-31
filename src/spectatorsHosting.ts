import $ from "jquery";

import type { Client } from "~/types";
import { addMessage, getRid, getUsername, sleep, waitUntilElementExists } from "~/utils";

const trigger = `
<svg class="hover-show" viewBox="0 0 1024 700" width="13px" height="13px" xmlns="http://www.w3.org/2000/svg"><path class="white" d="M 880.038 439.253 L 904.318 456.072 L 897.869 452.405 C 894.454 450.508 888.89 446.714 885.728 444.059 L 880.038 439.253 Z M 569.572 219.612 C 569.611 219.541 560.983 232.619 561.362 233.505 C 562.247 235.781 712.606 488.698 713.871 490.089 C 714.756 490.975 856.516 415.605 859.678 412.57 C 860.184 412.065 859.487 412.182 857.907 401.695 C 857.869 401.441 936.286 461.758 948.366 461.763 C 948.619 461.763 936.439 462.015 936.439 462.142 C 936.439 462.395 869.415 747.938 869.415 747.938 L 869.415 889.192 L 153.659 889.192 L 153.659 748.318 L 120.654 607.949 C 102.57 530.683 87.395 466.189 87.015 464.544 C 86.51 462.142 75.106 461.731 75.242 461.763 C 87.126 464.578 165.848 397.97 165.748 398.334 C 162.598 409.746 165.293 404.856 162.638 409.662 C 161.626 411.559 308.571 490.595 309.203 490.089 C 310.468 488.825 460.953 235.655 461.839 233.378 C 462.092 232.619 452.962 222.44 453.113 222.63 C 461.658 233.343 561.641 233.899 569.572 219.612 Z" style="stroke-width: 0;"></path><path class="white" d="M 504 297.2 m -82.074 0 a 82.074 82.074 0 1 0 164.148 0 a 82.074 82.074 0 1 0 -164.148 0 Z M 504 297.2 m -49.243 0 a 49.243 49.243 0 0 1 98.486 0 a 49.243 49.243 0 0 1 -98.486 0 Z" transform="matrix(0.352455, -0.935829, 0.935829, 0.352455, -370.007055, 747.229931)"></path><path class="white" d="M 504 297.2 m -82.074 0 a 82.074 82.074 0 1 0 164.148 0 a 82.074 82.074 0 1 0 -164.148 0 Z M 504 297.2 m -49.243 0 a 49.243 49.243 0 0 1 98.486 0 a 49.243 49.243 0 0 1 -98.486 0 Z" transform="matrix(0.352455, -0.935829, 0.935829, 0.352455, 481.352607, 746.899791)"></path><path class="white" d="M 504 297.2 m -82.074 0 a 82.074 82.074 0 1 0 164.148 0 a 82.074 82.074 0 1 0 -164.148 0 Z M 504 297.2 m -49.243 0 a 49.243 49.243 0 0 1 98.486 0 a 49.243 49.243 0 0 1 -98.486 0 Z" transform="matrix(0.352455, -0.935829, 0.935829, 0.352455, 55.318002, 530.920357)"></path><circle class="white" cx="86.928" cy="376.918" r="66.167"></circle><circle class="white" cx="518.083" cy="166.811" r="66.564"></circle><circle class="white" cx="944.862" cy="379.106" r="64.369"></circle></svg><span class="inline-color-block hover-false white"></span>
`;

export default async (socket: Client) => {
  const rid = getRid();
  if (!rid) {
    return;
  }

  let hostDump = true;
  await waitUntilElementExists(".chat-messages-container");
  addMessage("host dump: on");
  socket.emit("set_custom_team", rid, 13);

  document.body.onkeydown = ev => {
    if (ev.key.toUpperCase() === "H" && ev.target === document.body) {
      ev.preventDefault();
      hostDump = !hostDump;
      addMessage(`host dump: ${hostDump ? "on" : "off"}`);
    }
  };

  const myUsername = await getUsername(socket);

  socket.on("queue_update", async ({ usernames }) => {
    $(".trigger").remove();

    if (usernames.indexOf(myUsername) !== 0) {
      return;
    }

    if (hostDump) {
      const pid = await Promise.race([
        (async () => {
          await sleep(500);
          return 1;
        })()
        , new Promise<number>(resolve => {
          socket.once("chat_message", (_, { multiText }) => {
            resolve(multiText && multiText[1] === " made " ?
              Math.max(1, usernames.indexOf(multiText[0])) : 1);
          });
        })]);
      socket.emit("set_custom_host", rid, pid);
    }

    for (const container of $(".custom-team-container")) {
      for (let i = 0; i < container.children.length; i++) {
        const user = container.children[i] as HTMLElement;

        if (i === 0 && user.innerText !== "Spectators") {
          break;
        }

        if (user.children.length > 1) {
          continue;
        }

        const username = user.innerText;

        const element = document.createElement("a");
        $(element)
          .html(trigger)
          .addClass("inline-color-block-hover trigger")
          .css("display", "inline-block")
          .css("width", "10px")
          .on("click", () => {
            socket.emit("set_custom_host", rid, usernames.indexOf(username));
          });

        user.prepend(element);
      }
    }
  });
}