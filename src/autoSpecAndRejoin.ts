import type { Client } from "~/types";
import { addMessage, getRid, getUid, nbk, waitUntilElementExists } from "~/utils";

export default async (socket: Client) => {
  socket
    .on("game_lost", () => {
      waitUntilElementExists("button:contains('Spectate')")
        .then(e => e.trigger("click"));
    })
    .on("game_over", () => {
      waitUntilElementExists("button:contains('Play Again')")
        .then(e => e.trigger("click"));
    })
    .on("disconnect", () => {
      addMessage("Disconnected from server.");

      socket.once("connect", () => {
        const rid = getRid(), uid = getUid();
        if (!rid || !uid) {
          return;
        }

        addMessage("Reconnected to server.");

        socket.emit("join_private", rid, uid, nbk);

        socket.once("queue_update", () => {
          socket.emit("set_custom_team", rid, 13);
        });
      });
    });
}