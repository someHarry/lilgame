
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
ctx.font = "50px Arial";

let isAssetsLoaded = 0;

function random(min, max){
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand)
}

function readCookie(name) {
    let name_cook = name+"=";
    let spl = document.cookie.split(";");
    for(let i=0; i<spl.length; i++) {
        let c = spl[i];
        while(c.charAt(0) === " ") {
            c = c.substring(1, c.length);
        }
        if(c.indexOf(name_cook) === 0) {
            return c.substring(name_cook.length, c.length);
        }
    }
    return null;
}

const hero = {
    sprite0 : new Image(),
    sprite1 : new Image(),
    sprite2 : new Image(),
};

hero.sprite0.src = "img/hero0.png";
hero.sprite1.src = "img/hero1.png";
hero.sprite2.src = "img/hero2.png";

const bg = {
    img0 : new Image(),
    img1 : new Image(),
    img2 : new Image(),
    img3 : new Image(),
    moon : new Image() // it's between img0 and img1
};

bg.img0.src = "img/bg0.png";
bg.img1.src = "img/bg1.png";
bg.img2.src = "img/bg2.png";
bg.img3.src = "img/bg3.png";
bg.moon.src = "img/moon.png";

const ground = {
    gr0 : new Image(),
    gr1 : new Image(),
    hLine0 : new Image(),
    hLine1 : new Image()
};

ground.gr0.src = "img/gr0.png";
ground.gr1.src = "img/gr1.png";
ground.hLine0.src = "img/hLine.png";
ground.hLine1.src = "img/hLine.png";

var ghost = {
    sprite0: new Image(),
    xPosGhost0 : 1280 + random(640, 1400),
    yPosGhost0 : 552 + 4 * random(-2, 2),
    yPosGhost0Counter : random(0, 3),
    speedMultiplier0 : random(14, 15)/10,
    xPosGhost1 : 1280 + random(1400+280, 2160+280),
    yPosGhost1 : 552 + 4 * random(-2, 2),
    yPosGhost1Counter : random(0, 3),
    speedMultiplier1 : random(14, 15)/10,
    xPosGhost2 : 1280 + random(2160+560, 2920+560),
    yPosGhost2 : 552 + 4 * random(-2, 2),
    yPosGhost2Counter : random(0, 3),
    speedMultiplier2 : random(14, 15)/10
};

ghost.sprite0.src = "img/ghost0.png";

let testModeON = false;
let isDefeatSoundPlayed = false;

document.addEventListener("keydown", (event) => {
    if (event.keyCode === 32)
        jump();
});
document.addEventListener("touchstart", jump);
document.addEventListener("mousedown", jump);

function jump() {
    if ( yPosHero === 505) {
        isHeroRun = false;
        var audio = new Audio();
        audio.src = 'audio/jump.mp3';
        audio.autoplay = true;

        for (let i = 0; i < 2; i++) {
            setTimeout(() => {yPosHero -= 3*8*1.5;}, i * (1000 / 60)); // 3*8*1.5*2 = + 72
        }
        for (let i = 2; i < 4; i++) {
            setTimeout(() => {yPosHero -= 2*8*1.5;}, i * (1000 / 60)); // 2*8*1.5*2 = + 48
        }
        for (let i = 4; i < 11; i++) {
            setTimeout(() => {yPosHero -= 1*8*1.5;}, i * (1000 / 60)); // 1*8*1.5*7 = + 84
        }
        for (let i = 16; i < 25; i++) {
            setTimeout(() => {yPosHero += 1*8*1.5;}, i * (1000 / 60)); // 1*8*1.5*9 = - 108
        }
        for (let i = 25; i < 26; i++) {
            setTimeout(() => {yPosHero += 2*8*1.5;}, i * (1000 / 60)); // 2*8*1.5*1 = - 24
        }
        for (let i = 26; i < 28; i++) {
            setTimeout(() => {yPosHero += 3*8*1.5;}, i * (1000 / 60)); // 3*8*1.5*2 = 72
        }
        setTimeout(() => {isHeroRun = true}, 27 * 1000 / 60);
    }
    if (isGameStopped){
        document.location.reload();
    }
}

function gameStop() {
    if(testModeON === false){
        speed = 0;
        // ctx.fillText("Game Over ¯\\_(ツ)_/¯", 1280/2 - 568/2, 80);
        // ctx.fillText("Press anywhere to restart", 1280/2 - 650/2, 160);
        isGameStopped = true;
        isHeroRun = false;
        document.getElementById("message0").classList.remove("hidden");
        if(!isDefeatSoundPlayed){
            isDefeatSoundPlayed = true;
            var audio = new Audio();
            audio.src = 'audio/defeat.mp3';
            audio.autoplay = true
        }
        if( localBestScore > cookieBestScore ){
            document.cookie = "bestScore" + "=" + encodeURIComponent(localBestScore) + "; path=/; max-age=315532800;"
        }
    }
}

var xPosBg0 = 0;
var xPosBg10 = 0;
var xPosBg11 = 2560;
var xPosBg20 = 0;
var xPosBg21 = 2560;
var xPosBg30 = 0;
var xPosBg31 = 2560;
var yPosBg = 0; // one for all

var xPosHero = 65;
var yPosHero = 505;



var speed = 8;
var score = 0;
var scoreCounter = 0;

var cookieBestScore = readCookie("bestScore");

var localBestScore = 0;
(function () {
    if ( cookieBestScore !== null ) {
        localBestScore = cookieBestScore
    }
})();


var yMoonPos = 265-32;


var isHeroRun = true;
var heroSpriteCounter = 0;

var isGameStopped = false;

function draw() {
    window.requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || function(callback) { window.setTimeout(callback, 1000 / 60); };


    // bg pics
    ctx.drawImage(bg.img0, xPosBg0, yPosBg);
    ctx.drawImage(bg.moon, 145-32, yMoonPos-16);
    ctx.drawImage(bg.img1, xPosBg10, yPosBg);
    ctx.drawImage(bg.img1, xPosBg11, yPosBg);
    ctx.drawImage(bg.img2, xPosBg20, yPosBg);
    ctx.drawImage(bg.img2, xPosBg21, yPosBg);
    ctx.drawImage(bg.img3, xPosBg30, yPosBg);
    ctx.drawImage(bg.img3, xPosBg31, yPosBg);

    // bg movement + parallax
    xPosBg30 -= speed;
    xPosBg31 -= speed;
    xPosBg20 -= speed/2;
    xPosBg21 -= speed/2;
    xPosBg10 -= speed/4;
    xPosBg11 -= speed/4;

    // bg neva ends
    if( xPosBg10 < -2560 ){
        xPosBg10 = xPosBg11 + 2560;
    }
    if( xPosBg11 < -2560 ){
        xPosBg11 = xPosBg10 + 2560;
    }
    if( xPosBg20 < -2560 ){
        xPosBg20 = xPosBg21 + 2560;
    }
    if( xPosBg21 < -2560 ){
        xPosBg21 = xPosBg20 + 2560;
    }
    if( xPosBg30 < -2560 ){
        xPosBg30 = xPosBg31 + 2560;
    }
    if( xPosBg31 < -2560 ){
        xPosBg31 = xPosBg30 + 2560;
    }

    // ground lines
    ctx.drawImage(ground.gr0, xPosBg30, 633);
    ctx.drawImage(ground.gr0, xPosBg31, 633);
    ctx.drawImage(ground.gr1, xPosBg30, 633+48);
    ctx.drawImage(ground.gr1, xPosBg31, 633+48);

    // horizon lines
    ctx.drawImage(ground.hLine0, 0, 625);
    ctx.drawImage(ground.hLine1, 0, 673);

    // some spooky ghosts

    // first one
    if (ghost.yPosGhost0Counter === 0){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost0, ghost.yPosGhost0+4);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost0Counter = 1, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    if (ghost.yPosGhost0Counter === 1){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost0, ghost.yPosGhost0);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost0Counter = 2, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    if (ghost.yPosGhost0Counter === 2){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost0, ghost.yPosGhost0-4);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost0Counter = 3, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    if (ghost.yPosGhost0Counter === 3){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost0, ghost.yPosGhost0);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost0Counter = 0, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    ghost.xPosGhost0 -= speed * ghost.speedMultiplier0;

    // here's the second
    if (ghost.yPosGhost1Counter === 0){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost1, ghost.yPosGhost1+4);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost1Counter = 1, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    if (ghost.yPosGhost1Counter === 1){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost1, ghost.yPosGhost1);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost1Counter = 2, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    if (ghost.yPosGhost1Counter === 2){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost1, ghost.yPosGhost1-4);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost1Counter = 3, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    if (ghost.yPosGhost1Counter === 3){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost1, ghost.yPosGhost1);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost1Counter = 0, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    ghost.xPosGhost1 -= speed * ghost.speedMultiplier1;

    // ...and the third one
    if (ghost.yPosGhost2Counter === 0){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost2, ghost.yPosGhost2+4);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost2Counter = 1, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    if (ghost.yPosGhost2Counter === 1){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost2, ghost.yPosGhost2);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost2Counter = 2, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    if (ghost.yPosGhost2Counter === 2){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost2, ghost.yPosGhost2-4);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost2Counter = 3, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    if (ghost.yPosGhost2Counter === 3){
        ctx.drawImage(ghost.sprite0, ghost.xPosGhost2, ghost.yPosGhost2);
        if(!isGameStopped){
            setTimeout(() => ghost.yPosGhost2Counter = 0, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
    }
    ghost.xPosGhost2 -= speed * ghost.speedMultiplier2;

    // "It newer ends.mp3"
    if( ghost.xPosGhost0 < -40 ){
        ghost.xPosGhost0 = ghost.xPosGhost2 + random(600, 1400);
        ghost.yPosGhost0Counter = random(0, 3);
        ghost.speedMultiplier0 = (random(14, 16)/10 + 1)/2;
    }
    if( ghost.xPosGhost1 < -40 ){
        ghost.xPosGhost1 = ghost.xPosGhost0 + random(600, 1400);
        ghost.yPosGhost1Counter = random(0, 3);
        ghost.speedMultiplier1 = (random(14, 16)/10 + 1)/2;
    }
    if( ghost.xPosGhost2 < -40 ){
        ghost.xPosGhost2 = ghost.xPosGhost1 + random(600, 1400);
        ghost.yPosGhost2Counter = random(0, 3);
        ghost.speedMultiplier2 = (random(14, 16)/10 + 1)/2;
    }


    // ghosts shouldn't stack together
    if ( ghost.xPosGhost0 - ghost.xPosGhost2 < (speed + 2) * 28 + 80 ){
        ghost.speedMultiplier0 = ghost.speedMultiplier2;
    }
    if ( ghost.xPosGhost1 - ghost.xPosGhost0 < (speed + 2) * 28 + 80 ){
        ghost.speedMultiplier1 = ghost.speedMultiplier0;
    }
    if ( ghost.xPosGhost2 - ghost.xPosGhost1 < (speed + 2) * 28 + 80 ){
        ghost.speedMultiplier2 = ghost.speedMultiplier1;
    }


    // Run animation
    // Скорость анимации линейно зависит от скорости бега
    if(isHeroRun){
    if( heroSpriteCounter === 0) {
        ctx.drawImage(hero.sprite0, xPosHero, yPosHero);
        if(isHeroRun){
            setTimeout(() => heroSpriteCounter = 1, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
        else { clearTimeout()}
    }
    if( heroSpriteCounter === 1) {
        ctx.drawImage(hero.sprite1, xPosHero, yPosHero);
        if(isHeroRun){
           setTimeout(() => heroSpriteCounter = 2, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
        else { clearTimeout()}
    }
    if( heroSpriteCounter === 2) {
        ctx.drawImage(hero.sprite0, xPosHero, yPosHero);
        if(isHeroRun){
            setTimeout(() => heroSpriteCounter = 3, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
        else { clearTimeout()}
    }
    if( heroSpriteCounter === 3) {
        ctx.drawImage(hero.sprite2, xPosHero, yPosHero);
        if(isHeroRun){
            setTimeout(() => heroSpriteCounter = 0, 1000 / 60 * 10 / (( 3 + ( speed / 4 ) ) * 0.25) );
        }
        else { clearTimeout()}
    }
    }
    else{
        heroSpriteCounter = 1;
        ctx.drawImage(hero.sprite1, xPosHero, yPosHero);
    }

//Увеличение скорости при увеличении счёта
    if(score - scoreCounter > 50){
        speed+=2;
        scoreCounter = score;
    }




    score += speed/100;
    if (score > localBestScore) {
        localBestScore = Math.floor(score);
    }



    ctx.fillText("Score: ", 10, 50);
    ctx.fillText(Math.floor(score), 160, 50);
    ctx.fillText("Best: ", 10, 100);
    ctx.fillText(localBestScore, 128, 100);
    // ctx.fillText("xPosBg2: ", 5, 49);
    // ctx.fillText(xPosBg+bg.width, 80, 49);

    ctx.fillText("ver: 0.0.2b", 1034, 50);



    if ( (yPosHero + hero.sprite0.height) > ghost.yPosGhost0 ) {
        if ( (xPosHero + hero.sprite0.width - 2*8) > ghost.xPosGhost0 ) {
            if ( xPosHero + 10*8 < (ghost.xPosGhost0 + ghost.sprite0.width) ) {
                gameStop();
            }
        }
    }
    if ( (yPosHero + hero.sprite0.height) > ghost.yPosGhost1 ) {
        if ( (xPosHero + hero.sprite0.width - 2*8) > ghost.xPosGhost1 ) {
            if ( xPosHero + 10*8 < (ghost.xPosGhost1 + ghost.sprite0.width) ) {
                gameStop();
            }
        }
    }
    if ( (yPosHero + hero.sprite0.height) > ghost.yPosGhost2 ) {
        if ( (xPosHero + hero.sprite0.width - 2*8) > ghost.xPosGhost2 ) {
            if ( xPosHero + 10*8 < (ghost.xPosGhost2 + ghost.sprite0.width) ) {
                gameStop();
            }
        }
    }


   requestAnimationFrame(draw)

}



hero.sprite0.onload = isAssetsLoaded++;
hero.sprite1.onload = isAssetsLoaded++;
hero.sprite2.onload = isAssetsLoaded++;

bg.img0.onload = isAssetsLoaded++;
bg.img1.onload = isAssetsLoaded++;
bg.img2.onload = isAssetsLoaded++;
bg.img3.onload = isAssetsLoaded++;
bg.moon.onload = isAssetsLoaded++;

ground.gr0.onload = isAssetsLoaded++;
ground.gr1.onload = isAssetsLoaded++;
ground.hLine0.onload = isAssetsLoaded++;
ground.hLine1.onload = isAssetsLoaded++;

ghost.sprite0.onload = isAssetsLoaded++;

if (isAssetsLoaded === 13){draw()}

