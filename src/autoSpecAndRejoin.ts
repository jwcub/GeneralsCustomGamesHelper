import type { Client } from "~/types";
import { waitUntilElementExists } from "~/utils";

export default async (socket: Client) => {
  socket.on("game_lost", () => {
    waitUntilElementExists("button:contains('Spectate')")
      .then(e => e.click());
  })
    .on("game_over",  () => {
      waitUntilElementExists("button:contains('Play Again')")
        .then(e => e.click());
    });
}