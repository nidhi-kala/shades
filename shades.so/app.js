/* TO DO: 
1)Add toggle function on the lock button
2)Local storage for the palette
3)Check for hues, brightness and saturation */
const colorDiv = document.querySelectorAll('.color')
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('.generate');
    const swatchBtns = document.querySelectorAll('.adjust');
    //color object
    function initializeColors() {
        let colors = [];
        for (let i = 0; i<5; i++){
            colors[i] = {
                id: i,
                hex: "",
                rgb: {
                    red: 0,
                    green: 0,
                    blue: 0

                },
                shades: [],
                tints: []
            }
        }
        return colors;
    };
    
    
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
            blue: blue
        };
    }
    
    function ColorToHex(color) {
        let hexadecimal = Math.min(Math.max(Math.round(color), 0), 255).toString(16)
        return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
    }
    
    // round color rgb
    // if value below 0, then take 0
    // if value above 255, then set 255
    // then convert int to 16 bit string toString(16)
    // pad the end result to make sure its always 2 character long, if 1 character then prepend 0



    function ConvertRGBtoHex(red, green, blue) {
        let hex = ("#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue));
        return hex;
    }
    //     const rgbToLightness = (r,g,b) => 
    //         1 / 2 * (Math.max(r, g, b) + Math.min(r, g, b));
    
    //     const rgbToSaturation = (r,g,b) => {
    //       const L = rgbToLightness(r,g,b);
    //       const max = Math.max(r,g,b);
    //       const min = Math.min(r,g,b);
    //       return (L === 0 || L === 1)
    //        ? 0
    //        : (max - min)/(1 - Math.abs(2 * L - 1));
    //     };
    
    //     const rgbToHue = (r,g,b) => Math.round(
    //      Math.atan2(
    //        Math.sqrt(3) * (g - b),
    //        2 * r - g - b,
    //      ) * 180 / Math.PI
    // )   ;
    //giving each div a color
    // write function for generating postive tint based on rgb param, 10% each ahead
    function rgbShade(rgb, i) {
        return {
            red: rgb.red * (1 - 0.1 * i),
            green: rgb.green * (1 - 0.1 * i),
            blue: rgb.blue * (1 - 0.1 * i)
        }
    }  
    
    // write function for generating negative shardes based on rgb params, -10%
    function rgbTint(rgb, i) {
        return {
            red: rgb.red + (255 - rgb.red) * i * 0.1,
            green: rgb.green + (255 - rgb.green) * i * 0.1,
            blue: rgb.blue + (255 - rgb.blue) * i * 0.1
        }
    }
    function generateShadesTint(color) {
        color['shades'] = [];
        color['tints'] = [];
        for (let i = 1; i <= 10; i++) {
            let shade = rgbShade(color.rgb, i);
            let tint = rgbTint(color.rgb, i);
            color['shades'].push(ConvertRGBtoHex(shade.red, shade.green, shade.blue));
            color['tints'].push(ConvertRGBtoHex(tint.red, tint.green, tint.blue));
        }
    }

    function updateVariants(color) {
        let colorElem = document.querySelector(`[data-color-id="${color.id}"]`);
        let variants = colorElem.querySelector('.variants');
        let original = variants.querySelector('.original')
        original.style = `background-color: ${color.hex}`;

        for (let i = 0; i < 10; i++) {
            let tint = color.tints[i];
            let shade = color.shades[i];
            let tintElem = variants.querySelector(`[data-tint-id="${i}"]`);
            let shadeElem = variants.querySelector(`[data-shade-id="${i}"]`);

            tintElem.style = `background-color: ${tint}`;
            shadeElem.style = `background-color: ${shade}`;
        }
    }
    
    
    function generateColors(colors) {
        for (const color of colors) {
            color['rgb'] = generateRGB();
            color['hex'] = ConvertRGBtoHex(color.rgb.red, color.rgb.green, color.rgb.blue);
            generateShadesTint(color)
        }
    }
    function updateColor(colors) {
        generateColors(colors);
        let colorElements = document.querySelectorAll('.color')
        
        for (let i = 0; i < 5; i++) {
            let hex = colors[i]['hex'];
            let currentElement = colorElements[i];
            let lockBtn = currentElement.querySelector('button.lock');
            if (lockBtn.firstChild.classList.contains('fa-lock')) {
                continue;
            }
            
            currentElement.style = `background: ${hex}`;
            updateVariants(colors[i]);

            let hexText = currentElement.querySelector('h2');
            hexText.innerHTML = hex;
        }

        console.log(colors)
    }
    
    function toggleLock(btn) {
        if (btn.firstChild.classList.contains('fa-lock-open')) {
            btn.firstChild.classList.replace('fa-lock-open', 'fa-lock')
        } else {
            btn.firstChild.classList.replace("fa-lock", "fa-lock-open")
        }
    }

    function toggleVariants(colorElement, variants) {
        let h2 = colorElement.querySelector('h2');
        let controls = colorElement.querySelector('.controls');
        h2.style = "display: none";
        controls.style = "display: none"
        variants.style = "display: flex"
    }

    let colors = initializeColors();
    updateColor(colors) // this function will populate hex,rgb,hsl for all colors
    //All event listeners
    document.querySelectorAll('button.lock').forEach(item => {
        item.addEventListener('click', (event) => {
            //clicking on btn.lock = toggle the icon, no chnage in bg color
            // on click, add classlist of fa-lock and remove fa-lock-open and vice versa
            toggleLock(event.target)
        })
    })
    generateBtn.addEventListener('click', e => {
        updateColor(colors)
    })

    swatchBtns.forEach((swatchBtn) => {
        swatchBtn.addEventListener('click', (event) => {
            let colorElement = event.target.parentNode.parentNode;
            let variants = colorElement.querySelector('.variants');

            toggleVariants(colorElement, variants)
        })
    })
    window.addEventListener('keydown', (e) => {
        if (e.code == 'Space') {
            e.preventDefault();
            updateColor(colors);
        }
    });
});
