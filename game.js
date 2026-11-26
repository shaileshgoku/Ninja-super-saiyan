const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;


// =====================================================
// GAME STATE
// =====================================================

let gameState = "playing";

let cameraX = 0;

let coins = 0;

let score = 0;

let powerUpActive = false;

let powerUpTimer = 0;

let bossDefeated = false;


// =====================================================
// KEYBOARD
// =====================================================

const keys = {
    ArrowLeft: false,
    ArrowRight: false
};


window.addEventListener("keydown", function (event) {

    // Prevent browser scrolling
    if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.code === "Space"
    ) {
        event.preventDefault();
    }


    // Move

    if (event.key === "ArrowLeft") {
        keys.ArrowLeft = true;
    }

    if (event.key === "ArrowRight") {
        keys.ArrowRight = true;
    }


    // Jump

    if (
        event.key === "ArrowUp" &&
        !event.repeat
    ) {
        jump();
    }


    // Sword Attack

    if (
        event.code === "Space" &&
        !event.repeat
    ) {
        attack();
    }


    // Dash

    if (
        event.key === "Shift" &&
        !event.repeat
    ) {
        dash();
    }


    // Restart

    if (
        event.key.toLowerCase() === "r" &&
        (
            gameState === "gameover" ||
            gameState === "won"
        )
    ) {
        restartGame();
    }
});


window.addEventListener("keyup", function (event) {

    if (event.key === "ArrowLeft") {
        keys.ArrowLeft = false;
    }

    if (event.key === "ArrowRight") {
        keys.ArrowRight = false;
    }
});


// =====================================================
// NINJA
// =====================================================

const ninja = {

    x: 150,
    y: 450,

    width: 40,
    height: 55,

    speed: 5,

    jumpPower: 13,

    velocityY: 0,

    gravity: 0.6,

    grounded: false,

    health: 100,
    maxHealth: 100,

    energy: 0,
    maxEnergy: 100,

    attacking: false,

    attackCooldown: 350,

    lastAttack: 0,

    attackRange: 80,

    dashCooldown: 500,

    lastDash: 0
};


// =====================================================
// WORLD
// =====================================================

const worldWidth = 5000;


// =====================================================
// PLATFORMS
// =====================================================

const platforms = [

    {
        x: 0,
        y: 520,
        width: 900,
        height: 80
    },

    {
        x: 950,
        y: 520,
        width: 800,
        height: 80
    },

    {
        x: 1800,
        y: 520,
        width: 900,
        height: 80
    },

    {
        x: 2750,
        y: 520,
        width: 900,
        height: 80
    },

    {
        x: 3700,
        y: 520,
        width: 1300,
        height: 80
    },

    {
        x: 500,
        y: 400,
        width: 180,
        height: 25
    },

    {
        x: 1100,
        y: 380,
        width: 180,
        height: 25
    },

    {
        x: 1500,
        y: 420,
        width: 200,
        height: 25
    },

    {
        x: 2050,
        y: 380,
        width: 180,
        height: 25
    },

    {
        x: 2400,
        y: 430,
        width: 180,
        height: 25
    },

    {
        x: 3100,
        y: 380,
        width: 180,
        height: 25
    },

    {
        x: 3500,
        y: 420,
        width: 180,
        height: 25
    }
];


// =====================================================
// COINS
// =====================================================

const coinPositions = [

    { x: 350, y: 460 },
    { x: 430, y: 460 },
    { x: 510, y: 350 },
    { x: 590, y: 350 },

    { x: 1100, y: 330 },
    { x: 1180, y: 330 },
    { x: 1300, y: 460 },

    { x: 1550, y: 370 },
    { x: 1620, y: 370 },

    { x: 1950, y: 460 },
    { x: 2100, y: 330 },
    { x: 2180, y: 330 },

    { x: 2500, y: 380 },

    { x: 3000, y: 460 },
    { x: 3100, y: 330 },
    { x: 3180, y: 330 },

    { x: 3450, y: 460 },
    { x: 3550, y: 370 },

    { x: 4000, y: 460 },
    { x: 4100, y: 460 },
    { x: 4200, y: 460 }
];


let collectedCoins = [];


// =====================================================
// POWER UPS
// =====================================================

const powerUps = [

    {
        x: 850,
        y: 470,
        type: "energy",
        collected: false
    },

    {
        x: 1650,
        y: 470,
        type: "health",
        collected: false
    },

    {
        x: 2800,
        y: 470,
        type: "super",
        collected: false
    }
];


// =====================================================
// ENEMIES
// =====================================================

const enemies = [

    createEnemy(700, 475),

    createEnemy(1250, 475),

    createEnemy(1600, 375),

    createEnemy(2150, 475),

    createEnemy(2600, 475),

    createEnemy(3200, 475),

    createEnemy(3550, 475),

    createEnemy(4100, 475)
];


function createEnemy(x, y) {

    return {

        x: x,

        y: y,

        width: 42,
        height: 42,

        // Normal monsters die in one strike
        health: 1,
        maxHealth: 1,

        speed: 1.2,

        alive: true,

        lastAttack: 0,

        attackCooldown: 1000
    };
}


// =====================================================
// BOSS
// =====================================================

const boss = {

    x: 4500,

    y: 440,

    width: 90,

    height: 90,

    // IMPORTANT:
    // Boss has only 3 HP
    // One sword strike = 1 damage
    // Therefore 3 strikes to defeat
    health: 3,
    maxHealth: 3,

    alive: true,

    speed: 1.2,

    lastAttack: 0,

    attackCooldown: 1000
};


// =====================================================
// PRINCESS
// =====================================================

const princess = {

    x: 4750,

    y: 450,

    rescued: false
};


// =====================================================
// JUMP
// =====================================================

function jump() {

    if (
        gameState !== "playing"
    ) {
        return;
    }


    if (
        ninja.grounded
    ) {

        ninja.velocityY =
            -ninja.jumpPower;

        ninja.grounded =
            false;
    }
}


// =====================================================
// ATTACK
// =====================================================

function attack() {

    if (
        gameState !== "playing"
    ) {
        return;
    }


    const now =
        Date.now();


    if (
        now -
        ninja.lastAttack <
        ninja.attackCooldown
    ) {
        return;
    }


    ninja.lastAttack =
        now;


    ninja.attacking =
        true;


    setTimeout(function () {

        ninja.attacking =
            false;

    }, 130);


    // =================================================
    // NORMAL MONSTERS
    // =================================================

    for (
        let enemy of enemies
    ) {

        if (
            !enemy.alive
        ) {
            continue;
        }


        const distance =
            Math.abs(
                enemy.x -
                ninja.x
            );


        if (
            distance <=
            ninja.attackRange
        ) {

            // ONE STRIKE KILL

            enemy.health = 0;

            enemy.alive = false;

            score += 100;

            gainEnergy(15);

            return;
        }
    }


    // =================================================
    // BOSS
    // =================================================

    if (
        boss.alive
    ) {

        const bossDistance =
            Math.abs(
                boss.x -
                ninja.x
            );


        if (
            bossDistance <=
            120
        ) {

            // ALWAYS 1 DAMAGE
            // So boss requires exactly 3 strikes

            const damage = 1;


            boss.health -=
                damage;


            gainEnergy(5);


            if (
                boss.health <= 0
            ) {

                boss.health =
                    0;

                boss.alive =
                    false;

                bossDefeated =
                    true;

                score += 1000;
            }
        }
    }
}


// =====================================================
// ENERGY
// =====================================================

function gainEnergy(amount) {

    ninja.energy +=
        amount;


    ninja.energy =
        Math.min(
            ninja.maxEnergy,
            ninja.energy
        );
}


// =====================================================
// DASH
// =====================================================

function dash() {

    if (
        gameState !== "playing"
    ) {
        return;
    }


    const now =
        Date.now();


    if (
        now -
        ninja.lastDash <
        ninja.dashCooldown
    ) {
        return;
    }


    ninja.lastDash =
        now;


    if (
        keys.ArrowLeft
    ) {

        ninja.x -= 100;

    }

    else {

        ninja.x += 100;
    }


    ninja.x =
        Math.max(
            20,
            Math.min(
                worldWidth - 50,
                ninja.x
            )
        );
}


// =====================================================
// UPDATE NINJA
// =====================================================

function updateNinja() {

    if (
        gameState !== "playing"
    ) {
        return;
    }


    // Movement

    if (
        keys.ArrowLeft
    ) {

        ninja.x -=
            ninja.speed;
    }


    if (
        keys.ArrowRight
    ) {

        ninja.x +=
            ninja.speed;
    }


    // Gravity

    ninja.velocityY +=
        ninja.gravity;


    ninja.y +=
        ninja.velocityY;


    ninja.grounded =
        false;


    // Platform collision

    for (
        let platform of platforms
    ) {

        const ninjaBottom =
            ninja.y +
            ninja.height / 2;

        const ninjaLeft =
            ninja.x -
            ninja.width / 2;

        const ninjaRight =
            ninja.x +
            ninja.width / 2;


        if (

            ninjaBottom >=
            platform.y &&

            ninjaBottom <=
            platform.y + 15 &&

            ninjaRight >
            platform.x &&

            ninjaLeft <
            platform.x +
            platform.width &&

            ninja.velocityY >= 0

        ) {

            ninja.y =
                platform.y -
                ninja.height / 2;

            ninja.velocityY =
                0;

            ninja.grounded =
                true;
        }
    }


    // Falling

    if (
        ninja.y >
        canvas.height + 100
    ) {

        ninja.health -=
            15;


        ninja.x =
            Math.max(
                100,
                ninja.x - 200
            );


        ninja.y =
            400;

        ninja.velocityY =
            0;


        if (
            ninja.health <= 0
        ) {

            ninja.health =
                0;

            gameState =
                "gameover";
        }
    }


    // Keep ninja inside world

    ninja.x =
        Math.max(
            20,
            Math.min(
                worldWidth - 50,
                ninja.x
            )
        );


    // Camera

    cameraX =
        ninja.x -
        250;


    cameraX =
        Math.max(
            0,
            Math.min(
                worldWidth -
                canvas.width,
                cameraX
            )
        );


    // Power-up timer

    if (
        powerUpActive
    ) {

        powerUpTimer -=
            16;


        if (
            powerUpTimer <= 0
        ) {

            powerUpActive =
                false;
        }
    }


    // Princess

    if (
        bossDefeated &&
        !princess.rescued &&
        Math.abs(
            ninja.x -
            princess.x
        ) < 80
    ) {

        princess.rescued =
            true;

        gameState =
            "won";
    }
}


// =====================================================
// UPDATE ENEMIES
// =====================================================

function updateEnemies() {

    if (
        gameState !== "playing"
    ) {
        return;
    }


    for (
        let enemy of enemies
    ) {

        if (
            !enemy.alive
        ) {
            continue;
        }


        const distance =
            Math.abs(
                ninja.x -
                enemy.x
            );


        // Enemy approaches

        if (
            distance <
            350
        ) {

            if (
                ninja.x >
                enemy.x
            ) {

                enemy.x +=
                    enemy.speed;

            }

            else {

                enemy.x -=
                    enemy.speed;
            }
        }


        // Enemy attack

        if (
            distance <
            50
        ) {

            const now =
                Date.now();


            if (
                now -
                enemy.lastAttack >
                enemy.attackCooldown
            ) {

                enemy.lastAttack =
                    now;


                // Normal monster damage = 5

                ninja.health -= 5;


                if (
                    ninja.health <= 0
                ) {

                    ninja.health =
                        0;

                    gameState =
                        "gameover";
                }
            }
        }
    }
}


// =====================================================
// UPDATE BOSS
// =====================================================

function updateBoss() {

    if (
        gameState !== "playing"
    ) {
        return;
    }


    if (
        !boss.alive
    ) {
        return;
    }


    const distance =
        Math.abs(
            ninja.x -
            boss.x
        );


    // Boss approaches

    if (
        distance <
        450
    ) {

        if (
            ninja.x >
            boss.x
        ) {

            boss.x +=
                boss.speed;

        }

        else {

            boss.x -=
                boss.speed;
        }
    }


    // Boss attack

    if (
        distance <
        100
    ) {

        const now =
            Date.now();


        if (
            now -
            boss.lastAttack >
            boss.attackCooldown
        ) {

            boss.lastAttack =
                now;


            // Boss damage = 8

            ninja.health -= 8;


            if (
                ninja.health <= 0
            ) {

                ninja.health =
                    0;

                gameState =
                    "gameover";
            }
        }
    }
}


// =====================================================
// COLLECT COINS
// =====================================================

function collectCoins() {

    for (
        let coin of coinPositions
    ) {

        if (
            collectedCoins.includes(
                coin
            )
        ) {
            continue;
        }


        const distance =
            Math.hypot(
                ninja.x -
                coin.x,

                ninja.y -
                coin.y
            );


        if (
            distance <
            35
        ) {

            collectedCoins.push(
                coin
            );


            coins++;

            score += 25;

            gainEnergy(5);
        }
    }
}


// =====================================================
// COLLECT POWER UPS
// =====================================================

function collectPowerUps() {

    for (
        let powerUp of powerUps
    ) {

        if (
            powerUp.collected
        ) {
            continue;
        }


        const distance =
            Math.hypot(
                ninja.x -
                powerUp.x,

                ninja.y -
                powerUp.y
            );


        if (
            distance <
            40
        ) {

            powerUp.collected =
                true;


            // Health Power Up

            if (
                powerUp.type ===
                "health"
            ) {

                ninja.health +=
                    30;


                ninja.health =
                    Math.min(
                        ninja.maxHealth,
                        ninja.health
                    );
            }


            // Energy Power Up

            if (
                powerUp.type ===
                "energy"
            ) {

                ninja.energy =
                    100;
            }


            // Super Power Up

            if (
                powerUp.type ===
                "super"
            ) {

                powerUpActive =
                    true;

                powerUpTimer =
                    8000;
            }


            score += 100;
        }
    }
}


// =====================================================
// DRAW BACKGROUND
// =====================================================

function drawBackground() {

    ctx.fillStyle =
        "#87ceeb";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Sun

    ctx.fillStyle =
        "#ffd54f";


    ctx.beginPath();

    ctx.arc(
        800,
        100,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Mountains

    ctx.fillStyle =
        "#6fa3a0";


    for (
        let x = -100;
        x < canvas.width + 200;
        x += 300
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            450
        );

        ctx.lineTo(
            x + 150,
            250
        );

        ctx.lineTo(
            x + 300,
            450
        );

        ctx.closePath();

        ctx.fill();
    }


    // Clouds

    ctx.fillStyle =
        "rgba(255,255,255,0.8)";


    drawCloud(200, 100);

    drawCloud(600, 150);

    drawCloud(900, 80);
}


function drawCloud(x, y) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        25,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 25,
        y - 10,
        30,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 55,
        y,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// =====================================================
// DRAW PLATFORMS
// =====================================================

function drawPlatforms() {

    for (
        let platform of platforms
    ) {

        const screenX =
            platform.x -
            cameraX;


        if (
            screenX +
            platform.width <
            0 ||
            screenX >
            canvas.width
        ) {
            continue;
        }


        // Grass

        ctx.fillStyle =
            "#3fa34d";


        ctx.fillRect(
            screenX,
            platform.y,
            platform.width,
            10
        );


        // Dirt

        ctx.fillStyle =
            "#7a4f2a";


        ctx.fillRect(
            screenX,
            platform.y + 10,
            platform.width,
            platform.height - 10
        );
    }
}


// =====================================================
// DRAW COINS
// =====================================================

function drawCoins() {

    for (
        let coin of coinPositions
    ) {

        if (
            collectedCoins.includes(
                coin
            )
        ) {
            continue;
        }


        const x =
            coin.x -
            cameraX;

        const y =
            coin.y;


        if (
            x < -30 ||
            x > canvas.width + 30
        ) {
            continue;
        }


        // Coin

        ctx.fillStyle =
            "#ffd700";


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            12,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Border

        ctx.strokeStyle =
            "#b8860b";

        ctx.lineWidth =
            3;

        ctx.stroke();


        // Symbol

        ctx.fillStyle =
            "#fff4a3";

        ctx.font =
            "bold 12px Arial";

        ctx.textAlign =
            "center";


        ctx.fillText(
            "$",
            x,
            y + 4
        );
    }
}


// =====================================================
// DRAW POWER UPS
// =====================================================

function drawPowerUps() {

    for (
        let powerUp of powerUps
    ) {

        if (
            powerUp.collected
        ) {
            continue;
        }


        const x =
            powerUp.x -
            cameraX;


        const y =
            powerUp.y;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            18,
            0,
            Math.PI * 2
        );


        if (
            powerUp.type ===
            "health"
        ) {

            ctx.fillStyle =
                "#e53935";

        }

        else if (
            powerUp.type ===
            "energy"
        ) {

            ctx.fillStyle =
                "#00bfff";

        }

        else {

            ctx.fillStyle =
                "#ffd700";
        }


        ctx.fill();


        ctx.strokeStyle =
            "#fff";

        ctx.lineWidth =
            3;

        ctx.stroke();


        ctx.fillStyle =
            "#fff";

        ctx.font =
            "bold 15px Arial";

        ctx.textAlign =
            "center";


        if (
            powerUp.type ===
            "health"
        ) {

            ctx.fillText(
                "+",
                x,
                y + 5
            );

        }

        else if (
            powerUp.type ===
            "energy"
        ) {

            ctx.fillText(
                "E",
                x,
                y + 5
            );

        }

        else {

            ctx.fillText(
                "⚡",
                x,
                y + 5
            );
        }
    }
}


// =====================================================
// DRAW ENEMIES
// =====================================================

function drawEnemies() {

    for (
        let enemy of enemies
    ) {

        if (
            !enemy.alive
        ) {
            continue;
        }


        const x =
            enemy.x -
            cameraX;

        const y =
            enemy.y;


        if (
            x < -60 ||
            x > canvas.width + 60
        ) {
            continue;
        }


        // Body

        ctx.fillStyle =
            "#c0392b";


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            20,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Horns

        ctx.fillStyle =
            "#f1c40f";


        ctx.beginPath();

        ctx.moveTo(
            x - 10,
            y - 15
        );

        ctx.lineTo(
            x - 20,
            y - 35
        );

        ctx.lineTo(
            x - 3,
            y - 22
        );

        ctx.closePath();

        ctx.fill();


        ctx.beginPath();

        ctx.moveTo(
            x + 10,
            y - 15
        );

        ctx.lineTo(
            x + 20,
            y - 35
        );

        ctx.lineTo(
            x + 3,
            y - 22
        );

        ctx.closePath();

        ctx.fill();


        // Eyes

        ctx.fillStyle =
            "#fff";


        ctx.beginPath();

        ctx.arc(
            x - 7,
            y - 5,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            x + 7,
            y - 5,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Pupils

        ctx.fillStyle =
            "#111";


        ctx.beginPath();

        ctx.arc(
            x - 7,
            y - 5,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            x + 7,
            y - 5,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// =====================================================
// DRAW BOSS
// =====================================================

function drawBoss() {

    if (
        !boss.alive
    ) {
        return;
    }


    const x =
        boss.x -
        cameraX;

    const y =
        boss.y;


    // Body

    ctx.fillStyle =
        "#5e1b1b";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Head

    ctx.fillStyle =
        "#8e2f2f";


    ctx.beginPath();

    ctx.arc(
        x,
        y - 40,
        35,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Horns

    ctx.fillStyle =
        "#f1c40f";


    ctx.beginPath();

    ctx.moveTo(
        x - 20,
        y - 60
    );

    ctx.lineTo(
        x - 35,
        y - 95
    );

    ctx.lineTo(
        x - 5,
        y - 70
    );

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(
        x + 20,
        y - 60
    );

    ctx.lineTo(
        x + 35,
        y - 95
    );

    ctx.lineTo(
        x + 5,
        y - 70
    );

    ctx.closePath();

    ctx.fill();


    // Eyes

    ctx.fillStyle =
        "#ff3333";


    ctx.fillRect(
        x - 20,
        y - 43,
        12,
        6
    );


    ctx.fillRect(
        x + 8,
        y - 43,
        12,
        6
    );


    // =================================================
    // BOSS HEALTH BAR
    // =================================================

    const barWidth =
        160;


    ctx.fillStyle =
        "#222";


    ctx.fillRect(
        x -
        barWidth / 2,
        y - 115,
        barWidth,
        12
    );


    ctx.fillStyle =
        "#e53935";


    ctx.fillRect(
        x -
        barWidth / 2,
        y - 115,
        barWidth *
        (
            boss.health /
            boss.maxHealth
        ),
        12
    );


    ctx.strokeStyle =
        "#fff";


    ctx.strokeRect(
        x -
        barWidth / 2,
        y - 115,
        barWidth,
        12
    );


    // Boss label

    ctx.fillStyle =
        "#fff";

    ctx.font =
        "bold 14px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        `BOSS  ${boss.health}/3`,
        x,
        y - 125
    );
}


// =====================================================
// DRAW PRINCESS
// =====================================================

function drawPrincess() {

    if (
        princess.rescued
    ) {
        return;
    }


    const x =
        princess.x -
        cameraX;

    const y =
        princess.y;


    // Dress

    ctx.fillStyle =
        "#ff69b4";


    ctx.beginPath();

    ctx.moveTo(
        x,
        y
    );

    ctx.lineTo(
        x - 25,
        y + 40
    );

    ctx.lineTo(
        x + 25,
        y + 40
    );

    ctx.closePath();

    ctx.fill();


    // Head

    ctx.fillStyle =
        "#f5c6a5";


    ctx.beginPath();

    ctx.arc(
        x,
        y - 20,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Hair

    ctx.fillStyle =
        "#6b3e26";


    ctx.beginPath();

    ctx.arc(
        x,
        y - 25,
        17,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    // Crown

    ctx.fillStyle =
        "#ffd700";


    ctx.beginPath();

    ctx.moveTo(
        x - 12,
        y - 35
    );

    ctx.lineTo(
        x - 7,
        y - 48
    );

    ctx.lineTo(
        x,
        y - 37
    );

    ctx.lineTo(
        x + 7,
        y - 48
    );

    ctx.lineTo(
        x + 12,
        y - 35
    );

    ctx.closePath();

    ctx.fill();


    // Label

    ctx.fillStyle =
        "#fff";

    ctx.font =
        "bold 14px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        "PRINCESS",
        x,
        y - 60
    );
}


// =====================================================
// DRAW NINJA
// =====================================================

function drawNinja() {

    const x =
        ninja.x -
        cameraX;

    const y =
        ninja.y;


    // Power aura

    if (
        powerUpActive
    ) {

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            38 +
            Math.sin(
                Date.now() / 80
            ) * 6,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "rgba(255,215,0,0.25)";

        ctx.fill();


        ctx.strokeStyle =
            "#ffd700";

        ctx.lineWidth =
            4;

        ctx.stroke();
    }


    // Legs

    ctx.fillStyle =
        "#111";


    ctx.fillRect(
        x - 13,
        y + 12,
        9,
        23
    );


    ctx.fillRect(
        x + 4,
        y + 12,
        9,
        23
    );


    // Body

    ctx.fillStyle =
        powerUpActive
            ? "#8b5a00"
            : "#151515";


    ctx.fillRect(
        x - 17,
        y - 8,
        34,
        27
    );


    // Belt

    ctx.fillStyle =
        "#d4af37";


    ctx.fillRect(
        x - 18,
        y + 12,
        36,
        5
    );


    // Head

    ctx.fillStyle =
        "#c98b65";


    ctx.beginPath();

    ctx.arc(
        x,
        y - 20,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Mask

    ctx.fillStyle =
        "#080808";


    ctx.fillRect(
        x - 16,
        y - 21,
        32,
        13
    );


    // Headband

    ctx.fillStyle =
        powerUpActive
            ? "#ffd700"
            : "#b00020";


    ctx.fillRect(
        x - 16,
        y - 29,
        32,
        5
    );


    // Headband tail

    ctx.beginPath();

    ctx.moveTo(
        x + 15,
        y - 27
    );

    ctx.lineTo(
        x + 28,
        y - 20
    );

    ctx.lineTo(
        x + 15,
        y - 17
    );

    ctx.closePath();

    ctx.fill();


    // Eyes

    ctx.fillStyle =
        "#fff";


    ctx.fillRect(
        x - 10,
        y - 17,
        7,
        3
    );


    ctx.fillRect(
        x + 3,
        y - 17,
        7,
        3
    );


    // Left arm

    ctx.strokeStyle =
        "#151515";

    ctx.lineWidth =
        8;

    ctx.lineCap =
        "round";


    ctx.beginPath();

    ctx.moveTo(
        x - 15,
        y - 1
    );

    ctx.lineTo(
        x - 27,
        y + 12
    );

    ctx.stroke();


    // Sword arm

    ctx.beginPath();

    ctx.moveTo(
        x + 14,
        y - 1
    );

    ctx.lineTo(
        x + 25,
        y - 10
    );

    ctx.stroke();


    // Sword

    ctx.strokeStyle =
        "#dcecff";

    ctx.lineWidth =
        4;


    ctx.beginPath();

    ctx.moveTo(
        x + 25,
        y - 10
    );

    ctx.lineTo(
        x + 62,
        y - 48
    );

    ctx.stroke();


    // Attack slash

    if (
        ninja.attacking
    ) {

        ctx.strokeStyle =
            powerUpActive
                ? "#ffd700"
                : "#fff";

        ctx.lineWidth =
            powerUpActive
                ? 8
                : 5;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            70,
            -0.8,
            0.7
        );

        ctx.stroke();
    }
}


// =====================================================
// DRAW UI
// =====================================================

function drawUI() {

    // HP BAR

    ctx.fillStyle =
        "#222";


    ctx.fillRect(
        20,
        20,
        220,
        20
    );


    ctx.fillStyle =
        "#e53935";


    ctx.fillRect(
        20,
        20,
        220 *
        (
            ninja.health /
            ninja.maxHealth
        ),
        20
    );


    ctx.strokeStyle =
        "#fff";


    ctx.strokeRect(
        20,
        20,
        220,
        20
    );


    ctx.fillStyle =
        "#fff";


    ctx.font =
        "bold 13px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(
        `HP ${ninja.health}`,
        130,
        35
    );


    // ENERGY BAR

    ctx.fillStyle =
        "#222";


    ctx.fillRect(
        20,
        48,
        220,
        20
    );


    ctx.fillStyle =
        "#00bfff";


    ctx.fillRect(
        20,
        48,
        220 *
        (
            ninja.energy /
            ninja.maxEnergy
        ),
        20
    );


    ctx.strokeStyle =
        "#fff";


    ctx.strokeRect(
        20,
        48,
        220,
        20
    );


    ctx.fillStyle =
        "#fff";


    ctx.fillText(
        `ENERGY ${ninja.energy}`,
        130,
        63
    );


    // COINS

    ctx.textAlign =
        "left";


    ctx.font =
        "bold 20px Arial";


    ctx.fillStyle =
        "#ffd700";


    ctx.fillText(
        `🪙 ${coins}`,
        270,
        38
    );


    // SCORE

    ctx.fillStyle =
        "#fff";


    ctx.fillText(
        `SCORE ${score}`,
        270,
        65
    );


    // POWER UP

    if (
        powerUpActive
    ) {

        ctx.fillStyle =
            "#ffd700";


        ctx.font =
            "bold 18px Arial";


        ctx.fillText(
            "⚡ POWER UP ACTIVE",
            430,
            38
        );
    }


    // OBJECTIVE

    ctx.fillStyle =
        "#fff";


    ctx.font =
        "bold 16px Arial";


    ctx.textAlign =
        "right";


    if (
        !bossDefeated
    ) {

        ctx.fillText(
            "Defeat the Boss 👹",
            canvas.width - 20,
            30
        );

    }

    else {

        ctx.fillText(
            "Rescue the Princess 👸",
            canvas.width - 20,
            30
        );
    }


    // CONTROLS

    ctx.textAlign =
        "left";


    ctx.font =
        "14px Arial";


    ctx.fillStyle =
        "#222";


    ctx.fillText(
        "← → Move   ↑ Jump   Space Attack   Shift Dash",
        20,
        canvas.height - 18
    );
}


// =====================================================
// GAME OVER
// =====================================================

function drawGameOver() {

    ctx.fillStyle =
        "rgba(0,0,0,0.7)";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.textAlign =
        "center";


    ctx.fillStyle =
        "#e53935";


    ctx.font =
        "bold 64px Arial";


    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2
    );


    ctx.fillStyle =
        "#fff";


    ctx.font =
        "22px Arial";


    ctx.fillText(
        "Press R to restart",
        canvas.width / 2,
        canvas.height / 2 + 50
    );
}


// =====================================================
// WIN SCREEN
// =====================================================

function drawWinScreen() {

    ctx.fillStyle =
        "rgba(0,0,0,0.7)";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.textAlign =
        "center";


    ctx.fillStyle =
        "#ffd700";


    ctx.font =
        "bold 58px Arial";


    ctx.fillText(
        "🏆 YOU WIN!",
        canvas.width / 2,
        230
    );


    ctx.fillStyle =
        "#fff";


    ctx.font =
        "28px Arial";


    ctx.fillText(
        "Princess Rescued!",
        canvas.width / 2,
        290
    );


    ctx.font =
        "20px Arial";


    ctx.fillText(
        `Coins: ${coins}    Score: ${score}`,
        canvas.width / 2,
        340
    );


    ctx.fillText(
        "Press R to play again",
        canvas.width / 2,
        400
    );
}


// =====================================================
// DRAW GAME
// =====================================================

function drawGame() {

    drawBackground();

    drawPlatforms();

    drawCoins();

    drawPowerUps();

    drawEnemies();

    drawBoss();

    drawPrincess();

    drawNinja();

    drawUI();


    if (
        gameState ===
        "gameover"
    ) {

        drawGameOver();
    }


    if (
        gameState ===
        "won"
    ) {

        drawWinScreen();
    }
}


// =====================================================
// RESTART GAME
// =====================================================

function restartGame() {

    location.reload();
}


// =====================================================
// GAME LOOP
// =====================================================

function gameLoop() {

    updateNinja();

    updateEnemies();

    updateBoss();

    collectCoins();

    collectPowerUps();

    drawGame();


    requestAnimationFrame(
        gameLoop
    );
}


// =====================================================
// START GAME
// =====================================================

gameLoop();