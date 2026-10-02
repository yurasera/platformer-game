import buatLevel1 from "./levels/level1.js";
import buatLevel2 from "./levels/level2.js";


/* =============================================================
           SKY JUMPER
           -------------------------------------------------------------
           PLATFORMER GAME UNTUK BELAJAR JAVASCRIPT
        
           Konsep:
        
           1. Variable
           2. Object
           3. Array
           4. Function
           5. Event
           6. if / else
           7. Random
           8. Gravity
           9. Jump
           10. Collision Detection
           11. Game Loop
           12. Camera
           13. Timer
           14. Game State
           15. Local Storage
           ============================================================= */



/* =============================================================
   1. HTML ELEMENTS
   ============================================================= */

const worldWrapper =
    document.getElementById(
        "worldWrapper"
    );


const world =
    document.getElementById(
        "world"
    );


const player =
    document.getElementById(
        "player"
    );


const layarMulai =
    document.getElementById(
        "layarMulai"
    );


const layarGame =
    document.getElementById(
        "layarGame"
    );


const layarHasil =
    document.getElementById(
        "layarHasil"
    );


const gameMessage =
    document.getElementById(
        "gameMessage"
    );


const messageIcon =
    document.getElementById(
        "messageIcon"
    );


const messageTitle =
    document.getElementById(
        "messageTitle"
    );


const messageText =
    document.getElementById(
        "messageText"
    );


const messageButton =
    document.getElementById(
        "messageButton"
    );


const replayLevelButton =
    document.getElementById(
        "replayLevelButton"
    );


/*
   Input nama dari HTML.
*/

const inputNama =
    document.getElementById(
        "inputNama"
    );



/* =============================================================
   2. GAME STATE
   ============================================================= */

let state = {

    nama: "Player",

    skor: 0,

    lives: 3,

    level: 1,

    waktu: 60,

    stars: 0,

    diamonds: 0,

    sedangMain: false

};



/* =============================================================
   3. PLAYER PHYSICS
   ============================================================= */

let playerData = {

    x: 80,

    y: 500,

    width: 52,

    height: 52,

    velocityX: 0,

    velocityY: 0,

    speed: 5,

    jumpPower: 13,

    gravity: 0.6,

    onGround: false

};



/* =============================================================
   4. WORLD
   ============================================================= */

const WORLD_WIDTH =
    2200;


const WORLD_HEIGHT =
    1000;


let cameraX = 0;

let cameraY = 0;



/* =============================================================
   5. KEYBOARD
   ============================================================= */

let keys = {};


document.addEventListener(
    "keydown",
    function (event) {

        keys[
            event.key.toLowerCase()
        ] = true;


        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            lompat();

        }

    }
);


document.addEventListener(
    "keyup",
    function (event) {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);



/* =============================================================
   6. GAME OBJECTS
   ============================================================= */

let platforms = [];

let collectibles = [];

let enemies = [];

let goal = null;



/* =============================================================
   7. GAME LOOP
   ============================================================= */

let gameLoopId = null;

let timerId = null;



/* =============================================================
   8. HIGH SCORE
   ============================================================= */

let bestScore =
    Number(
        localStorage.getItem(
            "skyJumperBestScore"
        )
    ) || 0;



function posisiVertikal(y) {

    const mobileOffset =
        window.matchMedia(
            "(max-width: 600px)"
        ).matches ? 60 : 0;


    return y - mobileOffset;

}



/* =============================================================
   9. START GAME
   ============================================================= */

function mulaiGame() {

    /*
       Ambil nama dari input HTML.
    */

    const nama =
        inputNama.value.trim();


    /*
       Jika nama kosong,
       jangan mulai game.
    */

    if (
        nama === ""
    ) {

        inputNama.focus();

        inputNama.style.borderColor =
            "var(--wrong)";

        return;

    }


    /*
       Simpan nama pemain.
    */

    state.nama =
        nama;


    /*
       Reset warna input.
    */

    inputNama.style.borderColor =
        "var(--panel-soft)";


    /*
       Reset state.
    */

    state.skor = 0;

    state.lives = 3;

    state.level = 1;

    state.waktu = 60;

    state.stars = 0;

    state.diamonds = 0;

    /*
       Reset player.
    */

    mulaiLevel();

}



function mulaiLevel() {

    state.sedangMain = true;


    playerData.x = 80;

    playerData.y =
        posisiVertikal(
            state.level === 2 ? 448 : 500
        );

    playerData.velocityX = 0;

    playerData.velocityY = 0;


    cameraX = 0;

    cameraY = 0;


    bersihkanWorld();

    buatLevel();

    updateUI();


    layarMulai.classList.remove(
        "aktif"
    );

    layarHasil.classList.remove(
        "aktif"
    );

    layarGame.classList.add(
        "aktif"
    );


    gameMessage.style.display =
        "none";


    cancelAnimationFrame(
        gameLoopId
    );

    gameLoopId =
        requestAnimationFrame(
            gameLoop
        );


    clearInterval(timerId);

    timerId =
        setInterval(
            updateTimer,
            1000
        );

}



function lanjutLevelDua() {

    state.level = 2;

    state.waktu = 60;

    mulaiLevel();

}



function ulangiLevelPertama() {

    inputNama.value =
        state.nama;


    mulaiGame();

}



/* =============================================================
   10. CREATE LEVEL
   ============================================================= */

function buatLevel() {

    const levelBuilders = {
        1: buatLevel1,
        2: buatLevel2
    };


    const buildLevel =
        levelBuilders[state.level];


    if (!buildLevel) {
        throw new Error(
            `Level ${state.level} belum tersedia.`
        );
    }


    buildLevel({
        ground: buatGround,
        platform: buatPlatform,
        collectible: buatCollectible,
        enemy: buatEnemy,
        goal: buatGoal,
        decoration: buatDecoration
    });

}



/* =============================================================
   11. CREATE GROUND
   ============================================================= */

function buatGround(
    x,
    y,
    width
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "ground";


    element.style.left =
        x + "px";


    element.style.top =
        y + "px";


    element.style.width =
        width + "px";


    world.appendChild(
        element
    );


    platforms.push({

        x: x,

        y: y,

        width: width,

        height: 70

    });

}



/* =============================================================
   12. CREATE PLATFORM
   ============================================================= */

function buatPlatform(
    x,
    y,
    width
) {

    const platformY =
        posisiVertikal(y);


    const element =
        document.createElement(
            "div"
        );


    element.className =
        "platform";


    element.style.left =
        x + "px";


    element.style.top =
        platformY + "px";


    element.style.width =
        width + "px";


    const tileCount =
        Math.ceil(width / 32);


    for (
        let index = 0;
        index < tileCount;
        index++
    ) {

        const tile =
            document.createElement(
                "div"
            );


        tile.className =
            "platform-tile";


        element.appendChild(
            tile
        );

    }


    world.appendChild(
        element
    );


    platforms.push({

        x: x,

        y: platformY,

        width: width,

        height: 24

    });

}



/* =============================================================
   13. CREATE COLLECTIBLE
   ============================================================= */

function buatCollectible(
    type,
    x,
    y
) {

    const collectibleY =
        posisiVertikal(y);


    const element =
        document.createElement(
            "div"
        );


    element.className =
        "collectible";


    if (
        type === "star"
    ) {

        element.textContent =
            "⭐";

        element.classList.add(
            "star"
        );

    }


    if (
        type === "diamond"
    ) {

        element.textContent =
            "💎";

        element.classList.add(
            "diamond"
        );

    }


    element.style.left =
        x + "px";


    element.style.top =
        collectibleY + "px";


    world.appendChild(
        element
    );


    collectibles.push({

        type: type,

        x: x,

        y: collectibleY,

        width: 38,

        height: 38,

        element: element

    });

}



/* =============================================================
   14. CREATE ENEMY
   ============================================================= */

function buatEnemy(
    x,
    y
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "enemy";


    element.textContent =
        "👾";


    element.style.left =
        x + "px";


    element.style.top =
        y + "px";


    world.appendChild(
        element
    );


    enemies.push({

        x: x,

        y: y,

        width: 42,

        height: 42,

        speed: 1.2,

        direction: 1,

        element: element

    });

}



/* =============================================================
   15. CREATE GOAL
   ============================================================= */

function buatGoal(
    x,
    y
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "goal";


    element.textContent =
        "🏆";


    element.style.left =
        x + "px";


    element.style.top =
        y + "px";


    world.appendChild(
        element
    );


    goal = {

        x: x,

        y: y,

        width: 60,

        height: 75,

        element: element

    };

}



/* =============================================================
   16. DECORATION
   ============================================================= */

function buatDecoration() {

    for (
        let i = 0;
        i < 50;
        i++
    ) {

        const star =
            document.createElement(
                "div"
            );


        star.className =
            "sky-star";


        star.style.left =
            randomNumber(
                0,
                WORLD_WIDTH
            ) + "px";


        star.style.top =
            randomNumber(
                20,
                500
            ) + "px";


        world.appendChild(
            star
        );

    }


    const cloudPositions = [

        [150, 100],

        [650, 160],

        [1100, 90],

        [1600, 130],

        [1950, 80]

    ];


    cloudPositions.forEach(
        function (position) {

            const cloud =
                document.createElement(
                    "div"
                );


            cloud.className =
                "cloud";


            cloud.textContent =
                "☁️";


            cloud.style.left =
                position[0] + "px";


            cloud.style.top =
                position[1] + "px";


            world.appendChild(
                cloud
            );

        }
    );

}



/* =============================================================
   17. GAME LOOP
   ============================================================= */

function gameLoop() {

    if (
        !state.sedangMain
    ) {

        return;

    }


    updatePlayer();

    applyGravity();

    updateEnemies();

    checkPlatformCollision();

    checkCollectibles();

    checkEnemyCollision();

    checkGoal();

    updateCamera();


    gameLoopId =
        requestAnimationFrame(
            gameLoop
        );

}



/* =============================================================
   18. PLAYER MOVEMENT
   ============================================================= */

function updatePlayer() {

    playerData.velocityX = 0;


    if (
        keys["arrowleft"] ||
        keys["a"]
    ) {

        playerData.velocityX =
            -playerData.speed;

    }


    if (
        keys["arrowright"] ||
        keys["d"]
    ) {

        playerData.velocityX =
            playerData.speed;

    }


    playerData.x +=
        playerData.velocityX;


    if (
        playerData.x < 0
    ) {

        playerData.x = 0;

    }


    if (
        playerData.x >
        WORLD_WIDTH -
        playerData.width
    ) {

        playerData.x =
            WORLD_WIDTH -
            playerData.width;

    }


    player.style.left =
        playerData.x + "px";


    player.style.top =
        playerData.y + "px";

}



/* =============================================================
   19. GRAVITY
   ============================================================= */

function applyGravity() {

    playerData.velocityY +=
        playerData.gravity;


    playerData.y +=
        playerData.velocityY;


    if (
        playerData.y >
        WORLD_HEIGHT
    ) {

        kehilanganNyawa();

    }

}



/* =============================================================
   20. JUMP
   ============================================================= */

function lompat() {

    if (
        playerData.onGround &&
        state.sedangMain
    ) {

        playerData.velocityY =
            -playerData.jumpPower;

        playerData.onGround =
            false;

    }

}



/* =============================================================
   21. PLATFORM COLLISION
   ============================================================= */

function checkPlatformCollision() {

    playerData.onGround =
        false;


    platforms.forEach(
        function (platform) {

            const playerBottom =
                playerData.y +
                playerData.height;


            const playerLeft =
                playerData.x;


            const playerRight =
                playerData.x +
                playerData.width;


            const horizontalCollision =

                playerRight >
                platform.x &&

                playerLeft <
                platform.x +
                platform.width;


            const falling =

                playerData.velocityY >= 0;


            const verticalCollision =

                playerBottom >=
                platform.y &&

                playerBottom <=
                platform.y +
                platform.height +
                10;


            if (
                horizontalCollision &&
                verticalCollision &&
                falling
            ) {

                playerData.y =
                    platform.y -
                    playerData.height;


                playerData.velocityY =
                    0;


                playerData.onGround =
                    true;

            }

        }
    );

}



/* =============================================================
   22. ENEMY MOVEMENT
   ============================================================= */

function updateEnemies() {

    enemies.forEach(
        function (enemy) {

            enemy.x +=
                enemy.speed *
                enemy.direction;


            if (
                enemy.x < 650
            ) {

                enemy.direction =
                    1;

            }


            if (
                enemy.x > 1900
            ) {

                enemy.direction =
                    -1;

            }


            enemy.element.style.left =
                enemy.x + "px";

        }
    );

}



/* =============================================================
   23. COLLECTIBLE COLLISION
   ============================================================= */

function checkCollectibles() {

    collectibles.forEach(
        function (item) {

            if (
                !item.element.parentElement
            ) {

                return;

            }


            if (
                rectanglesOverlap(
                    playerData.x,
                    playerData.y,
                    playerData.width,
                    playerData.height,

                    item.x,
                    item.y,
                    item.width,
                    item.height
                )
            ) {

                collectItem(
                    item
                );

            }

        }
    );

}



/* =============================================================
   24. COLLECT ITEM
   ============================================================= */

function collectItem(
    item
) {

    if (
        item.type === "star"
    ) {

        state.skor += 10;

        state.stars++;

        showPopup(
            item.x,
            item.y,
            "+10 ⭐"
        );

    }


    if (
        item.type === "diamond"
    ) {

        state.skor += 25;

        state.diamonds++;

        showPopup(
            item.x,
            item.y,
            "+25 💎"
        );

    }


    createParticles(
        item.x,
        item.y
    );


    item.element.remove();


    collectibles =
        collectibles.filter(
            function (current) {

                return current !== item;

            }
        );


    updateUI();

}



/* =============================================================
   25. ENEMY COLLISION
   ============================================================= */

let lastEnemyHit =
    0;


function checkEnemyCollision() {

    enemies.forEach(
        function (enemy) {

            if (
                rectanglesOverlap(
                    playerData.x,
                    playerData.y,
                    playerData.width,
                    playerData.height,

                    enemy.x,
                    enemy.y,
                    enemy.width,
                    enemy.height
                )
            ) {

                const now =
                    Date.now();


                if (
                    now - lastEnemyHit <
                    1200
                ) {

                    return;

                }


                lastEnemyHit =
                    now;


                kehilanganNyawa();

            }

        }
    );

}



/* =============================================================
   26. RECTANGLE COLLISION
   ============================================================= */

function rectanglesOverlap(
    x1,
    y1,
    width1,
    height1,

    x2,
    y2,
    width2,
    height2
) {

    return (

        x1 <
        x2 + width2 &&

        x1 + width1 >
        x2 &&

        y1 <
        y2 + height2 &&

        y1 + height1 >
        y2

    );

}



/* =============================================================
   27. PLAYER LOSE LIFE
   ============================================================= */

function kehilanganNyawa() {

    if (
        !state.sedangMain
    ) {

        return;

    }


    state.lives--;


    player.classList.add(
        "hit"
    );


    showPopup(
        playerData.x,
        playerData.y,
        "-1 ❤️"
    );


    setTimeout(
        function () {

            player.classList.remove(
                "hit"
            );

        },
        800
    );


    updateUI();


    if (
        state.lives > 0
    ) {

        playerData.x = 80;

        playerData.y = 500;

        playerData.velocityX = 0;

        playerData.velocityY = 0;

    }
    else {

        kalah();

    }

}



/* =============================================================
   28. GOAL COLLISION
   ============================================================= */

function checkGoal() {

    if (
        goal === null
    ) {

        return;

    }


    if (
        rectanglesOverlap(
            playerData.x,
            playerData.y,
            playerData.width,
            playerData.height,

            goal.x,
            goal.y,
            goal.width,
            goal.height
        )
    ) {

        menang();

    }

}



/* =============================================================
   29. WIN
   ============================================================= */

function menang() {

    if (
        !state.sedangMain
    ) {

        return;

    }


    state.sedangMain =
        false;


    clearInterval(
        timerId
    );


    cancelAnimationFrame(
        gameLoopId
    );


    state.skor +=
        state.waktu * 2;


    updateBestScore();


    gameMessage.style.display =
        "flex";


    messageIcon.textContent =
        "🏆";


    messageTitle.textContent =
        "LEVEL COMPLETE!";


    messageText.innerHTML =

        "Kamu berhasil mencapai portal!<br><br>" +

        "Bonus waktu: +" +

        state.waktu * 2 +

        " poin";


    replayLevelButton.style.display =
        state.level === 1 ? "block" : "none";


    if (
        state.level === 1
    ) {

        messageButton.textContent =
            "Lanjut Level 2";

        messageButton.onclick =
            lanjutLevelDua;

        replayLevelButton.onclick =
            ulangiLevelPertama;

    }
    else {

        messageButton.textContent =
            "Lihat Hasil";

        messageButton.onclick =
            function () {

                tampilkanHasil();

            };

    }


    updateUI();

}



/* =============================================================
   30. GAME OVER
   ============================================================= */

function kalah() {

    state.sedangMain =
        false;


    clearInterval(
        timerId
    );


    cancelAnimationFrame(
        gameLoopId
    );


    updateBestScore();


    gameMessage.style.display =
        "flex";


    messageIcon.textContent =
        "😵";


    messageTitle.textContent =
        "GAME OVER";


    messageText.textContent =
        "Petualanganmu berakhir. Coba lagi!";


    replayLevelButton.style.display =
        "none";


    messageButton.textContent =
        "Lihat Hasil";


    messageButton.onclick =
        function () {

            tampilkanHasil();

        };

}



/* =============================================================
   31. CAMERA
   ============================================================= */

function updateCamera() {

    const screenWidth =
        worldWrapper.clientWidth;


    cameraX =
        playerData.x -
        screenWidth / 2;


    if (
        cameraX < 0
    ) {

        cameraX = 0;

    }


    const maxCameraX =
        WORLD_WIDTH -
        screenWidth;


    if (
        cameraX > maxCameraX
    ) {

        cameraX =
            maxCameraX;

    }


    world.style.transform =
        "translateX(" +
        (-cameraX) +
        "px)";

}



/* =============================================================
   32. TIMER
   ============================================================= */

function updateTimer() {

    if (
        !state.sedangMain
    ) {

        return;

    }


    state.waktu--;


    updateUI();


    if (
        state.waktu <= 0
    ) {

        kalah();

    }

}



/* =============================================================
   33. UPDATE UI
   ============================================================= */

function updateUI() {

    document.getElementById(
        "skor"
    ).textContent =
        state.skor;


    document.getElementById(
        "timer"
    ).textContent =
        state.waktu;


    document.getElementById(
        "level"
    ).textContent =
        state.level;


    document.getElementById(
        "lives"
    ).textContent =
        "❤️".repeat(
            Math.max(
                0,
                state.lives
            )
        );


    document.getElementById(
        "namaPemain"
    ).textContent =
        state.nama;


    if (
        state.waktu <= 10
    ) {

        document.getElementById(
            "timer"
        ).style.color =
            "var(--wrong)";

    }
    else {

        document.getElementById(
            "timer"
        ).style.color =
            "var(--accent)";

    }

}



/* =============================================================
   34. PARTICLES
   ============================================================= */

function createParticles(
    x,
    y
) {

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "particle";


        particle.style.left =
            x + 18 + "px";


        particle.style.top =
            y + 18 + "px";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            25 +
            Math.random() *
            45;


        particle.style.setProperty(
            "--x",
            Math.cos(angle) *
            distance +
            "px"
        );


        particle.style.setProperty(
            "--y",
            Math.sin(angle) *
            distance +
            "px"
        );


        world.appendChild(
            particle
        );


        setTimeout(
            function () {

                particle.remove();

            },
            600
        );

    }

}



/* =============================================================
   35. SCORE POPUP
   ============================================================= */

function showPopup(
    x,
    y,
    text
) {

    const popup =
        document.createElement(
            "div"
        );


    popup.className =
        "score-popup";


    popup.textContent =
        text;


    popup.style.left =
        x + "px";


    popup.style.top =
        y + "px";


    world.appendChild(
        popup
    );


    setTimeout(
        function () {

            popup.remove();

        },
        700
    );

}



/* =============================================================
   36. BEST SCORE
   ============================================================= */

function updateBestScore() {

    if (
        state.skor >
        bestScore
    ) {

        bestScore =
            state.skor;


        localStorage.setItem(
            "skyJumperBestScore",
            bestScore
        );

    }

}



/* =============================================================
   37. RESULT SCREEN
   ============================================================= */

function tampilkanHasil() {

    gameMessage.style.display =
        "none";


    document.getElementById(
        "skorAkhir"
    ).textContent =
        state.skor;


    document.getElementById(
        "hasilStars"
    ).textContent =
        state.stars;


    document.getElementById(
        "hasilDiamonds"
    ).textContent =
        state.diamonds;


    document.getElementById(
        "hasilLevel"
    ).textContent =
        state.level;


    document.getElementById(
        "hasilBest"
    ).textContent =
        bestScore;


    let komentar;


    if (
        state.skor >= 300
    ) {

        komentar =
            "🌟 Legendary Jumper! Kamu hebat!";

    }

    else if (
        state.skor >= 200
    ) {

        komentar =
            "🔥 Amazing! Lompatanmu keren!";

    }

    else if (
        state.skor >= 100
    ) {

        komentar =
            "💎 Good job! Terus berlatih!";

    }

    else {

        komentar =
            "🚀 Coba lagi dan kumpulkan lebih banyak bintang!";

    }


    document.getElementById(
        "komentar"
    ).textContent =
        komentar;


    layarGame.classList.remove(
        "aktif"
    );


    layarHasil.classList.add(
        "aktif"
    );

}



/* =============================================================
   38. CLEAR WORLD
   ============================================================= */

function bersihkanWorld() {

    const elements =
        Array.from(
            world.children
        );


    elements.forEach(
        function (element) {

            if (
                element !== player
            ) {

                element.remove();

            }

        }
    );


    platforms = [];

    collectibles = [];

    enemies = [];

    goal = null;

}



/* =============================================================
   39. RANDOM
   ============================================================= */

function randomNumber(
    min,
    max
) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}



/* =============================================================
   40. START BUTTON
   ============================================================= */

document
    .getElementById(
        "tombolMulai"
    )
    .addEventListener(
        "click",
        function () {

            mulaiGame();

        }
    );



/* =============================================================
   41. PLAY AGAIN
   ============================================================= */

document
    .getElementById(
        "tombolUlangi"
    )
    .addEventListener(
        "click",
        function () {

            layarHasil.classList.remove(
                "aktif"
            );


            layarMulai.classList.add(
                "aktif"
            );


            inputNama.focus();

        }
    );



/* =============================================================
   42. ENTER UNTUK MULAI
   ============================================================= */

inputNama.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            mulaiGame();

        }

    }
);



/* =============================================================
   43. MOBILE CONTROL
   ============================================================= */

function setupMobileButton(
    elementId,
    key
) {

    const button =
        document.getElementById(
            elementId
        );


    button.addEventListener(
        "touchstart",
        function (event) {

            event.preventDefault();

            keys[key] = true;

        }
    );


    button.addEventListener(
        "touchend",
        function (event) {

            event.preventDefault();

            keys[key] = false;

        }
    );


    button.addEventListener(
        "mousedown",
        function () {

            keys[key] = true;

        }
    );


    button.addEventListener(
        "mouseup",
        function () {

            keys[key] = false;

        }
    );


    button.addEventListener(
        "mouseleave",
        function () {

            keys[key] = false;

        }
    );

}


setupMobileButton(
    "leftButton",
    "arrowleft"
);


setupMobileButton(
    "rightButton",
    "arrowright"
);



/* =============================================================
   44. MOBILE JUMP
   ============================================================= */

const jumpButton =
    document.getElementById(
        "jumpButton"
    );


jumpButton.addEventListener(
    "touchstart",
    function (event) {

        event.preventDefault();

        lompat();

    }
);


jumpButton.addEventListener(
    "mousedown",
    function () {

        lompat();

    }
);
