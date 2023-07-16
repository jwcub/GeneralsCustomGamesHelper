import $ from "jquery";

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