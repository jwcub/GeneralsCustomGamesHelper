import $ from "jquery";

export default socket => {
  let previousChat = "";

  function saveChat() {
    previousChat = $(".chat-messages-container").html();
  }

  function recoverChat() {
    $(".chat-messages-container").prepend(previousChat);
    previousChat = "";
  }

  socket.on("pre_game_start", saveChat)
    .on("game_start", () => {
      socket.once("chat_message", recoverChat);
    })
    .on("game_over", () => {
      saveChat();
      socket.on("chat_message", saveChat)
        .once("queue_update", () => {
          socket.off("chat_message", saveChat);
          recoverChat();
        });
    });
}