'use strict'

const KEYMAP = {
    'ZERO': 48,
    'ONE': 49,
    'TWO': 50,
    'THREE': 51,
    'FOUR': 52,
    'FIVE': 53,
    'SIX': 54,
    'SEVEN': 55,
    'EIGHT': 56,
    'NINE': 57,
    'A': 65,
    'B': 66,
    'C': 67,
    'D': 68,
    'E': 69,
    'F': 70,
    'G': 71,
    'H': 72,
    'I': 73,
    'J': 74,
    'K': 75,
    'L': 76,
    'M': 77,
    'N': 78,
    'O': 79,
    'P': 80,
    'Q': 81,
    'R': 82,
    'S': 83,
    'T': 84,
    'U': 85,
    'V': 86,
    'W': 87,
    'X': 88,
    'Y': 89,
    'Z': 90,
    'ENTER': 13,
    'SHIFT': 16,
    'ESC': 27,
    'SPACE': 32,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40,
    'BACKSPACE': 8,
    'DELETE': 46,
    'TAB': 9,
    'TILDE': 192
  };

let ignoreKey = [];// keys to ignre , use  A, SPACE ...etc
let keyState = {};

window.addEventListener(
    'keydown',
    function(e) {
      e.preventDefault();
        let key = ( Object.entries( KEYMAP ).find(([k,v])=>v== [e.keyCode || e.which]) || [] )[0];
        if ( !ignoreKey.includes(key) ){
          keyState[key] = true;
        }
    },
    true
  );
window.addEventListener(
    'keyup',
    function(e) {
      e.preventDefault();
        let key = ( Object.entries( KEYMAP ).find(([k,v])=>v== [e.keyCode || e.which]) || [] )[0];
        
        if ( !ignoreKey.includes(key) ){
          keyState[key] = false;
        }
    },
    true
  );

 



function controlManual(obj,up,down,left,right,data){

    let posx = parseInt(obj.style.left);
    let posy = parseInt(obj.style.top);

    let minTop = data["mintop"];
    let maxTop = data["maxtop"];
    let minLeft = data["minleft"];
    let maxLeft = data["maxleft"];

    if( keyState[up]){
        if ( posy > (minTop) ) {
            obj.style.top = posy - 1 + "px";
        }
        
        }
        
    if(keyState[down]){
          if ( posy < (maxTop) ) {
        obj.style.top = posy + 1 + "px";
          }
        }
        
    if(keyState[left]){
          if ( posx > (minLeft) ) {
           obj.style.left = posx - 3 +"px";
          }
        }
        
    if(keyState[right]){
          if ( posx < (maxLeft) ) {
           obj.style.left = posx + 3 +"px";
          }
        }
}

