/* TO DO: 
1)Add toggle function on the lock button
2)Local storage for the palette
3)Check for hues, brightness and saturation */
const colorDiv = document.querySelectorAll('.color')
const currentHex = document.querySelectorAll('.color h2');
let initialColors;
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('.generate')
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
        return [red, green, blue];
    }
    
    function ColorToHex(color) {
        let hexadecimal = color.toString(16);
        return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
    }
    
    function ConvertRGBtoHex(red, green, blue) {
        let hex = ("#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue));
        return hex;
    }
    //giving each div a color
    function updateColor() {
        let colors = document.querySelectorAll('.color')
        
        for (const color of colors) {
            let lockBtn = color.querySelector('button.lock');
            if (lockBtn.firstChild.classList.contains('fa-lock')) {
                continue;
            }
            
            let [red, green, blue] = generateRGB();
            let hex = ConvertRGBtoHex(red, green, blue);
            console.log(hex, [red, green, blue])
            color.style = `background: ${hex}`;
            
            let hexText = color.querySelector('h2');
            hexText.innerHTML = hex
        }
    }
    function toggleLock(btn) {
        if (btn.firstChild.classList.contains('fa-lock-open')) {
            btn.firstChild.classList.replace('fa-lock-open', 'fa-lock')
        } else {
            btn.firstChild.classList.replace("fa-lock", "fa-lock-open")
        }
    }
    updateColor();
    
    //All event listeners
    document.querySelectorAll('button.lock').forEach(item => {
        item.addEventListener('click', (event) => {
            //clicking on btn.lock = toggle the icon, no chnage in bg color
            // on click, add classlist of fa-lock and remove fa-lock-open and vice versa
            toggleLock(event.target)
        })
    })
    generateBtn.addEventListener('click', e => {
        updateColor()
    })
    
    window.addEventListener('keydown', (e) => {
        if (e.code == 'Space') {
            e.preventDefault();
            updateColor();
        }
    });
});
