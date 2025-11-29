console.log("%c🐍 Custom Snake Test Mod Loaded", "color:#4f0;font-size:18px");

// =============== WAIT FOR GAME ===============
function hookWhenReady(){
    if (!window.snake || !snake.game) return requestAnimationFrame(hookWhenReady);
    console.log("%c✔ Snake Game Hooked", "color:#0ff;font-size:16px");
    initMod();
}
hookWhenReady();

// =============================================
// TEST SETTINGS STORAGE
let cfg = {
    infinite:false,
    turbo:false,
    rainbow:false
};

// =============== MAIN MOD LOGIC ===============
function initMod(){

    // UI inject when pause menu opens
    let observer = new MutationObserver(()=> {
        let menu = document.querySelector("div[role='presentation']"); // pause UI menu
        if(menu && !document.getElementById("modMenu")) buildUI(menu);
    });
    observer.observe(document.body,{childList:true,subtree:true});

    // main game hook
    setInterval(()=>{
        let g = snake.game;
        if(!g) return;

        if(cfg.infinite) g.snakeLength += 2;
        if(cfg.turbo) g.speed = 3.0;
        if(cfg.rainbow) g.snakeColor = `hsl(${(Date.now()/4)%360},100%,50%)`;

    },80);

    // keyboard controls work now
    document.addEventListener("keydown", e=>{
        if(e.key==="1") toggle("infinite");
        if(e.key==="2") toggle("turbo");
        if(e.key==="3") toggle("rainbow");
    });

    console.log("%cFeature keys loaded:", "color:yellow");
    console.log("[1] Infinite length");
    console.log("[2] Turbo");
    console.log("[3] Rainbow");
}

// =============== UI PANEL ====================
function buildUI(parent){
    let box = document.createElement("div");
    box.id="modMenu";
    box.style = `
        background:#111C; color:white; padding:10px;
        margin-top:10px; border-radius:8px; font-size:14px;
    `;

    box.innerHTML=`
        <b>🐍 CUSTOM MOD</b><br>
        <button data-set='infinite'>Infinite Length</button><br>
        <button data-set='turbo'>Turbo Speed</button><br>
        <button data-set='rainbow'>Rainbow Snake</button><br>
        <small>OR use keys 1 / 2 / 3</small>
    `;

    box.querySelectorAll("button").forEach(b=>{
        b.style.margin="4px"; b.style.padding="6px"; b.style.width="100%";
        b.onclick = ()=> toggle(b.dataset.set);
    });

    parent.appendChild(box);
}

// ============== TOGGLE FN ====================
function toggle(name){
    cfg[name] = !cfg[name];
    console.log(`%c${name} = ${cfg[name]}`, "color:#f80");
}
