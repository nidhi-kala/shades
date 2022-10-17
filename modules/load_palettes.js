export function getStoredPalettes() {
  //retreiving from local storage
  let paletteList = {};
  for (let i = 0; i < localStorage.length; i++) {
    let storedKey = localStorage.key(i);
    let palette = localStorage.getItem(storedKey);

    paletteList[storedKey] = JSON.parse(palette);
  }
  return paletteList;
}
