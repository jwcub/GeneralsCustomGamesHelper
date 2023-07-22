import $ from "jquery";

import { Client } from "~/types";

export function downloadMap(mapName: string) {
  return fetch("/api/map?name=" + mapName).then(res => res.json());
}

export function disableMutationObserver() {
  if (document.body.children.length === 0) {
    return;
  }

  const e = document.body.children[0];
  document.body.removeChild(e);
  document.children[0].prepend(e);
}

export function getRid() {
  return window.location.href.match(/games\/([\s\S]*)$/)?.at(1);
}

export function getUid() {
  return localStorage.getItem("user_id");
}

export function getUsername(socket: Client): Promise<string> {
  return new Promise((resolve, reject) => {
    const uid = getUid();
    if (!uid) {
      reject();
    } else {
      socket.emit("get_username", uid, resolve);
    }
  });
}

export function addMessage(message: string) {
  $(".chat-messages-container")
    .append(`
    <p class="chat-message server-chat-message">
       <span class="announcement-spacer"></span>  
       ${message}
    </p>
  `)
    .scrollTop(1e8);
}

export function waitUntilElementExists(selector: string): Promise<JQuery<HTMLElement>> {
  return new Promise((resolve, reject) => {
    let tryTime = 0;

    const interval = setInterval(() => {
      const element = $(selector);
      if (element.length > 0) {
        clearInterval(interval);
        resolve(element);
      }

      tryTime++;
      if (tryTime > 50) {
        clearInterval(interval);
        reject();
      }
    }, 100);
  });
}

export function sleep(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export const baseUrl = "https://generals.io/";

export function relativeUrl(path: string) {
  if (path.startsWith("/")) {
    path = path.replace("/", "");
  }

  return baseUrl + path;
}

export function getStarsAndRanks(username: string) {
  return fetch("/api/starsAndRanks?u=" + username).then(res => res.json());
}