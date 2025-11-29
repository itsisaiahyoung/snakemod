/* =================================================================
   🐍 FULL CUSTOM MOD (More Menu + Remote Kill Switch)
   =================================================================
   Upload this content to your GitHub file: mod-loader.js
*/

window.CustomGitHubMod = {

  // ===============================================================
  // 1. PRE-GAME SETUP (Images & Helpers)
  // ===============================================================
  runCodeBefore: () => {
    
    // --- REQUIRED HELPER FUNCTIONS ---
    // Improved to handle string literals correctly (Fixes your "Match not found" crash)
    String.prototype.assertReplace = function(search, replacement) {
      let s = this.toString();
      if (typeof search === 'string') {
        // Literal String Check
        if (s.indexOf(search) === -1) {
            let snippet = search.length > 50 ? search.substring(0, 50) + "..." : search;
            throw "Exact string match not found: " + snippet;
        }
      } else {
        // Regex Check
        if (!s.match(search)) throw "Regex match not found: " + search;
      }
      return s.replace(search, replacement);
    };

    String.prototype.assertReplaceAll = function(re, repl) {
      let s = this.toString();
      if (!s.match(re)) throw "Match not found: " + re;
      return s.replaceAll(re, repl);
    };

    // --- UI IMAGE LOADER ---
    window.uiImage = src => {
      let img = new Image();
      img.src = src;
      img.width = 40;
      img.height = 40;
      img.className = 'DqMRee SsAred';
      return img;
    };

    // --- INJECT CUSTOM MENU ICONS ---
    const sizeMenu = document.querySelector('#size');
    if(sizeMenu) {
        [
          'https://github.com/carlgustavh/GoogleSnakeCustomMenuStuffImages/blob/main/Micro.png?raw=true',
          'https://github.com/carlgustavh/GoogleSnakeCustomMenuStuffImages/blob/main/Tiny.png?raw=true',
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAABYElEQVRoQ+2Y2w7DIAxD1///6E2VRsUYJXZuFIm9AuHEMSzleC38OxZmf214oXrvZtxNMEugAtWL0QLX/JY9f3SwBGLgz31G81VHLwq+B1NXw7LvFdsSRKOkZs1tVTY8aNilbeNqmVOwTNssC+9umUzl3VXf8OC5WVb5EL9n2CYMPBPeciVPaw9CvF6ysSiCgIV9iFhtg7Q0oR8lFuUR+HrOKBGVEzLh3ROZBS99aUGWfhI8a0NTS0xv5r1ghvLIFQvl+SR4OikGvhec3XDU67CxKM+3wTVNF/JQBQsKT6xevMo1RislvJrR8Rj4E7r3L8nEmKZ8D54Br9ePHmfhmPDE792l8Xm59qS1qbbRJn63LhQ+w+9QT6NpQe9aWrQCroeVybL1q+TfUdfoclg18PXGjEelZJlYlzBoyaFGaTBJgpPGu6E3PFAWSVlp/NHKA/n/T8myjQpOWrThJYWixj+UTlgwJgIXFAAAAABJRU5ErkJggg==',
          'https://github.com/carlgustavh/GoogleSnakeCustomMenuStuffImages/blob/main/Super%20Big.png?raw=true',
          'https://github.com/carlgustavh/GoogleSnakeCustomMenuStuffImages/blob/main/Too%20Big.png?raw=true',
          'https://github.com/carlgustavh/GoogleSnakeCustomMenuStuffImages/blob/main/Humongous.png?raw=true',
          'https://github.com/carlgustavh/GoogleSnakeCustomMenuStuffImages/blob/main/Too%20Big.png?raw=true',
          'https://github.com/carlgustavh/GoogleSnakeCustomMenuStuffImages/blob/main/Way%20Too%20Big.png?raw=true'
        ].forEach(src => sizeMenu.appendChild(window.uiImage(src)));
    }

    const speedMenu = document.querySelector('#speed');
    if(speedMenu) {
        [
          'https://i.postimg.cc/bNYJfjyZ/Turtle-Bunny.png',
          'https://i.postimg.cc/GtdppWvS/Lightning.png',
          'https://i.postimg.cc/L43XWspd/Snail.png',
          'https://i.postimg.cc/brgwSmTY/Lightning-Snail.png',
          'https://i.postimg.cc/yN3xpXVn/Desert-Bus.png',
          'https://i.postimg.cc/dVLVDmTv/Bullet.png',
          'https://i.postimg.cc/4N83JFyB/Red-Bullet.png',
          'https://i.postimg.cc/MpNKBMyB/Purple-Bullet.png',
          'https://i.postimg.cc/qRdJmPDM/Blue-Bullet.png',
          'https://i.postimg.cc/fL4LGtys/Eternal.png',
          'https://i.postimg.cc/LXzX29g1/Fire-Bunny.png'
        ].forEach(src => speedMenu.appendChild(window.uiImage(src)));
    }

    const countMenu = document.querySelector('#count');
    if(countMenu) {
        [
          'https://i.postimg.cc/cJx1Lt2W/13-cr.png',
          'https://i.postimg.cc/HWq26Bdv/25.png',
          'https://i.postimg.cc/c4fc2wJx/40.png',
          'https://i.postimg.cc/50sStLRc/87.png',
          'https://i.postimg.cc/YCkxH041/Apple-Bomb.png',
          'https://i.postimg.cc/wMx20pWL/Nuke.png'
        ].forEach(src => countMenu.appendChild(window.uiImage(src)));
    }
  },


  // ===============================================================
  // 2. GAME ENGINE MODIFICATION (The Core Logic)
  // ===============================================================
  alterSnakeCode: code => {
    
    // --- PART A: MORE MENU LOGIC ---
    // Extracts key variables from the game engine
    const resetFunction = code.match(/reset\n?\(\n?\)\n?{\n?this\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?=\n?\[\];[^]*?pos\n?\)\n?}/)[0];
    const selectedAppleCount = resetFunction.match(/this\n?\.\n?settings\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?!==\n?0/)[0].replace(/!==\n?0/, '').replace(/\n/g, '');
    const applePlacementStem = resetFunction.match(/this\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\.\n?push\n?\(\n?[a-zA-Z0-9_$]{1,8}\n?\(\n?this\n?,/)[0];
    const appleArray = applePlacementStem.match(/this\n?\.\n?[a-zA-Z0-9_$]{1,8}/)[0];
    
    const checkBadMode = code.match(/[a-zA-Z0-9_$]{1,8}\n?=\n?function\n?\(a\)\n?{\n?return [a-zA-Z0-9_$]{1,8}\n?\(\n?a\n?,\n?2\n?\)\n?\|\|\n?[a-zA-Z0-9_$]{1,8}\n?\(a\n?,\n?8\n?\)\n?\|\|\n?[a-zA-Z0-9_$]{1,8}\n?\(\n?a\n?,\n?9\n?\)\n?\|\|\n?[a-zA-Z0-9_$]{1,8}\n?\(\n?a\n?,\n?10\n?\)\n?}/)[0].match(/[a-zA-Z0-9_$]{1,8}/)[0];
    const isModeSelected = code.match(/[a-zA-Z0-9_$]{1,8}\n?=\n?function\n?\(\n?a\n?,\n?b\n?\)\n?{\n?return a\.[a-zA-Z0-9_$]{1,8}\?a\.[a-zA-Z0-9_$]{1,8}\.has\(b\):[^]*?===\n?b\n?}/)[0].match(/[a-zA-Z0-9_$]{1,8}/)[0];

    // Modify Reset Function (Custom Apple Counts)
    // FIX: Using regex /if\s*\(\s*a\s*\)/ handles both "if(a)" and "if (a)" (spaces)
    code = code.assertReplace(resetFunction,
      resetFunction.assertReplace(/if\s*\(\s*a\s*\)/, `
        if(${selectedAppleCount} > 3) {
          if(!${checkBadMode}(this.settings)) {
             if(${selectedAppleCount} === 4) { ${applePlacementStem} +1, +2)) ${applePlacementStem} -1, +2)) ${applePlacementStem} -3, +2)) ${applePlacementStem} +0, +1)) ${applePlacementStem} -2, +1)) ${applePlacementStem} +1, +0)) ${applePlacementStem} -1, +0)) ${applePlacementStem} -3, +0)) ${applePlacementStem} +0, -1)) ${applePlacementStem} -2, -1)) ${applePlacementStem} +1, -2)) ${applePlacementStem} -1, -2)) ${applePlacementStem} -3, -2)) }
             else if(${selectedAppleCount} === 5) { ${applePlacementStem} +1, +2)) ${applePlacementStem} +0, +2)) ${applePlacementStem} -1, +2)) ${applePlacementStem} -2, +2)) ${applePlacementStem} -3, +2)) ${applePlacementStem} +1, +1)) ${applePlacementStem} +0, +1)) ${applePlacementStem} -1, +1)) ${applePlacementStem} -2, +1)) ${applePlacementStem} -3, +1)) ${applePlacementStem} +1, +0)) ${applePlacementStem} +0, +0)) ${applePlacementStem} -1, +0)) ${applePlacementStem} -2, +0)) ${applePlacementStem} -3, +0)) ${applePlacementStem} +1, -1)) ${applePlacementStem} +0, -1)) ${applePlacementStem} -1, -1)) ${applePlacementStem} -2, -1)) ${applePlacementStem} -3, -1)) ${applePlacementStem} +1, -2)) ${applePlacementStem} +0, -2)) ${applePlacementStem} -1, -2)) ${applePlacementStem} -2, -2)) ${applePlacementStem} -3, -2)) }
             else if(${selectedAppleCount} === 6) { ${applePlacementStem} +1, +2)) ${applePlacementStem} +0, +2)) ${applePlacementStem} -1, +2)) ${applePlacementStem} -2, +2)) ${applePlacementStem} -3, +2)) ${applePlacementStem} +1, +1)) ${applePlacementStem} +0, +1)) ${applePlacementStem} -1, +1)) ${applePlacementStem} -2, +1)) ${applePlacementStem} -3, +1)) ${applePlacementStem} +1, +0)) ${applePlacementStem} +0, +0)) ${applePlacementStem} -1, +0)) ${applePlacementStem} -2, +0)) ${applePlacementStem} -3, +0)) ${applePlacementStem} +1, -1)) ${applePlacementStem} +0, -1)) ${applePlacementStem} -1, -1)) ${applePlacementStem} -2, -1)) ${applePlacementStem} -3, -1)) ${applePlacementStem} +1, -2)) ${applePlacementStem} +0, -2)) ${applePlacementStem} -1, -2)) ${applePlacementStem} -2, -2)) ${applePlacementStem} -3, -2)) ${applePlacementStem} -3, -3)) ${applePlacementStem} -2, -3)) ${applePlacementStem} -1, -3)) ${applePlacementStem} +0, -3)) ${applePlacementStem} +1, -3)) ${applePlacementStem} +2, -2)) ${applePlacementStem} +2, -1)) ${applePlacementStem} +2, +0)) ${applePlacementStem} +2, +1)) ${applePlacementStem} +2, +2)) ${applePlacementStem} +1, +3)) ${applePlacementStem} +0, +3)) ${applePlacementStem} -1, +3)) ${applePlacementStem} -2, +3)) ${applePlacementStem} -3, +3)) }
             else if(${selectedAppleCount} === 7) { for(let dy = -4; dy <= 4; dy++) for(let dx = -7; dx <= 2; dx++) ${applePlacementStem} dx, dy)) }
             else if(${selectedAppleCount} === 8) { for(let i = 0; i < 200; i++) ${applePlacementStem} -1, +0)) }
             else if(${selectedAppleCount} === 9) { for(let i = 0; i < 10000; i++) ${applePlacementStem} -1, +0)) }
             else ${applePlacementStem} +100000, +1))
          } else {
             if(${selectedAppleCount} < 9) {
                const count = (${selectedAppleCount}===4?13:${selectedAppleCount}===5?25:${selectedAppleCount}===6?40:${selectedAppleCount}===7?87:${selectedAppleCount}===8?200:0);
                for(let dx = 0; dx < count; dx++) for(const dy of [-4, 4]) ${applePlacementStem} -count + dx, dy))
             } else { for(let i = 0; i < 20000; i++) ${applePlacementStem} +0, +0)) }
          }
        } else if(a)`
      ).assertReplace(/pos\s*\)\s*\}/, `pos)
          if(${isModeSelected}(this.settings, 2) && ${selectedAppleCount} > 4) {
            for(let __i___ = 0; __i___ < ${appleArray}.length; __i___ += 2) {
              ${appleArray}[__i___].type = ${appleArray}[__i___ + 1].type = Math.floor(Math.random() * 24)
            }
          }
        }`)
    );

    // Speed Logic
    const tileLengthSetLine = code.match(/this\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?=\n?\(\n?d\n?\.\n?isMobile\n?\?\n?175\n?:\n?135\n?\)\n?\*\n?a\n?;/)[0];
    const selectedSpeed = code.match(/switch\n?\(\n?d\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\)\n?{\n?case(\n? \n?|\n)1\n?:\n?a\n?=\n?\.66/)[0].match(/d\n?\.\n?[a-zA-Z0-9_$]{1,8}/)[0].replace('d', 'this.settings');
    const tickFunction = code.match(/tick\n?\(\n?\)\n?{\n?[^]*?this\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\.\n?keys\n?,\n?this\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\)\n?}\n?}\n?}\n?}/)[0];
    const replacePoint = tickFunction.match(/\.5\n?:\n?1\.25\n?\);\n?this\n?\.\n?[a-zA-Z0-9_$]{1,8}\+\+;/)[0];

    window.bunnyTurtleSpeed = 1.33;
    window.lightningSnailSpeed = 1.85;

    // --- PART B: KILL SWITCH HOOK INJECTION ---
    const killSwitchLogic = `
        window.snake = this; // Expose snake object to window
        if(window.killSnakeCommand) {
            this.gameOver();
            window.killSnakeCommand = false;
        }
    `;

    // Inject Kill Switch & Speed Logic into Tick Function
    code = code.assertReplace(tickFunction,
      tickFunction.replaceAll('&&', ' && ')
      .replace(replacePoint, replacePoint + `
          ${killSwitchLogic}
          window.bunnyTurtleSpeed = Math.random() < .5 ? .66 : 1.33
          window.lightningSnailSpeed = Math.random() < .5 ? .45 : 1.85
          let speedMultiplier
          switch(${selectedSpeed}) {
            case 1: speedMultiplier = .66; break;
            case 2: speedMultiplier = 1.33; break;
            case 3: speedMultiplier = window.bunnyTurtleSpeed; break;
            case 4: speedMultiplier = .45; break;
            case 5: speedMultiplier = 1.85; break;
            case 6: speedMultiplier = window.lightningSnailSpeed; break;
            case 7: speedMultiplier = 18.5; break;
            case 8: speedMultiplier = .35; break;
            case 9: speedMultiplier = .25; break;
            case 10: speedMultiplier = .15; break;
            case 11: speedMultiplier = .05; break;
            case 12: speedMultiplier = 26640; break;
            case 13: speedMultiplier = .00001; break;
            default: speedMultiplier = 1; break;
          }
          ${tileLengthSetLine.replace(/\*\n?a/, '* speedMultiplier').replace('d.isMobile', 'this.settings.isMobile')}
      `)
    );

    // Clean up reset function speeds
    const resetFunction1 = code.match(/reset\n?\(\n?\)\n?{\n?this\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?=\n?null[^]*?\.66[^]*?!0\n?\)\n?\)\n?}/)[0];
    code = code.assertReplace(resetFunction1,
      resetFunction1.assertReplace(/{case 1:a=\.66[^}]*?1}/, `{
          case 1: a = .66; break a;
          case 2: a = 1.33; break a;
          case 3: a = window.bunnyTurtleSpeed; break a;
          case 4: a = .45; break a;
          case 5: a = 1.85; break a;
          case 6: a = window.lightningSnailSpeed; break a;
          case 7: a = 18.5; break a;
          case 8: a = .35; break a;
          case 9: a = .25; break a;
          case 10: a = .15; break a;
          case 11: a = .05; break a;
          case 12: a = 26640; break a;
          case 13: a = .00001; break a;
          default: a = 1; break a;
        }`)
    );

    // Speed Icon Fix
    const speedIconFunction = code.match(/[a-zA-Z0-9_$]{1,8}\n?=\n?function\n?\(a\)\n?{\n?var b\n?=\n?a\n?\.\n?settings\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?===\n?1\n?;\n?a\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\.\n?clearRect\n?\(\n?0\n?,\n?0\n?,\n?[^]*?\n?0\n?\)\n?,\n?0\n?,\n?c\n?,\n?a\n?\.\n?settings\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\)\n?}\n?}\n?}\n?}/)[0];
    const canvWidth = speedIconFunction.match(/const c\n?=\n?a\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\.\n?width/)[0].assertReplace(/const c\n?=/, '');
    const canv = speedIconFunction.match(/a\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\.\n?render/g)[1].assertReplace(/.\n?render/, '');
    const selectedSpeed1 = speedIconFunction.match(/a\n?\.\n?settings\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?===\n?1/g)[1].assertReplace(/\n?===\n?1/, '');
    code = code.assertReplace(speedIconFunction, speedIconFunction.assertReplace('&&', '?').assertReplace(/\)\n?\)\n?;/, `)) : ${selectedSpeed1} !== 0 && (${canv}.context.drawImage(document.querySelector('#speed').children[${selectedSpeed1}], ${canvWidth} - 80, d.y - 80, 80, 80));`));

    // Board Size Logic
    const sizeHandleFunction = code.match(/[a-zA-Z0-9_$]{1,8}\n?\(\n?\)\n?{\n?var(\n|\n? \n?)a\n?=\n?this\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\("JI3Aqc[^]*?this\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\)\n?}\n?}/)[0];
    const selectedSize = sizeHandleFunction.match(/switch\n?\(\n?this\n?\.\n?settings\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\)\n?{\n?case 2\n?:/)[0].match(/this\n?\.\n?settings\n?\.\n?[a-zA-Z0-9_$]{1,8}/)[0];
    const sizeHold = sizeHandleFunction.match(/[a-zA-Z0-9_$]\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?=\n?new(\n? \n?|\n)_\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\(\n?Math\n?\.\n?floor\n?\(\n?[a-zA-Z0-9_$]\n?\/\n?[a-zA-Z0-9_$]\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\)\n?,\n?Math\n?\.\n?floor\n?\(\n?[a-zA-Z0-9_$]\n?\/\n?[a-zA-Z0-9_$]\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\)\n?\)\n?[^]*?;/)[0];
    const sizeHolder = sizeHold.match(/[a-zA-Z0-9_$]\n?\.\n?[a-zA-Z0-9_$]{1,8}/)[0];
    const dim = sizeHold.match(/[a-zA-Z0-9_$]\n?\/\n?[a-zA-Z0-9_$]\n?\.\n?[a-zA-Z0-9_$]{1,8}/)[0].replace(/[a-zA-Z0-9_$]\n?\//, '');
    const e = sizeHandleFunction.match(/[a-zA-Z0-9_$]\n?=\n?512/)[0][0];

    code = code.assertReplace(sizeHandleFunction, sizeHandleFunction
      .assertReplace(`Math.floor(Math.sqrt(${e}))`, `Math.max(1, Math.floor(Math.sqrt(${e})))`)
      .assertReplace(/new(\n|\n? \n?)_\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\(\n?Math\n?\.\n?floor[^]*?\)\n?\)/, `
        {
          width:  ${selectedSize} === 3 ? 5 : ${selectedSize} === 4 ? 7 : ${selectedSize} === 5 ? 12 : Math.floor(a / ${dim}),
          height: ${selectedSize} === 3 ? 4 : ${selectedSize} === 4 ? 6 : ${selectedSize} === 5 ? 11 : Math.floor(c / ${dim})
        }`)
      .assertReplace(`default:${e}=256}`, `
        case 3: ${e} = 20; break;
        case 4: ${e} = 42; break;
        case 5: ${e} = 132; break;
        case 6: ${e} = 1200; break;
        case 7: ${e} = 3600; break;
        case 8: ${e} = 9700; break;
        case 9: ${e} = 25000; break;
        case 10: ${e} = 318000; break;
        default: ${e} = 256; }`)
      .assertReplace(/21\n?\)\n?}/, `
          21) break;
        case 3: ${sizeHolder} = { width: 5, height: 4 }; break;
        case 4: ${sizeHolder} = { width: 7, height: 6 }; break;
        case 5: ${sizeHolder} = { width: 12, height: 11 }; break;
        case 6: ${sizeHolder} = { width: 37, height: 32 }; break;
        case 7: ${sizeHolder} = { width: 64, height: 56 }; break;
        case 8: ${sizeHolder} = { width: 105, height: 92 }; break;
        case 9: ${sizeHolder} = { width: 168, height: 147 }; break;
        case 10: ${sizeHolder} = { width: 600, height: 530 }; break;
        }
        if(this.settings.isMobile && [3, 4, 5].includes(${selectedSize})) {
          let squareSize = a / ${sizeHolder}.width
          if(squareSize * ${sizeHolder}.height > c) squareSize = c / ${sizeHolder}.height
          squareSize *= .98
          if(squareSize > 1) squareSize = ~~squareSize
          ${dim} = squareSize
          if(window.innerWidth / window.innerHeight < .55) {
            squareSize *= window.innerWidth / window.innerHeight * 1.75
            if(squareSize > 1) squareSize = ~~squareSize
            ${dim} = squareSize
          }
        }`)
    );

    // Menu Update & Pixel Fixes
    const menuUpdateFunction = code.match(/[a-zA-Z0-9_$]{1,8}\n?\(\n?\)\n?{\n?if\n?\(\n?[a-zA-Z0-9_$]{1,8}\n?\(\n?this\n?\)\n?\)\n?[^]*?"thso6e"\n?\)\n?}\n?}/)[0];
    const selectedAppleCount1 = `([...document.querySelector('#count').children].indexOf(document.querySelector('#count').getElementsByClassName('tuJOWd')[0]))`;
    code = code.assertReplace(menuUpdateFunction, menuUpdateFunction.assertReplace('}}', `}
          const appleCountDisplay = document.body.getElementsByClassName('UJhXPd wSwbef EWyEF')[0]
          for(let i = 2; i < appleCountDisplay.children.length; i++) { appleCountDisplay.removeChild(appleCountDisplay.children[i]) }
          if(${selectedAppleCount1} > 2) {
            const __src = document.querySelector('#count').children[${selectedAppleCount1}].src
            const __img = window.uiImage(__src)
            __img.style.position = 'relative'
            __img.style.left = '50px'
            appleCountDisplay.appendChild(__img)
          }
        } `));

    const pixelIssueFunction = code.match(/[a-zA-Z0-9_$]{1,8}\n?=\n?function\n?\(\n?a\n?\)\n?{\n?var(\n| )b\n?=\n?a\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?;\n?if[^]*?9\n?\)\n?}\n?}/)[0];
    const pixelIssueB = pixelIssueFunction.match(/var(\n| )b\n?=\n?a\n?\.\n?[a-zA-Z0-9_$]{1,8}/)[0].replace(/var(\n| )b\n?=\n?/, '');
    const boardDimensions = pixelIssueFunction.match(/b\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\.\n?height/)[0].replace('b', pixelIssueB).replace(/\n?\.\n?height/, '');
    const boardThing = pixelIssueFunction.match(/b\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\.\n?[a-zA-Z0-9_$]{1,8}\n?\[\n?d\n?\.\n?y\n?\]\n?\[\n?d\n?\.\n?x\n?\]/)[0].replace(/\n?\[\n?d\n?\.\n?y\n?\]\n?\[\n?d\n?\.\n?x\n?\]/, '');
    code = code.assertReplaceAll(RegExp(`${boardThing}\\n?\\[\\n?c\\n?\\.\\n?y\\n?\\]\\n?\\[\\n?c\\n?\\.\\n?x\\n?\\]\\n?=\\n?e`, 'g'), `c.y >= 0 && c.y < ${boardDimensions}.height && c.x >= 0 && c.x < ${boardDimensions}.width && (${boardThing}[c.y][c.x] = e)`);

    // RNG Replacement
    code = code.assertReplace(/switch\n?\(\n?Math\n?\.\n?floor\n?\(\n?Math\n?\.\n?random\n?\(\n?\)\n?\*\n?4\n?\)\n?\)\n?{\n?default\n?:\n?case[^}]*?}/, 'h = Math.floor(10 * Math.random());')
      .assertReplace(/f\n?=\n?Math\n?\.\n?random\n?\(\n?\)\n?<\n?\.25\n?\?\n?Math\n?\.\n?random\n?\(\n?\)\n?<\n?\.25\n?\?\n?2\n?:\n?1\n?:\n?0/, 'f = Math.floor(14 * Math.random())')
      .assertReplace(/g\n?=\n?Math\n?\.\n?random\n?\(\n?\)\n?<\n?\.25\n?\?\n?Math\n?\.\n?random\n?\(\n?\)\n?<\n?\.25\n?\?\n?2\n?:\n?1\n?:\n?0/, 'g = Math.floor(11 * Math.random())');

    const appleTypeChosen = code.match(/for\n?\(\n?a\n?=\n?a\n?\.\n?settings\n?\.\n?[a-zA-Z0-9_$]{1,8}/)[0].match(/a\n?\.\n?settings\n?\.\n?[a-zA-Z0-9_$]{1,8}/)[0];
    code = code.assertReplace(RegExp(`for\\n?\\(\\n?a\\n?=\\n?${appleTypeChosen}\\n?;\\n?c\\.has\\n?\\(\\n?a\\n?\\)\\n?;\\n?\\)`), `for(a = ${appleTypeChosen}, __i = 0; c.has(a) && __i < 24; __i++)`);

    return code;
  },


  // ===============================================================
  // 3. POST-BOOT (Visuals & Polling Loop)
  // ===============================================================
  runCodeAfter: () => {
    // 1. Visual Indicator
    const modIndicator = document.createElement('div');
    modIndicator.style = 'position:absolute;font-family:Roboto,Arial,sans-serif;color:white;font-size:14px;padding-top:4px;padding-left:30px;user-select: none;pointer-events:none;';
    modIndicator.textContent = '📡 Remote Kill Active';
    const canvasNode = document.getElementsByClassName('jNB0Ic')[0];
    if(document.getElementsByClassName('EjCLSb')[0]) {
        document.getElementsByClassName('EjCLSb')[0].insertBefore(modIndicator, canvasNode);
    }

    // 2. REMOTE POLLING LOOP
    // ⚠️ IMPORTANT: Replace this with your actual Ngrok HTTPS URL ⚠️
    const CONTROLLER_URL = 'https://YOUR-ID-HERE.ngrok-free.app'; 

    console.log(`📡 Connecting to Remote Controller: ${CONTROLLER_URL}`);

    setInterval(async () => {
        try {
            const response = await fetch(`${CONTROLLER_URL}/status`);
            const text = await response.text();

            if (text.includes("KILL")) {
                console.log("☠️ KILL SIGNAL RECEIVED!");
                if(window.snake) {
                    window.snake.gameOver();
                }
                // Fallback method
                window.killSnakeCommand = true;
            }
        } catch (e) {
            // Ignore connection errors
        }
    }, 1000); // Check every 1 second
  }
};
