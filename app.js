import { getStoredPalettes } from "./modules/load_palettes.js";
const colorDiv = document.querySelectorAll(".color");

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.querySelector(".generate");
  const swatchBtns = document.querySelectorAll(".adjust");
  //color object
  function initializeColors() {
    let colors = [];
    for (let i = 0; i < 5; i++) {
      colors[i] = {
        id: i,
        hex: "",
        rgb: {
          red: 0,
          green: 0,
          blue: 0,
        },
        shades: [],
        tints: [],
      };
    }
    return colors;
  }

  //Generating color from sratch
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  function generateRGB() {
    let red = getRandomInt(0, 256),
      green = getRandomInt(0, 256),
      blue = getRandomInt(0, 256);
    return {
      red: red,
      green: green,
      blue: blue,
    };
  }

  function ColorToHex(color) {
    let hexadecimal = Math.min(Math.max(Math.round(color), 0), 255).toString(
      16
    );
    return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
  }

  // round color rgb
  // if value below 0, then take 0
  // if value above 255, then set 255
  // then convert int to 16 bit string toString(16)
  // pad the end result to make sure its always 2 character long, if 1 character then prepend 0

  function ConvertRGBtoHex(red, green, blue) {
    let hex = "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
    return hex;
  }
  //giving each div a color
  // write function for generating postive tint based on rgb param, 10% each ahead
  function rgbShade(rgb, i) {
    return {
      red: rgb.red * (1 - 0.1 * i),
      green: rgb.green * (1 - 0.1 * i),
      blue: rgb.blue * (1 - 0.1 * i),
    };
  }

  // write function for generating negative shades based on rgb params, -10%
  function rgbTint(rgb, i) {
    return {
      red: rgb.red + (255 - rgb.red) * i * 0.1,
      green: rgb.green + (255 - rgb.green) * i * 0.1,
      blue: rgb.blue + (255 - rgb.blue) * i * 0.1,
    };
  }
  function generateShadesTint(color) {
    color["shades"] = [];
    color["tints"] = [];
    for (let i = 1; i <= 10; i++) {
      let shade = rgbShade(color.rgb, i);
      let tint = rgbTint(color.rgb, i);
      color["shades"].push(ConvertRGBtoHex(shade.red, shade.green, shade.blue));
      color["tints"].push(ConvertRGBtoHex(tint.red, tint.green, tint.blue));
    }
  }

  function updateVariants(color) {
    let colorElem = document.querySelector(`[data-color-id="${color.id}"]`);
    let variants = colorElem.querySelector(".variants");
    let original = variants.querySelector(".original");
    original.style = `background-color: ${color.hex}`;

    for (let i = 0; i < 10; i++) {
      let tint = color.tints[i];
      let shade = color.shades[i];
      let tintElem = variants.querySelector(`[data-tint-id="${i}"]`);
      let shadeElem = variants.querySelector(`[data-shade-id="${i}"]`);
      tintElem.style = `background-color: ${tint}; color: #191919;`;
      shadeElem.style = `background-color: ${shade}; color: #dad9d9;`;
      tintElem.dataset["textContrast"] = "#191919";
      shadeElem.dataset["textContrast"] = "#dad9d9";
      tintElem.innerHTML = `<div class="shade-hex">${tint}</div>`;
      shadeElem.innerHTML = `<div class="shade-hex">${shade}</div>`;
    }
  }

  function generateColors(colors) {
    for (const color of colors) {
      color["rgb"] = generateRGB();
      color["hex"] = ConvertRGBtoHex(
        color.rgb.red,
        color.rgb.green,
        color.rgb.blue
      );
      generateShadesTint(color);
    }
  }

  function getContrast(rgb) {
    let full = 255 + 255 + 255;
    let third = full / 3;
    let sum = rgb.red + rgb.green + rgb.blue;

    if (sum <= third) {
      return "#eeeeee";
    } else if (sum > third * 2) {
      return "#191919";
    } else {
      return "#222";
    }
  }

  function getControlsContrast(rgb) {
    let full = 255 + 255 + 255;
    let third = full / 3;
    let sum = rgb.red + rgb.green + rgb.blue;

    if (sum <= third) {
      return "#ddd";
    } else if (sum > third * 2) {
      return "#2a2a2a";
    } else {
      return "#333";
    }
  }

  function updateColor(colors) {
    let colorElements = document.querySelectorAll(".color");
    for (let i = 0; i < 5; i++) {
      let hex = colors[i]["hex"];
      let currentElement = colorElements[i];
      let lockBtn = currentElement.querySelector("button.lock");
      if (lockBtn.firstChild.classList.contains("fa-lock")) {
        continue;
      }
      currentElement.style = `background: ${hex}`;
      updateVariants(colors[i]);
      let originalSlab = currentElement.querySelector(".original");
      originalSlab.innerHTML = hex;
      let hexText = currentElement.querySelector("h2");
      hexText.innerHTML = hex;
      hexText.style.color = getContrast(colors[i]["rgb"]);
      currentElement.children[1].style.color = getControlsContrast(
        colors[i]["rgb"]
      );
    }
  }

  function toggleLock(btn) {
    if (btn.firstChild.classList.contains("fa-lock-open")) {
      btn.firstChild.classList.replace("fa-lock-open", "fa-lock");
    } else {
      btn.firstChild.classList.replace("fa-lock", "fa-lock-open");
    }
  }

  function toggleVariants(colorElement, variants) {
    let h2 = colorElement.querySelector("h2");
    let controls = colorElement.querySelector(".controls");
    h2.style = "display: none";
    controls.style = "display: none";
    variants.style = "display: flex";
  }

  function colorKey() {
    let savedColor = [];
    colors.forEach((color) => {
      savedColor.push(color.hex);
    });
    return savedColor.join("-");
  } //function is returning the string of colors to create a key to be stored in local storage
  let saveContainer = document.querySelector(".save-container");
  function saveToLocalStorage(colorKey) {
    //save modal
    let storageKey = colorKey();
    saveContainer.style = "display: flex;";
    document.getElementById("save-msg").innerHTML = `Saved ${storageKey}`;
    localStorage.setItem(storageKey, JSON.stringify(colors));
    //alert(`saved ${storageKey}`);
  }

  let colors = initializeColors();
  generateColors(colors); //generating the first color
  updateColor(colors); // this function will update the hex,rgb for all colors
  //All event listeners

  let saveBtn = document.querySelector(".save"); //save panel btn
  let closeSaveBtn = document.querySelector(".close-save");
  let libraryContainer = document.querySelector(".library-container");

  let closeLibraryBtn = document.querySelector(".close-library");
  let libraryBtn = document.querySelector(".library");
  let list = document.querySelector(".list");

  libraryBtn.addEventListener("click", (e) => {
    libraryContainer.style = "display: flex;";
    let palettes = getStoredPalettes();
    Object.keys(palettes).forEach((key) => {
      let li = list.appendChild(document.createElement("li"));
      let liClass = li.classList.add("list-item");
      li.innerHTML = key;
      li.addEventListener("click", (e) => {
        let paletteName = e.target.innerHTML; //assigning key to li
        updateColor(palettes[paletteName]);
      });
    });
  });

  closeLibraryBtn.addEventListener("click", (e) => {
    libraryContainer.style = "display: none;";
    list.innerHTML = "";
  });

  saveBtn.addEventListener("click", (e) => {
    saveToLocalStorage(colorKey);
  });

  closeSaveBtn.addEventListener("click", (e) => {
    saveContainer.style = "display: none;";
  });

  let shades = document.querySelectorAll(".slabs");

  shades.forEach((shade) => {
    shade.addEventListener("click", (event) => {
      let newBg = shade.children[0].innerHTML;
      let textColor = shade.dataset["textContrast"];
      let variants = document.querySelectorAll(".variants");
      let colorId = shade.parentNode.parentNode.dataset["colorId"];
      // This is H2 element
      shade.parentNode.parentNode.children[0].style = "display: flex;";
      shade.parentNode.parentNode.children[0].innerHTML = newBg;
      shade.parentNode.parentNode.children[1].style = "display: flex;";
      shade.parentNode.parentNode.style = `background: ${newBg}; color: ${textColor};`;
      shade.parentNode.style = `display: none;`;
      colors[colorId].hex = newBg;
    });

    shade.addEventListener("mouseenter", (event) => {
      if (event.target.children[0]) {
        event.target.children[0].style.display = "flex";
      }
    });
    shade.addEventListener("mouseleave", (event) => {
      if (event.target.children[0]) {
        event.target.children[0].style.display = "none";
      }
    });
  });

  // function callback for all buttons
  document.querySelectorAll("button.lock").forEach((item) => {
    item.addEventListener("click", (event) => {
      toggleLock(event.target);
    });
  });

  generateBtn.addEventListener("click", (e) => {
    generateColors(colors);
    updateColor(colors);
  });

  swatchBtns.forEach((swatchBtn) => {
    swatchBtn.addEventListener("click", (event) => {
      let colorElement = event.target.parentNode.parentNode;
      let variants = colorElement.querySelector(".variants");
      toggleVariants(colorElement, variants);
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.code == "Space") {
      e.preventDefault();
      updateColor(colors);
    }
  });
});
