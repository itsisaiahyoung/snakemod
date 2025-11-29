/*
==========================================================
🔥 Google Snake Custom Mod
✦ Fully loader-compatible
✦ Designed for googlemods.com/v/current/
✦ Safe to run — doesn’t replace engine, hooks instead
==========================================================
*/

console.log("%c🐍 Custom Snake Mod Loaded!", "color:#0f0;font-size:18px;font-weight:bold");

// Wait until the real game engine is active
const waitForSnake = setInterval(() => {
    try {
        // check that game is running & player exists
        if (window.snake && snake.snakeLength !== undefined) {

            clearInterval(waitForSnake);
            console.log("%c✔ Snake Engine Found — Mod Activating", "color:#0ff;font-size:16px");

            // =====================================================
            // 🔥 HERE IS YOUR MOD (you can edit this part!)
            // =====================================================

            // example: give permanent infinite length growth
            const grow = snake.grow;
            snake.grow = function(x) {
                return grow.apply(this, [x + 9999]);  // +9999 every apple
            };

            // example: speed boost toggle (press B)
            document.addEventListener("keydown", e => {
                if (e.key.toLowerCase() === "b") {
                    snake.speed = snake.speed === 10 ? 1 : 10;
                    console.log("⚡ Speed toggled:", snake.speed);
                }
            });

            console.log("%c🔥 Custom Mod Active", "color:#ff0;font-size:18px");
        }

    } catch(e) {
        console.error("Mod init error →", e);
    }
}, 200);
