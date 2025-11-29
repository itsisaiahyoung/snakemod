// The object name MUST match the ID in the Tampermonkey script (CustomGitHubMod)
window.CustomGitHubMod = {
    
    // 1. Run BEFORE the game loads (Good for setting flags)
    runCodeBefore: function() {
        console.log("⏳ Custom Mod: Initializing...");
    },

    // 2. MODIFY the game engine text (The cleanest way to mod)
    // This function receives the game code as a string ('code') and must return the modified string.
    alterSnakeCode: function(code) {
        console.log("⚡ Custom Mod: Patching Engine...");

        // --- PATCH: IMMORTALITY ---
        // Replaces the death sound trigger with a console log
        // Regex looks for: xUD.vrc.play(),d(),AVD(a.Ea) or similar variations found in minified code
        // We replace "this.Aa.Ta+=1" (growth) and death triggers safely.
        
        // Growth Hack: Change +=1 to +=5
        // (Note: "this.Aa.Ta" is the standard growth variable in the current Google Snake version)
        if (code.includes("this.Aa.Ta+=1")) {
            code = code.replace(/this\.Aa\.Ta\+=1/g, "this.Aa.Ta+=5");
            console.log("✅ Growth Patch Applied");
        } else {
            console.log("❌ Growth Patch Failed (Variable name changed?)");
        }

        // Death Hack:
        // We look for the specific function call that plays the death sound and prevent the reset logic.
        // Matches: xUD.vrc.play(),d(),AVD(a.Ea)
        // We replace it with: (console.log('Immortal'),false)
        // This prevents the reset function 'd()' from running.
        const deathRegex = /xUD\.vrc\.play\(\),d\(\),AVD\(a\.Ea\)/;
        if (deathRegex.test(code)) {
            code = code.replace(deathRegex, '(console.log("🛡️ Death Prevented"),false)');
            console.log("✅ Immortality Patch Applied");
        } else {
             console.log("❌ Immortality Patch Failed (Regex mismatch)");
        }

        return code;
    },

    // 3. Run AFTER the game boots (Good for UI changes)
    runCodeAfter: function() {
        console.log("🚀 Custom Mod: Game Started!");
        
        // Example: Add a keyboard listener
        document.addEventListener('keydown', e => {
            if(e.key === 'b') {
                console.log("You pressed B inside the mod!");
                // You can access window.snake here usually
            }
        });
    }
};
