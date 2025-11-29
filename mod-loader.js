console.log("%c🐍 TEST MOD ACTIVATED", "color:#6f0;font-size:20px");

// wait until snake engine exists
function waitForSnake() {
    if (!window.snake || !snake.game) return requestAnimationFrame(waitForSnake);
    console.log("%c✔ Snake engine detected", "color:#0ff;font-size:16px");
    startTestMods();
}
waitForSnake();

// ===============================
//  🔥 TEST MOD PACK
// ===============================
let settings = {
    infiniteLength:false,
    turboSpeed:false,
    appleFlood:false,
    rainbowSnake:false
};

// keybinds shown in console
console.log(`
===== TEST MOD KEYS =====
[1] Infinite Length
[2] Turbo Speed
[3] Apple Flood
[4] Rainbow Snake
=========================
`);

document.addEventListener("keydown", e=>{
    if(e.key==="1") toggle("infiniteLength");
    if(e.key==="2") toggle("turboSpeed");
    if(e.key==="3") toggle("appleFlood");
    if(e.key==="4") toggle("rainbowSnake");
});

function toggle(type){
    settings[type]=!settings[type];
    console.log(`%cToggled ${type}: ${settings[type]}`, "color:yellow");
}

// Main mod loop — modifies game each frame
function startTestMods(){
    const loop = setInterval(()=>{
        let g = snake.game;
        if(!g) return;

        // 1. Infinite length
        if(settings.infiniteLength) g.snakeLength+=5;

        // 2. Turbo Speed
        if(settings.turboSpeed) g.speed = 3.0;

        // 3. Apple Flood
        if(settings.appleFlood && g.appleCount < 10){
            g.appleCount += Math.floor(Math.random()*3)+1;
        }

        // 4. Rainbow snake
        if(settings.rainbowSnake){
            g.snakeColor = `hsl(${Math.random()*360},100%,50%)`;
        }
    },100);
}
