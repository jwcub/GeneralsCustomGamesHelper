export function downloadMap(mapName) {
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