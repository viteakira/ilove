const LOVE_MESSAGES = [
  "the way you treat everyone with kindness...",
  "how genuine you are when complimenting others...",
  "how your mind works... it's like a christmas tree...",
  "your incredible creativity... i can never guess how you put together those stories...",
  "that you start humming when we are on the phone and not talking...",
  "how you start fumbling words when you get excited...",
  "how you fill your plate and make me eat half of it...",
  "the way you laugh... it literally brightens up my day...",
  "how beautiful you look with every makeup you apply... and send a picture to me...",
  "how gorgeous you look without any makeup...",
  "your fashion sense and the way you dress...",
  "the way you actually listen to me...",
  "the fact that you get excited for the things i love...",
  "how you get mad at me when i don't put on the bracelets you made...",
  "our inside jokes, they are really konik...",
  "how comfortable i feel around you...",
  "how you try to make me laugh when i'm down...",
  "how you go literally blind when you take off your glasses...",
  "that we can talk about anything forever without getting bored...",
  "that i can just sit and be there with you... without actually doing anything...",
  "how whenever we sit on the campus yard you sleep on my lap...",
  "how you always hold my hand... and that little gesture you make when you want me to hold your hand...",
  "how you trust me completely and don't think about where we are going while we are walking...",
  "how you give me your phone and 2 seconds later ask if your phone is in my pocket...",
  "the fact that you smell fucking amazing all the time...",
  "the way i feel when we hug... i never want to let go...",
  "the way i feel when we kiss... time stops and nothing else matters...",
  "how we can say 'BIZ' after seeing literally any two things beside each other...",
  "the fact that you called me at midnight and told me to wash the dishes when we get married...",
  "the softness of your skin... it feels like cookie dough i just wanna bite it...",
  "how you constantly want to hug me when we sleep together...",
  "how you do little things for me like adding my classes to the calendar...",
  "how you call me when you get stuck while gaming...",
  "how you talk about our future marriage and children... it makes me literally melt inside...",
  "how easily you can make friends with people...",
  "how delicious the brownies you make are... i love it crisp...",
  "our little routines like saying i love you and good night to each other every night...",
  "how you call me all the time and we talk about random stuff...",
  "how we laugh at each others objectively unfunny jokes...",
  "how you throw dishes in the garbage just so u don't have to wash them...",
];

const SONGS = [
  "killing-an-afternoon",
  "anirak",
  "g.o.a.t",
  "do-you-read-me",
  "philophobia",
  "good-looking",
  "telephone",
  "ates-edecek-misin",
  "super-ask-sarkisi",
  "melissa",
  "stress-relief",
  "origami",
  "from-the-gallows",
  "dilerim-ki",
  "hakkinda-her-seyi-duymak-istiyorum",
];

const HEART_SHAPE = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const PIXEL_SIZE = 20;
const TOTAL_HEART_PIXELS = 40;

const state = {
  activeTab: "heart",
  heart: {
    activated: false,
    clickCount: 0,
    typewriterInterval: null,
    cursorInterval: null,
    audioContext: null,
    statusTimeout: null,
    shownMessages: new Set(),
  },
  music: {
    songIndex: 0,
    isPlaying: false,
    volume: 0.7,
  },
};

const elements = {
  tabs: document.querySelectorAll(".browser-tab[data-tab]"),
  panels: document.querySelectorAll(".tab-panel"),
  addressInput: document.querySelector(".address-input"),
  statusBar: document.getElementById("statusBar"),
  statusHint: document.getElementById("statusHint"),
  heart: document.getElementById("pixelHeart"),
  heartContainer: document.getElementById("heartContainer"),
  terminal: document.getElementById("terminal"),
  terminalText: document.getElementById("terminalText"),
  cursor: document.getElementById("cursor"),
  prefix: document.getElementById("prefix"),
  musicContainer: document.getElementById("musicContainer"),
  musicState: document.getElementById("musicState"),
  playBtn: document.getElementById("play"),
  prevBtn: document.getElementById("prev"),
  nextBtn: document.getElementById("next"),
  audio: document.getElementById("audio"),
  progress: document.getElementById("progress"),
  progressContainer: document.getElementById("progressContainer"),
  musicTitle: document.getElementById("musicTitle"),
  currTime: document.getElementById("currTime"),
  durTime: document.getElementById("durTime"),
  volumeSlider: document.getElementById("volumeSlider"),
  volumeValue: document.getElementById("volumeValue"),
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function renderHeart() {
  elements.heart.innerHTML = "";
  elements.heartContainer.classList.toggle("activated", state.heart.activated);
  const heartPixels = [];

  HEART_SHAPE.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        heartPixels.push({ y, x });
      }
    });
  });

  heartPixels.reverse();

  const pixelsToFill = Math.min(state.heart.clickCount, heartPixels.length);
  const fillRatio = pixelsToFill / heartPixels.length;
  elements.heart.style.setProperty("--fill-ratio", fillRatio);

  HEART_SHAPE.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 0) return;
      const pixelIndex = heartPixels.findIndex((p) => p.y === y && p.x === x);
      const isFilled = pixelIndex < pixelsToFill;
      const pixel = document.createElement("div");
      pixel.className = `pixel ${isFilled ? "filled" : "empty"}`;
      pixel.style.left = `${x * PIXEL_SIZE}px`;
      pixel.style.top = `${y * PIXEL_SIZE}px`;
      elements.heart.appendChild(pixel);
    });
  });

  const intensity = Math.min(state.heart.clickCount / 10, 1);
  elements.heart.classList.toggle("activated", state.heart.activated);
  elements.heart.classList.toggle("glowing", state.heart.activated && intensity > 0.5);
}

function playClickBeep() {
  if (!state.heart.audioContext) {
    state.heart.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const ctx = state.heart.audioContext;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.frequency.value = 800;
  oscillator.type = "sine";
  gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
}

function startTypewriter(message) {
  if (state.heart.typewriterInterval) clearInterval(state.heart.typewriterInterval);

  elements.prefix.style.display = message ? "inline" : "none";
  let index = 0;

  state.heart.typewriterInterval = setInterval(() => {
    if (index < message.length) {
      elements.terminalText.textContent = message.slice(0, index + 1);
      index++;
    } else {
      clearInterval(state.heart.typewriterInterval);
    }
  }, 50);
}

function startCursorBlink() {
  if (state.heart.cursorInterval) clearInterval(state.heart.cursorInterval);
  let isVisible = true;

  state.heart.cursorInterval = setInterval(() => {
    isVisible = !isVisible;
    elements.cursor.classList.toggle("visible", isVisible);
    elements.cursor.classList.toggle("hidden", !isVisible);
  }, 400);
}

function getUnusedMessage() {
  const availableMessages = LOVE_MESSAGES.filter(
    (_, index) => !state.heart.shownMessages.has(index),
  );

  if (availableMessages.length === 0) {
    state.heart.shownMessages.clear();
    return LOVE_MESSAGES[0];
  }

  const randomIndex = Math.floor(Math.random() * availableMessages.length);
  const selectedMessage = availableMessages[randomIndex];
  const originalIndex = LOVE_MESSAGES.indexOf(selectedMessage);

  state.heart.shownMessages.add(originalIndex);
  return selectedMessage;
}

function updateHeartStatusBar() {
  elements.statusBar.textContent =
    state.heart.clickCount === 0 ? "♥" : `${state.heart.clickCount} ♥`;
}

function setStatusHint(message) {
  elements.statusHint.textContent = message;
}

function handleHeartClick() {
  state.heart.clickCount++;

  if (!state.heart.activated) {
    state.heart.activated = true;
    elements.terminal.classList.remove("initializing");
    elements.terminal.classList.add("active");
    startCursorBlink();
  }

  const intensity = Math.min(state.heart.clickCount / 10, 1);
  const heartbeatDuration = Math.max(1.6 - intensity * 0.4, 1.2);
  elements.heartContainer.style.setProperty("--heartbeat-duration", `${heartbeatDuration}s`);
  elements.heart.style.setProperty("--heartbeat-duration", `${heartbeatDuration}s`);

  const message =
    state.heart.clickCount > TOTAL_HEART_PIXELS
      ? "the way you love me... i can never get enough of it... and hope it will never ends... i love you so much kitten... happy valentines."
      : getUnusedMessage();

  startTypewriter(message);
  playClickBeep();
  renderHeart();
  updateHeartStatusBar();
  setStatusHint("Loading...");

  if (state.heart.statusTimeout) clearTimeout(state.heart.statusTimeout);
  state.heart.statusTimeout = setTimeout(() => {
    setStatusHint("Ready");
  }, 600);
}

function loadSong(song) {
  elements.musicTitle.textContent = song;
  elements.audio.src = `tracks/${song}.opus`;
}

function updateMusicButton() {
  elements.playBtn.textContent = state.music.isPlaying ? "||" : ">";
  elements.musicState.textContent = state.music.isPlaying ? "playing" : "paused";
}

function setMusicVolume(volume) {
  state.music.volume = clamp(volume, 0, 1);
  elements.audio.volume = state.music.volume;

  const volumePercent = Math.round(state.music.volume * 100);
  elements.volumeSlider.value = String(volumePercent);
  elements.volumeValue.textContent = `${volumePercent}%`;
  elements.volumeSlider.style.setProperty("--volume-percent", `${volumePercent}%`);
}

function playSong() {
  state.music.isPlaying = true;
  elements.musicContainer.classList.add("play");
  updateMusicButton();

  const playPromise = elements.audio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      state.music.isPlaying = false;
      elements.musicContainer.classList.remove("play");
      updateMusicButton();
    });
  }
}

function pauseSong() {
  state.music.isPlaying = false;
  elements.musicContainer.classList.remove("play");
  updateMusicButton();
  elements.audio.pause();
}

function prevSong() {
  state.music.songIndex--;
  if (state.music.songIndex < 0) {
    state.music.songIndex = SONGS.length - 1;
  }

  loadSong(SONGS[state.music.songIndex]);
  playSong();
  setStatusHint("Track changed");
}

function nextSong() {
  state.music.songIndex++;
  if (state.music.songIndex > SONGS.length - 1) {
    state.music.songIndex = 0;
  }

  loadSong(SONGS[state.music.songIndex]);
  playSong();
  setStatusHint("Track changed");
}

function updateProgress(event) {
  const { duration, currentTime } = event.srcElement;
  if (!duration || Number.isNaN(duration)) return;

  const progressPercent = (currentTime / duration) * 100;
  elements.progress.style.width = `${progressPercent}%`;
}

function setProgress(event) {
  const width = elements.progressContainer.clientWidth;
  const clickX = event.offsetX;
  const duration = elements.audio.duration;
  if (!duration || Number.isNaN(duration)) return;

  elements.audio.currentTime = (clickX / width) * duration;
}

function updateMusicTimes(event) {
  const { duration, currentTime } = event.srcElement;

  const currMin = Math.floor(currentTime / 60) || 0;
  const currSec = Math.floor(currentTime % 60) || 0;
  elements.currTime.textContent = `${currMin.toString().padStart(2, "0")}:${currSec
    .toString()
    .padStart(2, "0")}`;

  if (duration && !Number.isNaN(duration)) {
    const durMin = Math.floor(duration / 60);
    const durSec = Math.floor(duration % 60);
    elements.durTime.textContent = `${durMin.toString().padStart(2, "0")}:${durSec
      .toString()
      .padStart(2, "0")}`;
  } else {
    elements.durTime.textContent = "00:00";
  }
}

function switchTab(tabName) {
  state.activeTab = tabName;

  elements.tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle("active", isActive);
    tab.classList.toggle("inactive", !isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  elements.panels.forEach((panel) => {
    const shouldShow = panel.id === `${tabName}Panel`;
    panel.classList.toggle("active", shouldShow);
  });

  if (tabName === "heart") {
    elements.addressInput.value = "https://heart.local";
    updateHeartStatusBar();
    setStatusHint("Ready");
  } else if (tabName === "music") {
    elements.addressInput.value = "https://heart.local/music";
    elements.statusBar.textContent = "♪";
    setStatusHint("Jukebox ready");
  } else {
    elements.addressInput.value = "https://heart.local/memory-lane";
    elements.statusBar.textContent = "🏞";
    setStatusHint("Memory lane ready");
  }
}

function initHeart() {
  renderHeart();
  elements.heartContainer.addEventListener("click", handleHeartClick);
  elements.terminal.classList.add("initializing");
  elements.cursor.classList.add("hidden");
  setStatusHint("Ready");
}

function initMusic() {
  loadSong(SONGS[state.music.songIndex]);
  updateMusicButton();
  setMusicVolume(state.music.volume);

  elements.playBtn.addEventListener("click", () => {
    if (state.music.isPlaying) {
      pauseSong();
      setStatusHint("Paused");
    } else {
      playSong();
      setStatusHint("Playing");
    }
  });

  elements.prevBtn.addEventListener("click", prevSong);
  elements.nextBtn.addEventListener("click", nextSong);
  elements.audio.addEventListener("timeupdate", updateProgress);
  elements.audio.addEventListener("timeupdate", updateMusicTimes);
  elements.audio.addEventListener("ended", nextSong);
  elements.progressContainer.addEventListener("click", setProgress);
  elements.volumeSlider.addEventListener("input", (event) => {
    const volume = Number(event.target.value) / 100;
    setMusicVolume(volume);
    setStatusHint("Volume tuned");
  });
}

function initTabs() {
  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchTab(tab.dataset.tab);
    });
  });
}

function init() {
  initHeart();
  initMusic();
  initTabs();
  switchTab("heart");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
