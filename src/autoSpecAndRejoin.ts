import type { Client } from "~/types";

export default (socket: Client) => {
  function tryClick(selector: string) {
    let tryTime = 0;

    const interval = setInterval(() => {
      const button = $(selector);
      if (button.length > 0) {
        clearInterval(interval);
        button.click();
      }

      tryTime++;
      if (tryTime >= 5) {
        clearInterval(interval);
      }
    }, 1000);
  }

  socket.on("game_lost", () => tryClick("button:contains('Spectate')"))
    .on("game_over", () => tryClick("button:contains('Play Again')"));
}