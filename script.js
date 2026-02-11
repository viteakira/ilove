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

let state = {
  activated: false,
  clickCount: 0,
  typewriterInterval: null,
  cursorInterval: null,
  audioContext: null,
  statusTimeout: null,
  shownMessages: new Set(),
};

const elements = {
  heart: document.getElementById("pixelHeart"),
  heartContainer: document.getElementById("heartContainer"),
  terminal: document.getElementById("terminal"),
  terminalText: document.getElementById("terminalText"),
  cursor: document.getElementById("cursor"),
  prefix: document.getElementById("prefix"),
  statusBar: document.getElementById("statusBar"),
  statusHint: document.getElementById("statusHint"),
};

function renderHeart() {
  elements.heart.innerHTML = "";
  elements.heartContainer.classList.toggle("activated", state.activated);
  const heartPixels = [];
  HEART_SHAPE.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        heartPixels.push({ y, x });
      }
    });
  });
  heartPixels.reverse();

  const pixelsToFill = Math.min(state.clickCount, heartPixels.length);
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

  const intensity = Math.min(state.clickCount / 10, 1);
  elements.heart.classList.toggle("activated", state.activated);
  elements.heart.classList.toggle(
    "glowing",
    state.activated && intensity > 0.5,
  );
}

function playSound() {
  if (!state.audioContext) {
    state.audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
  }

  const ctx = state.audioContext;
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
  if (state.typewriterInterval) clearInterval(state.typewriterInterval);

  elements.prefix.style.display = message ? "inline" : "none";
  let index = 0;

  state.typewriterInterval = setInterval(() => {
    if (index < message.length) {
      elements.terminalText.textContent = message.slice(0, index + 1);
      index++;
    } else {
      clearInterval(state.typewriterInterval);
    }
  }, 50);
}

function startCursorBlink() {
  if (state.cursorInterval) clearInterval(state.cursorInterval);
  let isVisible = true;

  state.cursorInterval = setInterval(() => {
    isVisible = !isVisible;
    elements.cursor.classList.toggle("visible", isVisible);
    elements.cursor.classList.toggle("hidden", !isVisible);
  }, 400);
}

function getUnusedMessage() {
  const availableMessages = LOVE_MESSAGES.filter(
    (_, index) => !state.shownMessages.has(index),
  );

  if (availableMessages.length === 0) {
    state.shownMessages.clear();
    return LOVE_MESSAGES[0];
  }
  const randomIndex = Math.floor(Math.random() * availableMessages.length);
  const selectedMessage = availableMessages[randomIndex];
  const originalIndex = LOVE_MESSAGES.indexOf(selectedMessage);

  state.shownMessages.add(originalIndex);
  return selectedMessage;
}

function handleHeartClick() {
  state.clickCount++;
  if (!state.activated) {
    state.activated = true;
    elements.terminal.classList.remove("initializing");
    elements.terminal.classList.add("active");
    startCursorBlink();
  }

  const intensity = Math.min(state.clickCount / 10, 1);
  const heartbeatDuration = Math.max(1.6 - intensity * 0.4, 1.2);
  elements.heartContainer.style.setProperty(
    "--heartbeat-duration",
    `${heartbeatDuration}s`,
  );
  elements.heart.style.setProperty(
    "--heartbeat-duration",
    `${heartbeatDuration}s`,
  );

  let message =
    state.clickCount > TOTAL_HEART_PIXELS
      ? "the way you love me... i can never get enough of it... and hope it will never ends... i love you so much kitten..."
      : getUnusedMessage();
  startTypewriter(message);

  playSound();

  renderHeart();

  updateStatusBar();
  setStatusHint("Loading...");
  if (state.statusTimeout) {
    clearTimeout(state.statusTimeout);
  }
  state.statusTimeout = setTimeout(() => {
    setStatusHint("Ready");
  }, 600);
}

function updateStatusBar() {
  elements.statusBar.textContent =
    state.clickCount === 0 ? "♥" : `${state.clickCount} ♥`;
}

function setStatusHint(message) {
  elements.statusHint.textContent = message;
}

function init() {
  renderHeart();
  elements.heartContainer.addEventListener("click", handleHeartClick);
  elements.terminal.classList.add("initializing");
  elements.cursor.classList.add("hidden");
  setStatusHint("Ready");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
