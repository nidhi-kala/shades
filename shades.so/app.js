/* TO DO: 
1)Add toggle function on the lock button
2)Local storage for the palette
3)Check for hues, brightness and saturation */
const colorDiv = document.querySelectorAll('.color')
const currentHex = document.querySelectorAll('.color h2');
const generateBtn = document.querySelector('.generate')
console.log(currentHex)
let initialColors;
document.addEventListener('DOMContentLoaded', () => { 
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
            let [red, green, blue] = generateRGB();
            let hex = ConvertRGBtoHex(red, green, blue);
            console.log(hex,[red, green, blue])
            color.style = `background: ${hex}`;

            let hexText = color.querySelector('h2');
            hexText.innerHTML = hex
        }
    }   
    updateColor();

//All event listeners
    
   //document.querySelectorAll('fa-lock-open').forEach(item => {
        //item.addEventListener('click', event => { toggle().classList('fa-lock')
            //handle click
        //})
    //}))
    
    window.addEventListener('keydown', (e) => {
        if (e.code == 'Space') {
            e.preventDefault();
            updateColor();
        }
    });
});
