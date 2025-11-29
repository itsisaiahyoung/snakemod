console.log("%c🐍 Custom Snake Mod Loaded", "color:#4f0;font-size:20px");

function wait(){
    if(!window.snake?.game) return requestAnimationFrame(wait);
    console.log("%c✔ Hooked Into Game", "color:#0ff;font-size:15px");
    initMod();
}
wait();

let cfg = { infinite:false, turbo:false, rainbow:false };

function initMod(){

    // UI inject into pause menu
    new MutationObserver(()=>{
        let menu=document.querySelector("div[role='presentation']");
        if(menu && !document.getElementById("modMenu")) buildUI(menu);
    }).observe(document.body,{childList:true,subtree:true});

    setInterval(()=>{
        let g=snake.game; if(!g) return;
        if(cfg.infinite) g.snakeLength+=1;
        if(cfg.turbo) g.speed=2.5;
        if(cfg.rainbow) g.snakeColor=`hsl(${(Date.now()/4)%360},100%,50%)`;
    },70);

    // keys
    document.addEventListener("keydown",e=>{
        if(e.key=="1") toggle("infinite");
        if(e.key=="2") toggle("turbo");
        if(e.key=="3") toggle("rainbow");
    });

    console.log("Keys Active → 1=infinite | 2=turbo | 3=rainbow");
}

function toggle(n){
    cfg[n]=!cfg[n];
    console.log(`%c${n} → ${cfg[n]}`, "color:#ffa500");
}

function buildUI(menu){
    let box=document.createElement("div");
    box.id="modMenu";
    box.style=`background:#111c;padding:10px;margin-top:10px;color:white;border-radius:8px`;

    box.innerHTML=`
    <b>🐍 CUSTOM MOD</b><br>
    <button data="infinite">Infinite Growth</button>
    <button data="turbo">Turbo Speed</button>
    <button data="rainbow">Rainbow Snake</button>
    <br><small>Hotkeys → 1 / 2 / 3</small>
    `;

    box.querySelectorAll("button").forEach(b=>{
        b.style.cssText="margin:4px;padding:6px;width:100%";
        b.onclick=()=>toggle(b.getAttribute("data"));
    });

    menu.appendChild(box);
}
