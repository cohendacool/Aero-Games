let songs = [
    "aquatic-ambience.mp3",
    "wii-party.mp3",
    "wii-u-mii-maker.mp3",
    "frutiger-aero.mp3"
];

let songnames = [
    "Aquatic Ambience",
    "Wii Party Theme",
    "Wii U Mii Maker Theme",
    "Frutiger Aero"
];

const music = document.getElementById("music");
var musicplaying = true;

let currentIndex = -1;

function start() {
    shuffleSong();
    swapPage('menu');

    music.addEventListener('ended', shuffleSong);
}

function allowMusic(value) {
    musicplaying = value;

    if (!musicplaying) {
        music.pause();
    } else {
        shuffleSong();
    }
}

function shuffleSong() {
    if (!musicplaying) return;

    const musicsource = document.getElementById("musicsource");

    let index;

    do {
        index = Math.floor(Math.random() * songs.length);
    } while (index === currentIndex && songs.length > 1);

    currentIndex = index;

    musicsource.src = "assets/songs/" + songs[index];

    music.load();
    music.play();

    announceSong(songnames[index]);
}

function closeView() {
    const frame = document.getElementById("gameappframe");

    frame.src = "";

    allowMusic(true);
    swapPage('menu');
}

function openGame(gamesrc) {
    const frame = document.getElementById("gameappframe");

    frame.src = gamesrc;

    allowMusic(false);
    swapPage('view');
}

function toggleFullscreen() {
    const frame = document.getElementById("gameappframe");

    if (!document.fullscreenElement) {
        frame.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function announceSong(songname) {
    const nowplaying = document.getElementById("nowplaying");
    const songText = nowplaying.querySelector("h2");

    songText.textContent = "Now Playing: " + songname;

    nowplaying.classList.add("show");

    setTimeout(() => {
        nowplaying.classList.remove("show");
    }, 5000);
}

function swapPage(newPageId) {
    const currentPage = document.querySelector('.page.active');
    const newPage = document.getElementById(newPageId);

    if (currentPage === newPage) return;

    if (currentPage) {
        currentPage.classList.add('exit');
        currentPage.classList.remove('active');
    }

    setTimeout(() => {
        if (currentPage) currentPage.classList.remove('exit');

        newPage.classList.add('active');
    }, 400);
}

document.addEventListener("DOMContentLoaded", start);