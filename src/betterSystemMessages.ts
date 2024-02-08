import $ from "jquery";

const styleId = "system-message";

export default async () => {
  if ($(`#${styleId}`).length) {
    return;
  }

  const style = document.createElement("style");

  $(style)
    .attr("id", styleId)
    .html(`
    .server-chat-message {
       font-size: 12px;
       color: gainsboro;
       text-align: center;
    }
    
    .announcement-spacer {
      display: none;
    }
    `);

  $("head").append(style);
}