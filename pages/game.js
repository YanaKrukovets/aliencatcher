import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const NAV_HEIGHT = 90;
const HUD_HEIGHT = 60;
const GAME_MAX_WIDTH = 800;

const LEVEL_COLORS = ["#64C8FF", "#CC88FF", "#FF6060", "#60FFC0", "#FFB84D", "#88DDFF", "#FF88CC", "#60FFB0"];
const getLevelColor = (lvl) => LEVEL_COLORS[(lvl - 1) % LEVEL_COLORS.length];

const LEVEL_PALETTES = [
  { bg: ["#06091c", "#0e1035", "#150d2e", "#1a0828"] }, // blue/indigo
  { bg: ["#110015", "#220030", "#2a0045", "#1a0030"] }, // deep violet
  { bg: ["#1a0008", "#2e0412", "#200210", "#150005"] }, // crimson void
  { bg: ["#001518", "#002835", "#001e28", "#001015"] }, // teal cosmos
  { bg: ["#1a0e00", "#2e1800", "#1e1200", "#100800"] }, // amber nebula
  { bg: ["#001020", "#001e3a", "#001530", "#000c20"] }, // arctic blue
  { bg: ["#1a0015", "#300025", "#250018", "#15000f"] }, // rose cosmos
  { bg: ["#05130d", "#0a2218", "#081a12", "#040e08"] }, // emerald space
];

function AlienIcon({ color = "#7CFC00" }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 30;
    const H = 36;
    let animId;
    let frame = 0;
    const bodyColor = "#6BEB00";

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;
      const legAnim = frame * 0.3;
      const armAnim = frame * 0.25;
      const antennaSwing = frame * 0.2;
      const blinkPhase = frame % 70;
      let eyeScale = 1;
      if (blinkPhase >= 60 && blinkPhase < 65) eyeScale = Math.max(0.1, 1 - (blinkPhase - 60) / 5);
      else if (blinkPhase >= 65 && blinkPhase < 70) eyeScale = (blinkPhase - 65) / 5;

      const cx = W / 2;

      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx - 4, 8);
      ctx.quadraticCurveTo(cx - 8 + Math.sin(antennaSwing) * 3, 2, cx - 8 + Math.sin(antennaSwing) * 5, 0);
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 4, 8);
      ctx.quadraticCurveTo(cx + 8 + Math.sin(antennaSwing + 1) * 3, 2, cx + 8 + Math.sin(antennaSwing + 1) * 5, 0);
      ctx.stroke();
      ctx.fillStyle = "#FFD700";
      ctx.beginPath(); ctx.arc(cx - 8 + Math.sin(antennaSwing) * 5, 0, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 8 + Math.sin(antennaSwing + 1) * 5, 0, 2.5, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = color;
      ctx.beginPath(); ctx.ellipse(cx, 12, 10, 11, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath(); ctx.ellipse(cx - 2, 10, 4, 5, 0, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "#FFF";
      ctx.beginPath(); ctx.ellipse(cx - 4, 12, 3.5, 4 * eyeScale, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 4, 12, 3.5, 4 * eyeScale, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#000";
      ctx.beginPath(); ctx.arc(cx - 4, 13, 2 * eyeScale, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 4, 13, 2 * eyeScale, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFF";
      ctx.beginPath(); ctx.arc(cx - 3, 12, 1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 5, 12, 1, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = "#000"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, 15, 4, 0.2, Math.PI - 0.2); ctx.stroke();

      ctx.fillStyle = bodyColor;
      ctx.beginPath(); ctx.roundRect(cx - 7, 20, 14, 10, 3); ctx.fill();

      const ao = Math.sin(armAnim) * 3;
      ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx - 7, 22); ctx.lineTo(cx - 11, 24 + ao); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 7, 22); ctx.lineTo(cx + 11, 24 - ao); ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(cx - 11, 24 + ao, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 11, 24 - ao, 2, 0, Math.PI * 2); ctx.fill();

      const lo = Math.sin(legAnim) * 2;
      ctx.beginPath(); ctx.moveTo(cx - 3, 30); ctx.lineTo(cx - 4, 34 + lo); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 3, 30); ctx.lineTo(cx + 4, 34 - lo); ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.ellipse(cx - 4, 34 + lo, 2.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 4, 34 - lo, 2.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [color]);

  return <canvas ref={ref} width={30} height={36} style={{ display: "block", width: 20, height: 24 }} />;
}

export default function Game() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [bullets, setBullets] = useState(10);
  const [lives, setLives] = useState(3);
  const [halfDamage, setHalfDamage] = useState(false);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [restartKey, setRestartKey] = useState(0);
  const [levelUpBanner, setLevelUpBanner] = useState(null);
  const [isMissionComplete, setIsMissionComplete] = useState(false);
  const [eggWasShot, setEggWasShot] = useState(false);
  const buyBulletsRef = useRef(false);
  const buyLivesRef = useRef(false);
  const soundEnabledRef = useRef(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);
  const bgGainRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !isGameOver) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [gameStarted, isGameOver]);

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setScore(0);
    setCoins(0);
    setBullets(10);
    setLives(3);
    setHalfDamage(false);
    setLevel(1);
    setIsGameOver(false);
    setIsMissionComplete(false);
    setEggWasShot(false);
    setCountdown(null);
    setLevelUpBanner(null);
    setRestartKey((k) => k + 1);
  };

  useEffect(() => {
    if (!gameStarted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ship.y = canvas.height - 100;
    };
    window.addEventListener("resize", handleResize);

    // ---- GAME STATE ----
    let scoreVal = 0;
    let coinsVal = 0;
    let bulletsVal = 10;
    let bulletsList = [];
    let shootCooldown = 0;
    let livesVal = 3;
    let levelVal = 1;
    let gameRunning = true;
    let invulnerable = false;
    let flashIntervalId = null;
    let keys = {};
    let rocks = [];
    let aliens = [];
    let particles = [];
    let stars = [];
    let nebulaClouds = [];
    let rockTimer = 9999; // spawn first rock immediately
    let animFrameId = null;
    let levelUpTimerId = null;
    let readyFrames = 180; // 3-second countdown at 60fps
    let lastCountdownShown = 3;
    setCountdown(3);

    const BULLET_BUY_COUNT = 5;
    const BULLET_BUY_COST = 30;
    let pauseFrames = 0;
    let buyFlashFrames = 0;
    let buyFlashText = "";
    let screenShakeFrames = 0;
    let screenShakeMag = 0;
    let floatingTexts = [];
    let engineTrails = [];
    let comboVal = 0;
    let comboDisplayTimer = 0;
    let spotlightAlien = null;
    let meteorStormFrames = 0;
    let meteorStormTimer = 0;
    let meteorStormSpawnTimer = 0;
    let meteorRocks = [];
    let meteorHalfDamage = false;
    let reverseAliens = [];
    let reverseAlienTimer = 0;
    let ufo = null;
    let ufoTimer = 0;
    let sosAlien = null;
    let sosAlienTimer = 0;
    let coinRainFrames = 0;
    let coinRainSpawnTimer = 0;
    let coinRainCoinsTimer = 0;
    let coinParticles = [];
    let gravityWell = null;
    let gravityWellTimer = 0;
    let lastEgg = null;
    let lastEggSpawned = false;
    let scrambleFrames = 0;
    let scrambleWarnFrames = 0;
    let scrambleTimer = 0;
    let damagedFrames = 0;
    let fireworksFrames = 0;
    let fireworkShells = [];
    let fireworkParticles = [];
    let winMusicActive = false;

    // ---- SOUNDS ----
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = audioCtx;
    const snd = (fn) => { if (soundEnabledRef.current) fn(); };

    const playShoot = () => snd(() => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.frequency.setValueAtTime(900, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);
      g.gain.setValueAtTime(0.22, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      o.start(audioCtx.currentTime); o.stop(audioCtx.currentTime + 0.08);
    });

    const playCatch = (isGolden, isQueen) => snd(() => {
      const freqs = isQueen ? [880, 1320, 1760] : isGolden ? [660, 990, 1320] : [880, 1108];
      freqs.forEach((freq, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = "sine"; o.frequency.value = freq;
        const t = audioCtx.currentTime + i * 0.07;
        g.gain.setValueAtTime(0.28, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        o.start(t); o.stop(t + 0.22);
      });
    });

    const playHit = () => snd(() => {
      const n = Math.floor(audioCtx.sampleRate * 0.18);
      const buf = audioCtx.createBuffer(1, n, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = audioCtx.createBufferSource(), g = audioCtx.createGain();
      src.buffer = buf; src.connect(g); g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.5, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      src.start(audioCtx.currentTime);
    });

    const playExplosion = () => snd(() => {
      const n = Math.floor(audioCtx.sampleRate * 0.25);
      const buf = audioCtx.createBuffer(1, n, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 0.6);
      const src = audioCtx.createBufferSource(), g = audioCtx.createGain();
      src.buffer = buf; src.connect(g); g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.38, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      src.start(audioCtx.currentTime);
    });

    const playMeteorExplosion = () => snd(() => {
      // big fiery boom: long shaped noise + low sub thud
      const dur = 0.45;
      const n = Math.floor(audioCtx.sampleRate * dur);
      const buf = audioCtx.createBuffer(1, n, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 0.4);
      const src = audioCtx.createBufferSource(), ng = audioCtx.createGain();
      src.buffer = buf; ng.gain.value = 0.55;
      src.connect(ng); ng.connect(audioCtx.destination);
      src.start(audioCtx.currentTime);

      const sub = audioCtx.createOscillator(), sg = audioCtx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(90, audioCtx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(28, audioCtx.currentTime + 0.18);
      sg.gain.setValueAtTime(0.7, audioCtx.currentTime);
      sg.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
      sub.connect(sg); sg.connect(audioCtx.destination);
      sub.start(audioCtx.currentTime); sub.stop(audioCtx.currentTime + 0.23);
    });

    const playMeteorImpact = () => snd(() => {
      // heavy ship-hit: deep sine thud + distorted noise crunch
      const sub = audioCtx.createOscillator(), sg = audioCtx.createGain();
      sub.type = "sawtooth";
      sub.frequency.setValueAtTime(120, audioCtx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.25);
      sg.gain.setValueAtTime(0.9, audioCtx.currentTime);
      sg.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      sub.connect(sg); sg.connect(audioCtx.destination);
      sub.start(audioCtx.currentTime); sub.stop(audioCtx.currentTime + 0.31);

      const n = Math.floor(audioCtx.sampleRate * 0.2);
      const buf = audioCtx.createBuffer(1, n, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = audioCtx.createBufferSource(), ng = audioCtx.createGain();
      src.buffer = buf; ng.gain.value = 0.45;
      src.connect(ng); ng.connect(audioCtx.destination);
      src.start(audioCtx.currentTime);
    });

    const playMeteorStormWarning = () => snd(() => {
      // deep rumble sweep: low sine rises then fades
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(40, audioCtx.currentTime);
      o.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.4);
      o.frequency.linearRampToValueAtTime(55, audioCtx.currentTime + 0.8);
      g.gain.setValueAtTime(0, audioCtx.currentTime);
      g.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.9);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(audioCtx.currentTime); o.stop(audioCtx.currentTime + 0.95);
    });

    const playLevelUp = () => snd(() => {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = "sine"; o.frequency.value = freq;
        const t = audioCtx.currentTime + i * 0.1;
        g.gain.setValueAtTime(0.28, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        o.start(t); o.stop(t + 0.28);
      });
    });

    const playRockHit = () => snd(() => {
      // metallic clank: high triangle ping + noise burst
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(480, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.06);
      g.gain.setValueAtTime(0.35, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(audioCtx.currentTime); o.stop(audioCtx.currentTime + 0.08);

      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.06, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const ns = audioCtx.createBufferSource(), ng = audioCtx.createGain();
      ns.buffer = buf; ng.gain.value = 0.18;
      ns.connect(ng); ng.connect(audioCtx.destination);
      ns.start(audioCtx.currentTime);
    });

    const playGameOver = () => snd(() => {
      [440, 370, 294, 220].forEach((freq, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = "sawtooth"; o.frequency.value = freq;
        const t = audioCtx.currentTime + i * 0.22;
        g.gain.setValueAtTime(0.22, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        o.start(t); o.stop(t + 0.45);
      });
    });

    const playWin = () => snd(() => {
      // Triumphant fanfare: rising chord arpeggio + sustained chords
      const fanfare = [523, 659, 784, 1047, 1319, 1568];
      fanfare.forEach((freq, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = "sine"; o.frequency.value = freq;
        const t = audioCtx.currentTime + i * 0.1;
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        o.start(t); o.stop(t + 0.6);
      });
      // Sustained harmony underneath
      [[523, 0.5], [659, 0.6], [784, 0.7]].forEach(([freq, delay]) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = "triangle"; o.frequency.value = freq;
        const t = audioCtx.currentTime + delay;
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
        o.start(t); o.stop(t + 1.2);
      });
    });

    // ---- BACKGROUND MUSIC ----
    const bgGain = audioCtx.createGain();
    bgGain.gain.value = soundEnabledRef.current ? 0.18 : 0;
    bgGain.connect(audioCtx.destination);
    bgGainRef.current = bgGain;

    // Helper: play a pitched note through bgGain
    const playBgNote = (freq, type, vol, dur) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type; o.frequency.value = freq;
      o.connect(g); g.connect(bgGain);
      g.gain.setValueAtTime(vol, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      o.start(audioCtx.currentTime); o.stop(audioCtx.currentTime + dur + 0.01);
    };

    // Kick: sine pitch-drop (150→40 Hz)
    const playBgKick = () => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(150, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.08);
      g.gain.setValueAtTime(0.8, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      o.connect(g); g.connect(bgGain);
      o.start(audioCtx.currentTime); o.stop(audioCtx.currentTime + 0.13);
    };

    // Snare: filtered white noise burst
    const playBgSnare = () => {
      const bufLen = Math.floor(audioCtx.sampleRate * 0.09);
      const buf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
      const src = audioCtx.createBufferSource(), sg = audioCtx.createGain();
      src.buffer = buf; sg.gain.value = 0.28;
      src.connect(sg); sg.connect(bgGain);
      src.start(audioCtx.currentTime);
    };

    // Hi-hat: very short noise tick
    const playBgHat = () => {
      const bufLen = Math.floor(audioCtx.sampleRate * 0.025);
      const buf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
      const src = audioCtx.createBufferSource(), hg = audioCtx.createGain();
      src.buffer = buf; hg.gain.value = 0.1;
      src.connect(hg); hg.connect(bgGain);
      src.start(audioCtx.currentTime);
    };

    // 4-bar supercycle: bars 0,2 = main melody A; bar 1 = variation B; bar 3 = fill C
    const PATTERN_CYCLE = [0, 1, 0, 2];

    // Each phase has 3 melody patterns, 2 bass lines, a counter-melody voice
    const MUSIC_PHASES = [
      { // Level 1-2: C major, bright, 155 BPM
        bpm: 155, hatEvery: 2,
        melodies: [
          [523,null,659,null,784,659,null,523, 440,null,523,null,659,784,659,null],   // A: bouncy C-E-G
          [784,659,784,null,1047,null,784,659, 587,null,698,587,null,523,587,null],   // B: high run
          [659,null,null,587,523,null,587,null, 659,null,523,null,440,null,392,null], // C: sparse answer
        ],
        bass: [
          [131,null,131,null,131,null,131,null, 110,null,110,null,131,null,131,null],       // root
          [131,165,null,196,null,175,165,null, 110,131,null,165,null,147,131,null],         // walking
        ],
        counter: { steps:[2,10], freqs:[1047,880], prob:0.55 },
        chords: [[523,659,784],[440,523,659]],
      },
      { // Level 3-5: D minor, tense, 168 BPM
        bpm: 168, hatEvery: 2,
        melodies: [
          [587,null,698,null,880,698,null,587, 523,null,587,null,698,880,698,null],
          [880,698,880,null,1047,null,880,698, 784,null,880,784,null,698,784,null],
          [698,null,null,659,587,null,659,null, 698,null,587,null,523,null,587,null],
        ],
        bass: [
          [147,null,147,null,147,null,147,null, 131,null,131,null,147,null,147,null],
          [147,175,null,220,null,196,175,null, 131,147,null,175,null,165,147,null],
        ],
        counter: { steps:[4,12], freqs:[1047,880], prob:0.5 },
        chords: [[587,698,880],[523,659,784]],
      },
      { // Level 6-9: E minor, urgent, 180 BPM
        bpm: 180, hatEvery: 1,
        melodies: [
          [659,784,659,null,988,784,659,null, 587,null,659,587,null,494,587,null],
          [988,null,784,988,null,880,784,null, 659,784,null,880,784,null,659,null],
          [784,659,null,784,659,null,784,null, 880,784,659,null,784,659,null,659],
        ],
        bass: [
          [165,null,165,null,196,null,196,null, 131,null,131,null,165,null,165,null],
          [165,196,null,247,null,220,196,null, 131,165,null,196,null,175,165,null],
        ],
        counter: { steps:[3,7,11,15], freqs:[1319,1047,988,1047], prob:0.4 },
        chords: [[659,784,988],[523,659,784]],
      },
      { // Level 10+: A minor, intense, 200 BPM
        bpm: 200, hatEvery: 1,
        melodies: [
          [880,null,1047,880,null,784,880,null, 659,880,null,784,659,null,587,null],
          [1047,988,880,784,880,null,659,null, 784,880,784,659,null,587,659,null],
          [659,784,880,null,1047,null,880,784, 659,null,784,null,880,784,null,659],
        ],
        bass: [
          [110,null,110,null,220,null,220,null, 110,null,110,null,131,null,131,null],
          [110,131,null,165,null,147,131,null, 110,131,null,165,null,175,131,null],
        ],
        counter: { steps:[1,5,9,13], freqs:[1319,1175,1047,1175], prob:0.6 },
        chords: [[440,523,659],[392,494,659]],
      },
    ];

    const getPhase = () => {
      if (levelVal <= 2) return MUSIC_PHASES[0];
      if (levelVal <= 5) return MUSIC_PHASES[1];
      if (levelVal <= 9) return MUSIC_PHASES[2];
      return MUSIC_PHASES[3];
    };

    let stepIdx = 0;
    let globalBar = 0;
    let currentPhaseIdx = -1;
    let melodyInterval = null;

    const WIN_MUSIC = {
      bpm: 188,
      melodies: [
        [1047,null,1319,null,1568,null,1319,1047, 1175,null,1047,null,1319,null,1568,null],
        [1568,1319,1047,null,1319,1568,1047,null, 1319,1047,null,880,1047,1319,null,1568],
        [1047,1175,1319,null,1568,1319,1175,null, 1047,null,1319,null,1568,null,1047,null],
      ],
      bass: [523,null,523,null,659,null,659,null, 523,null,440,null,523,null,659,null],
      chords: [[523,659,784,1047],[440,523,659,880],[349,440,523,659]],
      counter: [2093,null,2093,null,1760,null,1760,null, 2093,null,null,null,1568,null,null,null],
    };

    const scheduleStep = () => {
      if (winMusicActive) {
        const stepMs = Math.round(60000 / WIN_MUSIC.bpm / 2);
        const s = stepIdx % 16;
        if (soundEnabledRef.current) {
          const noteDur = stepMs / 1000 * 0.78;
          const mel = WIN_MUSIC.melodies[Math.floor(globalBar / 2) % 3];
          if (mel[s]) playBgNote(mel[s], "sine", 0.22, noteDur);
          if (WIN_MUSIC.counter[s]) playBgNote(WIN_MUSIC.counter[s], "triangle", 0.1, noteDur * 0.55);
          if (WIN_MUSIC.bass[s]) playBgNote(WIN_MUSIC.bass[s], "square", 0.17, noteDur * 1.1);
          if (s === 0 || s === 8) playBgKick();
          if (s === 4 || s === 12) playBgSnare();
          if (s === 2 || s === 6 || s === 10 || s === 14) playBgSnare();
          if (s % 2 === 0) playBgHat();
          if (s === 0 || s === 8) {
            WIN_MUSIC.chords[s === 0 ? 0 : s === 8 ? 1 : 2].forEach(f => playBgNote(f, "triangle", 0.09, noteDur * 1.5));
          }
        }
        stepIdx++;
        if (s === 15) globalBar++;
        melodyInterval = setTimeout(scheduleStep, stepMs);
        return;
      }

      const phase = getPhase();
      const stepMs = Math.round(60000 / phase.bpm / 2);
      const s = stepIdx % 16;
      const barInCycle = globalBar % 4;

      // Detect phase change — restart bar/step counters
      const newPhaseIdx = MUSIC_PHASES.indexOf(phase);
      if (newPhaseIdx !== currentPhaseIdx) {
        currentPhaseIdx = newPhaseIdx;
        stepIdx = 0;
        globalBar = 0;
      }

      if (!soundEnabledRef.current) {
        stepIdx++;
        if (s === 15) globalBar++;
        melodyInterval = setTimeout(scheduleStep, stepMs);
        return;
      }

      const noteDur = stepMs / 1000 * 0.82;
      const patIdx = PATTERN_CYCLE[barInCycle];
      const melody = phase.melodies[patIdx];
      const bass = phase.bass[(barInCycle === 1 || barInCycle === 3) ? 1 : 0];

      // Main melody (triangle = NES lead)
      if (melody[s]) playBgNote(melody[s], "triangle", 0.28, noteDur);

      // Counter-melody: a second voice on off-beat steps, adds call-and-response feel
      if (phase.counter.steps.includes(s) && Math.random() < phase.counter.prob) {
        const ci = phase.counter.steps.indexOf(s);
        playBgNote(phase.counter.freqs[ci], "sine", 0.1, noteDur * 0.65);
      }

      // Bass (square = punchy NES bass)
      if (bass[s]) playBgNote(bass[s], "square", 0.2, noteDur * 1.15);

      // Drums
      if (s === 0 || s === 8)  playBgKick();
      if (s === 4 || s === 12) playBgSnare();
      // Fill on bar 4: extra snare ghost notes
      if (barInCycle === 3 && (s === 6 || s === 14)) playBgSnare();
      if (s % phase.hatEvery === 0) playBgHat();

      // Chord stab on beats 1 & 3
      if (s === 0 || s === 8) {
        const chord = phase.chords[s === 0 ? 0 : 1];
        chord.forEach(f => playBgNote(f, "triangle", 0.07, noteDur * 1.3));
      }

      stepIdx++;
      if (s === 15) globalBar++;
      melodyInterval = setTimeout(scheduleStep, stepMs);
    };

    scheduleStep();

    const getRockInterval = () => {
      if (levelVal <= 1) return 160;
      if (levelVal <= 3) return 220;
      return Math.max(55, 200 - (levelVal - 1) * 20);
    };
    const getAlienSpeed = () => 1 + (levelVal - 1) * 0.2;
    const getRockSpeed = () => 0.8 + (levelVal - 1) * 0.2;

    const distantPlanets = [
      { x: 90, y: 90, radius: 34, color: "#c97bde", glowColor: "rgba(180,80,220,0.35)", rings: true },
      { x: canvas.width - 110, y: 130, radius: 22, color: "#5fc8c8", glowColor: "rgba(50,180,180,0.3)", rings: false },
      { x: canvas.width / 2 + 60, y: canvas.height - 130, radius: 18, color: "#f0a050", glowColor: "rgba(240,140,40,0.3)", rings: false },
    ];
    let shootingStars = [];
    let shootingStarTimer = 0;

    const ship = {
      x: canvas.width / 2 - 35,
      y: canvas.height - 100,
      width: 70,
      height: 50,
      speed: 6,
      flash: false,
      engineGlow: 0,
      tilt: 0,
      scale: 1,
      trailParticles: [],
    };

    const shipImg = new Image();
    let shipImgLoaded = false;
    shipImg.onload = () => { shipImgLoaded = true; };
    shipImg.src = "/images/pages/game/spaceship.png";

    const rockImgLeft = new Image();
    let rockImgLeftLoaded = false;
    rockImgLeft.onload = () => { rockImgLeftLoaded = true; };
    rockImgLeft.src = "/images/pages/game/rock-left.png";

    const rockImgRight = new Image();
    let rockImgRightLoaded = false;
    rockImgRight.onload = () => { rockImgRightLoaded = true; };
    rockImgRight.src = "/images/pages/game/rock-right.png";

    // ---- INIT BACKGROUND ELEMENTS ----
    const starColors = ["#FFFFFF", "#C8E6FF", "#FFE8A0", "#E8C8FF", "#A0FFE8", "#FFB0B0"];
    // Layer 0: slow/tiny, Layer 1: medium, Layer 2: fast/large+bright
    for (let i = 0; i < 160; i++) {
      const layer = i < 80 ? 0 : i < 130 ? 1 : 2;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: layer === 0 ? Math.random() * 1 + 0.3 : layer === 1 ? Math.random() * 1.5 + 0.8 : Math.random() * 2.5 + 1.5,
        speed: layer === 0 ? Math.random() * 0.15 + 0.05 : layer === 1 ? Math.random() * 0.3 + 0.15 : Math.random() * 0.6 + 0.3,
        brightness: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        bright: layer === 2 && Math.random() > 0.5,
      });
    }

    const nebulaColors = [
      "rgba(140,40,230,0.18)", "rgba(80,0,160,0.15)", "rgba(0,120,180,0.14)",
      "rgba(180,0,120,0.15)", "rgba(0,160,140,0.13)", "rgba(100,0,200,0.16)",
    ];
    for (let i = 0; i < 8; i++) {
      nebulaClouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 200 + 120,
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
        speed: Math.random() * 0.08 + 0.02,
      });
    }

    // ---- CLASSES ----

    class Rock {
      constructor() {
        this.isBoss = levelVal >= 10 && Math.random() < 0.3;
        this.width = this.isBoss ? 260 + Math.random() * 60 : 80 + Math.random() * 220;
        this.height = this.isBoss ? 160 + Math.random() * 40 : 70 + Math.random() * 50;
        this.hp = this.isBoss ? 5 : 1;
        this.maxHp = this.hp;
        // Spawn flush with left or right edge
        this.side = Math.random() > 0.5 ? "left" : "right";
        if (this.side === "left") {
          this.x = 0;
        } else {
          this.x = canvas.width - this.width;
        }
        this.y = -this.height;
        const speedVariance = levelVal >= 5 ? Math.random() * 0.6 : 0;
        this.speed = (this.isBoss ? 0.6 : getRockSpeed()) + speedVariance;
        const alienChance = levelVal === 1 ? 0.9 : levelVal === 2 ? 0.75 : 0.78;
        this.hasAlien = this.isBoss ? true : Math.random() < alienChance;
        const multiChance = levelVal === 2 ? 0.25 : levelVal === 3 ? 0.4 : levelVal >= 4 ? 0.55 : 0;
        this.alienCount = this.isBoss ? 5 + Math.floor(Math.random() * 2) : (this.hasAlien && Math.random() < multiChance ? (Math.random() < 0.4 ? 3 : 2) : 1);
        this.scale = 0;
        this.hitFlash = 0;
      }

      update() {
        this.y += this.speed;
        if (this.scale < 1) this.scale = Math.min(1, this.scale + 0.08);
        if (this.hitFlash > 0) this.hitFlash--;
      }

      draw() {
        const img = this.side === "left" ? rockImgLeft : rockImgRight;
        const loaded = this.side === "left" ? rockImgLeftLoaded : rockImgRightLoaded;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(this.scale, this.scale);

        if (this.isBoss) {
          // Pulsing red-orange glow
          const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.006);
          const glowR = ctx.createRadialGradient(0, 0, this.width * 0.2, 0, 0, this.width * 0.8);
          glowR.addColorStop(0, `rgba(255,80,0,${0.25 + pulse * 0.2})`);
          glowR.addColorStop(1, "rgba(255,0,0,0)");
          ctx.fillStyle = glowR;
          ctx.fillRect(-this.width * 0.8, -this.height * 0.8, this.width * 1.6, this.height * 1.6);
        }

        if (this.hitFlash > 0) {
          ctx.globalAlpha = 0.5 + 0.5 * (this.hitFlash / 8);
          ctx.filter = "brightness(4) saturate(0)";
        }

        if (loaded) {
          ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
          ctx.fillStyle = this.isBoss ? "#8a2a1a" : "#5a4a3a";
          ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }

        ctx.filter = "none";
        ctx.globalAlpha = 1;

        // HP bar for boss
        if (this.isBoss && this.hp < this.maxHp) {
          const bw = this.width * 0.8;
          const bx = -bw / 2;
          const by = this.height / 2 + 8;
          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.fillRect(bx - 1, by - 1, bw + 2, 10);
          const frac = this.hp / this.maxHp;
          const barColor = frac > 0.6 ? "#44ff44" : frac > 0.3 ? "#ffcc00" : "#ff3333";
          ctx.fillStyle = barColor;
          ctx.fillRect(bx, by, bw * frac, 8);
        }

        ctx.restore();
      }

      isOffScreen() { return this.y > canvas.height; }

      checkCollision(s) {
        // Bounding box early-out
        if (s.x + s.width < this.x || s.x > this.x + this.width ||
            s.y + s.height < this.y || s.y > this.y + this.height) return false;

        // Sample the rock's actual bottom edge at the ship's center x
        const cx = s.x + s.width / 2;
        const t = Math.max(0, Math.min(1, (cx - this.x) / this.width));
        // rock-left: full height at left (t=0), tapers to 0 at right (t=1)
        // rock-right: full height at right (t=1), tapers to 0 at left (t=0)
        const solidFraction = this.side === "left" ? (1 - t) : t;
        const rockBottom = this.y + this.height * solidFraction;

        return s.y < rockBottom && s.y + s.height > this.y;
      }
    }

    class Alien {
      constructor(rock, index = 0) {
        this.rock = rock;
        this.width = 30;
        this.height = 35;
        const spacing = 36;
        const baseX = rock.side === "right" ? rock.x + rock.width - 40 : rock.x + 10;
        this.x = baseX + index * spacing * (rock.side === "right" ? -1 : 1);
        this.y = rock.y - this.height;
        this.onRock = true;
        this.direction = rock.side === "right" ? -1 : 1;
        this.walkSpeed = getAlienSpeed();
        this.fallSpeed = 0;
        this.gravity = this.rock.speed * 0.07;
        this.scale = 1;
        this.legAnim = 0;
        this.armAnim = 0;
        this.antennaSwing = 0;
        this.blinkTimer = 0;
        this.eyeScale = 1;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.caught = false;
        this.catchScale = 1;
        this.expression = null;
        this.expressionTimer = 0;
        this.isGolden = levelVal >= 10 && Math.random() < 0.125;
        if (this.isGolden) { this.width = 45; this.height = 52; this.scale = 1.5; }
        this.color = this.isGolden ? "#FFD700" : ["#7CFC00", "#00FF7F", "#32CD32", "#ADFF2F"][Math.floor(Math.random() * 4)];
        this.sparkleTimer = 0;
        this.isQueen = levelVal >= 35 && !this.isGolden && Math.random() < 0.12;
        if (this.isQueen) {
          this.width = 60; this.height = 70; this.scale = 2;
          this.gravity = this.rock.speed * 0.015;
          this.walkSpeed = getAlienSpeed() * 0.2;
          this.color = "#FF69B4";
        }
      }

      update() {
        if (this.caught) {
          this.catchScale = Math.min(2, this.catchScale + 0.06);
          return;
        }

        if (this.onRock) {
          this.y = this.rock.y - this.height;
          if (this.rock.y < 0) return;
          this.x += this.direction * this.walkSpeed;
          this.legAnim += 0.3;
          this.armAnim += 0.25;
          this.antennaSwing += 0.2;

          if (this.x < this.rock.x || this.x + this.width > this.rock.x + this.rock.width) {
            this.onRock = false;
            this.fallSpeed = this.rock.speed * 0.5;
            this.rotationSpeed = this.direction * 0.1;
          }
        } else {
          this.fallSpeed += this.gravity;
          this.y += this.fallSpeed;
          this.rotation += this.rotationSpeed;
          this.armAnim += 0.4;
          this.antennaSwing += 0.3;
        }

        this.blinkTimer++;
        if (this.blinkTimer < 60) {
          this.eyeScale = 1;
        } else if (this.blinkTimer < 65) {
          this.eyeScale = Math.max(0.1, 1 - (this.blinkTimer - 60) / 5);
        } else if (this.blinkTimer < 70) {
          this.eyeScale = (this.blinkTimer - 65) / 5;
        } else {
          this.eyeScale = 1;
          this.blinkTimer = 0;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        const s = this.caught ? this.catchScale : this.scale;
        ctx.scale(s, s);
        ctx.translate(-this.width / 2, -this.height / 2);

        const cx = this.width / 2;

        ctx.strokeStyle = this.color; ctx.lineWidth = 2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(cx - 4, 8);
        ctx.quadraticCurveTo(cx - 8 + Math.sin(this.antennaSwing) * 3, 2, cx - 8 + Math.sin(this.antennaSwing) * 5, 0);
        ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 4, 8);
        ctx.quadraticCurveTo(cx + 8 + Math.sin(this.antennaSwing + 1) * 3, 2, cx + 8 + Math.sin(this.antennaSwing + 1) * 5, 0);
        ctx.stroke();
        ctx.fillStyle = "#FFD700";
        ctx.beginPath(); ctx.arc(cx - 8 + Math.sin(this.antennaSwing) * 5, 0, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 8 + Math.sin(this.antennaSwing + 1) * 5, 0, 2.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.ellipse(cx, 12, 10, 11, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath(); ctx.ellipse(cx - 2, 10, 4, 5, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = "#FFF";
        ctx.beginPath(); ctx.ellipse(cx - 4, 12, 3.5, 4 * this.eyeScale, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 4, 12, 3.5, 4 * this.eyeScale, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath(); ctx.arc(cx - 4, 13, 2 * this.eyeScale, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 4, 13, 2 * this.eyeScale, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#FFF";
        ctx.beginPath(); ctx.arc(cx - 3, 12, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 5, 12, 1, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = "#000"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, 15, 4, 0.2, Math.PI - 0.2); ctx.stroke();

        const bodyColor = this.color === "#7CFC00" ? "#6BEB00" : this.color === "#00FF7F" ? "#00EE6F" : this.color === "#32CD32" ? "#2BBD2B" : this.color === "#FFD700" ? "#E5C100" : this.color === "#FF69B4" ? "#CC3377" : "#9CEE2E";
        ctx.fillStyle = bodyColor;
        ctx.beginPath(); ctx.roundRect(cx - 7, 20, 14, 10, 3); ctx.fill();

        const ao = Math.sin(this.armAnim) * 3;
        ctx.strokeStyle = this.color; ctx.lineWidth = 3; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(cx - 7, 22); ctx.lineTo(cx - 11, 24 + ao); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 7, 22); ctx.lineTo(cx + 11, 24 - ao); ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(cx - 11, 24 + ao, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 11, 24 - ao, 2, 0, Math.PI * 2); ctx.fill();

        const lo = Math.sin(this.legAnim) * 2;
        ctx.beginPath(); ctx.moveTo(cx - 3, 30); ctx.lineTo(cx - 4, 34 + lo); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 3, 30); ctx.lineTo(cx + 4, 34 - lo); ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.ellipse(cx - 4, 34 + lo, 2.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 4, 34 - lo, 2.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();

        // Caught expression above head
        if (this.expression && this.expressionTimer > 0) {
          this.expressionTimer--;
          ctx.save();
          ctx.globalAlpha = Math.min(1, this.expressionTimer / 12);
          ctx.font = "15px Arial";
          ctx.textAlign = "center";
          ctx.fillText(this.expression, cx, -6);
          ctx.restore();
        }

        // Queen glow + crown
        if (this.isQueen) {
          const qPulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.005);
          const qr = ctx.createRadialGradient(cx, 17, 0, cx, 17, 18);
          qr.addColorStop(0, `rgba(255,105,180,${0.25 + qPulse * 0.15})`);
          qr.addColorStop(1, "rgba(255,105,180,0)");
          ctx.fillStyle = qr;
          ctx.beginPath(); ctx.arc(cx, 17, 18, 0, Math.PI * 2); ctx.fill();
          ctx.font = "9px Arial";
          ctx.textAlign = "center";
          ctx.fillText("👑", cx, -1);
        }

        // Golden sparkle ring
        if (this.isGolden) {
          this.sparkleTimer = (this.sparkleTimer || 0) + 0.12;
          for (let si = 0; si < 5; si++) {
            const angle = this.sparkleTimer + (si / 5) * Math.PI * 2;
            const sr = 22;
            const sx = cx + Math.cos(angle) * sr;
            const sy = 17 + Math.sin(angle) * sr;
            const ss = 1.5 + Math.sin(angle * 2 + this.sparkleTimer) * 0.8;
            ctx.fillStyle = `rgba(255,255,100,${0.6 + 0.4 * Math.sin(angle + this.sparkleTimer)})`;
            ctx.beginPath(); ctx.arc(sx, sy, ss, 0, Math.PI * 2); ctx.fill();
          }
        }

        ctx.restore();
      }

      isOffScreen() { return this.y > canvas.height; }
      isDoneBeingCaught() { return this.caught && this.catchScale >= 2; }

      checkCatch() {
        return this.x < ship.x + ship.width &&
               this.x + this.width > ship.x &&
               this.y + this.height > ship.y &&
               this.y < ship.y + ship.height;
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 30;
        this.color = color;
        this.size = 3;
      }
      update() { this.x += this.vx; this.y += this.vy; this.life--; this.size *= 0.95; }
      draw() {
        ctx.globalAlpha = this.life / 30;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
      }
    }

    class FireworkParticle {
      constructor(x, y, color, vx, vy, twinkle) {
        this.x = x; this.y = y;
        this.color = color;
        this.vx = vx; this.vy = vy;
        this.life = 60 + Math.random() * 55;
        this.maxLife = this.life;
        this.size = 1.8 + Math.random() * 3.5;
        this.gravity = 0.055 + Math.random() * 0.035;
        this.drag = 0.965;
        this.twinkle = twinkle;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.life--;
      }
      draw() {
        const a = Math.pow(this.life / this.maxLife, 1.4);
        ctx.globalAlpha = a;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 7;
        ctx.fillStyle = (this.twinkle && Math.floor(this.life * 0.5) % 3 === 0) ? "#FFFFFF" : this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    }

    class MeteorRock {
      constructor() {
        this.r = 5 + Math.random() * 10;
        this.x = this.r + Math.random() * (canvas.width - this.r * 2);
        this.y = -this.r * 2;
        this.speed = getRockSpeed() * (1.5 + Math.random() * 0.8);
        this.vx = (Math.random() - 0.5) * 0.7;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.035;
        this.jagged = Array.from({ length: 12 }, () => 0.72 + Math.random() * 0.52);
        this.shade = ["#7a4f1e", "#6b3d12", "#8a6030", "#5a3010"][Math.floor(Math.random() * 4)];
      }
      update() {
        this.y += this.speed;
        this.x += this.vx;
        this.rotation += this.rotSpeed;
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        // Fiery tail — multi-layer wisps for realism
        const tailLen = this.r * 3.5 + this.speed * 12;
        const t = Date.now() * 0.004;
        // Outer wide glow wisp
        const wispOuter = ctx.createLinearGradient(0, -this.r * 0.6, 0, -this.r - tailLen * 1.1);
        wispOuter.addColorStop(0, "rgba(255,60,0,0.45)");
        wispOuter.addColorStop(0.3, "rgba(255,120,0,0.2)");
        wispOuter.addColorStop(1, "rgba(255,80,0,0)");
        ctx.fillStyle = wispOuter;
        ctx.beginPath();
        ctx.moveTo(-this.r * 0.7, -this.r * 0.6);
        ctx.quadraticCurveTo(this.r * 0.4 * Math.sin(t), -this.r - tailLen * 0.5, 0, -this.r - tailLen * 1.1);
        ctx.quadraticCurveTo(-this.r * 0.4 * Math.sin(t + 1), -this.r - tailLen * 0.5, this.r * 0.7, -this.r * 0.6);
        ctx.closePath();
        ctx.fill();
        // Mid orange wisp
        const wispMid = ctx.createLinearGradient(0, -this.r * 0.5, 0, -this.r - tailLen * 0.8);
        wispMid.addColorStop(0, "rgba(255,140,0,0.7)");
        wispMid.addColorStop(0.4, "rgba(255,80,0,0.35)");
        wispMid.addColorStop(1, "rgba(255,50,0,0)");
        ctx.fillStyle = wispMid;
        ctx.beginPath();
        ctx.moveTo(-this.r * 0.45, -this.r * 0.5);
        ctx.quadraticCurveTo(-this.r * 0.3 * Math.sin(t * 1.3), -this.r - tailLen * 0.5, 0, -this.r - tailLen * 0.8);
        ctx.quadraticCurveTo(this.r * 0.3 * Math.sin(t * 1.3 + 2), -this.r - tailLen * 0.5, this.r * 0.45, -this.r * 0.5);
        ctx.closePath();
        ctx.fill();
        // Core bright yellow-white wisp
        const wispCore = ctx.createLinearGradient(0, -this.r * 0.3, 0, -this.r - tailLen * 0.55);
        wispCore.addColorStop(0, "rgba(255,240,180,0.95)");
        wispCore.addColorStop(0.25, "rgba(255,200,80,0.6)");
        wispCore.addColorStop(0.7, "rgba(255,120,0,0.2)");
        wispCore.addColorStop(1, "rgba(255,80,0,0)");
        ctx.fillStyle = wispCore;
        ctx.beginPath();
        ctx.moveTo(-this.r * 0.22, -this.r * 0.3);
        ctx.quadraticCurveTo(this.r * 0.18 * Math.sin(t * 1.7), -this.r - tailLen * 0.3, 0, -this.r - tailLen * 0.55);
        ctx.quadraticCurveTo(-this.r * 0.18 * Math.sin(t * 1.7 + 1.5), -this.r - tailLen * 0.3, this.r * 0.22, -this.r * 0.3);
        ctx.closePath();
        ctx.fill();
        // Outer glow
        const glow = ctx.createRadialGradient(0, 0, this.r * 0.2, 0, 0, this.r * 1.5);
        glow.addColorStop(0, "rgba(255,90,0,0.28)");
        glow.addColorStop(1, "rgba(255,40,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(0, 0, this.r * 1.5, 0, Math.PI * 2); ctx.fill();
        // Rock body (jagged polygon)
        ctx.fillStyle = this.shade;
        ctx.beginPath();
        const n = this.jagged.length;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          const r = this.r * this.jagged[i];
          if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath(); ctx.fill();
        // Surface highlight
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.beginPath(); ctx.ellipse(-this.r * 0.2, -this.r * 0.25, this.r * 0.28, this.r * 0.18, -0.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      isOffScreen() { return this.y - this.r > canvas.height; }
      checkCollision(s) {
        const cx = Math.max(s.x, Math.min(this.x, s.x + s.width));
        const cy = Math.max(s.y, Math.min(this.y, s.y + s.height));
        const dx = this.x - cx, dy = this.y - cy;
        return dx * dx + dy * dy < this.r * this.r * 0.65;
      }
      checkBulletHit(b) {
        const bcx = b.x + b.width / 2, bcy = b.y + b.height / 2;
        const dx = this.x - bcx, dy = this.y - bcy;
        return dx * dx + dy * dy < this.r * this.r * 1.4;
      }
    }

    class ReverseAlien {
      constructor() {
        this.width = 30; this.height = 35;
        this.x = 40 + Math.random() * (canvas.width - 80);
        this.y = canvas.height + 10;
        this.speed = 1.4 + Math.random() * 1.2;
        this.color = "#FF4488";
        this.antennaSwing = 0; this.armAnim = 0; this.legAnim = 0;
        this.eyeScale = 1; this.blinkTimer = 0;
      }
      update() {
        this.y -= this.speed;
        this.antennaSwing += 0.2; this.armAnim += 0.25; this.legAnim += 0.3;
        this.blinkTimer++;
        if (this.blinkTimer < 60) this.eyeScale = 1;
        else if (this.blinkTimer < 65) this.eyeScale = Math.max(0.1, 1 - (this.blinkTimer - 60) / 5);
        else if (this.blinkTimer < 70) this.eyeScale = (this.blinkTimer - 65) / 5;
        else { this.eyeScale = 1; this.blinkTimer = 0; }
      }
      draw() {
        const c = this.color;
        const cx_s = this.x + this.width / 2;
        const cy_s = this.y + this.height / 2;
        ctx.save();
        ctx.translate(cx_s, cy_s);
        ctx.rotate(Math.PI);
        ctx.translate(-this.width / 2, -this.height / 2);
        const cx = this.width / 2;
        ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(cx - 4, 8); ctx.quadraticCurveTo(cx - 8 + Math.sin(this.antennaSwing) * 3, 2, cx - 8 + Math.sin(this.antennaSwing) * 5, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 4, 8); ctx.quadraticCurveTo(cx + 8 + Math.sin(this.antennaSwing + 1) * 3, 2, cx + 8 + Math.sin(this.antennaSwing + 1) * 5, 0); ctx.stroke();
        ctx.fillStyle = "#FFD700";
        ctx.beginPath(); ctx.arc(cx - 8 + Math.sin(this.antennaSwing) * 5, 0, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 8 + Math.sin(this.antennaSwing + 1) * 5, 0, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.ellipse(cx, 12, 10, 11, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#FFF";
        ctx.beginPath(); ctx.ellipse(cx - 4, 12, 3.5, 4 * this.eyeScale, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 4, 12, 3.5, 4 * this.eyeScale, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath(); ctx.arc(cx - 4, 13, 2 * this.eyeScale, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 4, 13, 2 * this.eyeScale, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#CC3377";
        ctx.beginPath(); ctx.roundRect(cx - 7, 20, 14, 10, 3); ctx.fill();
        const ao = Math.sin(this.armAnim) * 3;
        ctx.strokeStyle = c; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx - 7, 22); ctx.lineTo(cx - 11, 24 + ao); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 7, 22); ctx.lineTo(cx + 11, 24 - ao); ctx.stroke();
        const lo = Math.sin(this.legAnim) * 2;
        ctx.beginPath(); ctx.moveTo(cx - 3, 30); ctx.lineTo(cx - 4, 34 + lo); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 3, 30); ctx.lineTo(cx + 4, 34 - lo); ctx.stroke();
        ctx.restore();
        // "SHOOT!" label above (screen space)
        ctx.save();
        ctx.font = "bold 11px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#FF4488";
        ctx.shadowColor = "#FF4488"; ctx.shadowBlur = 8;
        ctx.fillText("🎯 SHOOT!", cx_s, this.y - 6);
        ctx.shadowBlur = 0;
        ctx.restore();
      }
      isOffScreen() { return this.y + this.height < 0; }
      checkBulletHit(b) {
        return b.x < this.x + this.width && b.x + b.width > this.x &&
               b.y < this.y + this.height && b.y + b.height > this.y;
      }
    }

    class UFO {
      constructor() {
        this.fromLeft = Math.random() > 0.5;
        this.w = 110; this.h = 45;
        this.x = this.fromLeft ? -this.w : canvas.width;
        this.y = 85 + Math.random() * 80;
        this.speed = 1.3 + Math.random() * 0.8;
        this.beamPulse = 0; this.lightPhase = 0;
        this.hp = 15; this.maxHp = 15;
        this.hitFlash = 0;
      }
      update() {
        this.x += this.fromLeft ? this.speed : -this.speed;
        this.beamPulse += 0.08; this.lightPhase += 0.15;
        if (this.hitFlash > 0) this.hitFlash--;
      }
      checkBulletHit(b) {
        return b.x < this.x + this.w && b.x + b.width > this.x &&
               b.y < this.y + this.h && b.y + b.height > this.y;
      }
      draw() {
        const cx = this.x + this.w / 2;
        const cy = this.y + this.h / 2;
        ctx.save();
        ctx.translate(cx, cy);
        // Beam
        const beamBottom = canvas.height - cy;
        const beamAlpha = 0.10 + 0.07 * Math.sin(this.beamPulse * 3);
        const beamGrad = ctx.createLinearGradient(0, this.h / 4, 0, beamBottom);
        beamGrad.addColorStop(0, `rgba(100,255,180,${beamAlpha * 4})`);
        beamGrad.addColorStop(1, "rgba(100,255,180,0)");
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(-10, this.h / 4);
        ctx.lineTo(-35, beamBottom);
        ctx.lineTo(35, beamBottom);
        ctx.lineTo(10, this.h / 4);
        ctx.closePath(); ctx.fill();
        // Body
        const bodyGrad = ctx.createLinearGradient(0, -this.h / 4, 0, this.h / 4);
        if (this.hitFlash > 0) {
          bodyGrad.addColorStop(0, "#FFFFFF");
          bodyGrad.addColorStop(1, "#FF6666");
        } else {
          bodyGrad.addColorStop(0, "#AAEEFF");
          bodyGrad.addColorStop(1, "#4499CC");
        }
        ctx.fillStyle = bodyGrad;
        ctx.beginPath(); ctx.ellipse(0, 4, this.w / 2, this.h / 3, 0, 0, Math.PI * 2); ctx.fill();
        // Dome
        ctx.fillStyle = "#CCF0FF"; ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.ellipse(0, -2, this.w / 5, this.h / 2 * 0.85, 0, Math.PI, 0); ctx.fill();
        ctx.globalAlpha = 1;
        // Rim lights
        const rimColors = ["#FF4444", "#44FF44", "#4444FF", "#FFFF44", "#FF44FF"];
        for (let li = 0; li < 5; li++) {
          const a = (li / 5) * Math.PI * 2 + this.lightPhase;
          const lx = Math.cos(a) * (this.w / 2 - 8);
          const ly = 4 + Math.sin(a) * (this.h / 3 - 5);
          if (Math.sin(a) >= -0.3) {
            ctx.fillStyle = rimColors[li];
            ctx.shadowColor = rimColors[li]; ctx.shadowBlur = 6;
            ctx.beginPath(); ctx.arc(lx, ly, 3, 0, Math.PI * 2); ctx.fill();
          }
        }
        ctx.shadowBlur = 0;
        // HP bar (shows once damaged)
        if (this.hp < this.maxHp) {
          const barW = this.w * 0.8;
          const barH = 5;
          const barX = -barW / 2;
          const barY = -this.h / 2 - 12;
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(barX, barY, barW, barH);
          const hpRatio = this.hp / this.maxHp;
          const hpColor = hpRatio > 0.5 ? "#44FF88" : hpRatio > 0.25 ? "#FFCC00" : "#FF4444";
          ctx.fillStyle = hpColor;
          ctx.fillRect(barX, barY, barW * hpRatio, barH);
          ctx.strokeStyle = "rgba(255,255,255,0.4)";
          ctx.lineWidth = 1;
          ctx.strokeRect(barX, barY, barW, barH);
          ctx.font = "bold 9px Arial";
          ctx.textAlign = "center";
          ctx.fillStyle = "#fff";
          ctx.fillText(`${this.hp}/15`, 0, barY - 2);
        }
        ctx.restore();
      }
      isOffScreen() { return this.fromLeft ? this.x > canvas.width + this.w : this.x + this.w < 0; }
      getBeamBounds() { const cx = this.x + this.w / 2; return { xMin: cx - 32, xMax: cx + 32 }; }
    }

    class SOSAlien {
      constructor() {
        this.fromLeft = Math.random() > 0.5;
        this.width = 22; this.height = 26;
        this.x = this.fromLeft ? -this.width - 60 : canvas.width + 60;
        this.y = canvas.height - 170 - Math.random() * 80;
        this.speed = 1.0 + Math.random() * 0.8;
        this.color = "#FF8800";
        this.caught = false; this.catchScale = 1;
        this.antennaSwing = 0; this.armAnim = 0; this.signWave = 0;
      }
      update() {
        if (this.caught) { this.catchScale = Math.min(2, this.catchScale + 0.06); return; }
        this.x += this.fromLeft ? this.speed : -this.speed;
        this.antennaSwing += 0.2; this.armAnim += 0.25; this.signWave += 0.12;
      }
      draw() {
        const c = this.color;
        const hw = this.width / 2;
        const cx_s = this.x + hw;
        const cy_s = this.y + this.height / 2;
        ctx.save();
        ctx.translate(cx_s, cy_s);
        const s = this.caught ? this.catchScale : 1;
        ctx.scale(s, s);
        ctx.translate(-hw, -this.height / 2);
        // Antennae
        ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(hw - 3, 6); ctx.quadraticCurveTo(hw - 6 + Math.sin(this.antennaSwing)*2, 1, hw - 6 + Math.sin(this.antennaSwing)*3, -1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hw + 3, 6); ctx.quadraticCurveTo(hw + 6 + Math.sin(this.antennaSwing+1)*2, 1, hw + 6 + Math.sin(this.antennaSwing+1)*3, -1); ctx.stroke();
        ctx.fillStyle = "#FFD700";
        ctx.beginPath(); ctx.arc(hw - 6 + Math.sin(this.antennaSwing)*3, -1, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(hw + 6 + Math.sin(this.antennaSwing+1)*3, -1, 2, 0, Math.PI*2); ctx.fill();
        // Head
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.ellipse(hw, 9, 7, 8, 0, 0, Math.PI*2); ctx.fill();
        // Eyes
        ctx.fillStyle = "#FFF";
        ctx.beginPath(); ctx.ellipse(hw - 3, 9, 2.5, 2.8, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(hw + 3, 9, 2.5, 2.8, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath(); ctx.arc(hw - 3, 9.5, 1.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(hw + 3, 9.5, 1.5, 0, Math.PI*2); ctx.fill();
        // Body
        ctx.fillStyle = "#CC5500";
        ctx.beginPath(); ctx.roundRect(hw - 5, 15, 10, 7, 2); ctx.fill();
        // Arm + SOS sign
        const armDir = this.fromLeft ? 1 : -1;
        ctx.strokeStyle = c; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(hw + armDir * 5, 16); ctx.lineTo(hw + armDir * 11, 14 + Math.sin(this.armAnim)); ctx.stroke();
        const sx = hw + armDir * 12;
        const sy = 10 + Math.sin(this.signWave) * 2;
        ctx.fillStyle = "#FFFBE6"; ctx.strokeStyle = "#CC8800"; ctx.lineWidth = 1;
        ctx.fillRect(sx - 11, sy - 5, 22, 11);
        ctx.strokeRect(sx - 11, sy - 5, 22, 11);
        ctx.font = "bold 6px Arial"; ctx.textAlign = "center"; ctx.fillStyle = "#CC2200";
        ctx.fillText("SOS!", sx, sy + 2.5);
        // Legs
        ctx.strokeStyle = c; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(hw - 2, 22); ctx.lineTo(hw - 3, 26); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hw + 2, 22); ctx.lineTo(hw + 3, 26); ctx.stroke();
        ctx.restore();
      }
      checkCatch() {
        return !this.caught &&
               this.x < ship.x + ship.width && this.x + this.width > ship.x &&
               this.y + this.height > ship.y && this.y < ship.y + ship.height;
      }
      isDoneBeingCaught() { return this.caught && this.catchScale >= 2; }
      isOffScreen() { return this.fromLeft ? this.x > canvas.width + 60 : this.x + this.width < -60; }
    }

    class GravityWell {
      constructor() {
        this.radius = 230;
        this.strength = 0.7;
        this.x = 90 + Math.random() * (canvas.width - 180);
        this.y = 80 + Math.random() * (canvas.height - 260);
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.25 + 0.15;
        this.life = 300;
        this.maxLife = 300;
        this.angle = 0;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.angle += 0.025;
        if (this.x < 60 || this.x > canvas.width - 60) this.vx *= -1;
        if (this.y < 60 || this.y > canvas.height - 100) this.vy *= -1;
      }
      applyTo(cx, cy) {
        const dx = this.x - cx;
        const dy = this.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.radius && dist > 1) {
          const pull = this.strength * (this.radius / Math.max(dist, 40));
          return { ax: (dx / dist) * pull, ay: (dy / dist) * pull };
        }
        return { ax: 0, ay: 0 };
      }
      isDone() { return this.life <= 0; }
      draw() {
        const fadeIn  = Math.min(1, (this.maxLife - this.life) / 40);
        const fadeOut = Math.min(1, this.life / 40);
        const alpha   = Math.min(fadeIn, fadeOut);
        ctx.save();
        ctx.globalAlpha = alpha;

        // Gravitational lensing aura
        const aura = ctx.createRadialGradient(this.x, this.y, 16, this.x, this.y, this.radius);
        aura.addColorStop(0,   "rgba(90,0,160,0.55)");
        aura.addColorStop(0.4, "rgba(50,0,100,0.25)");
        aura.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = aura;
        ctx.fill();

        // Rotating accretion disk rings
        const diskColors = ["rgba(220,100,255,0.75)", "rgba(160,60,230,0.55)", "rgba(100,30,180,0.4)"];
        const diskRadii  = [38, 26, 17];
        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle + i * (Math.PI * 2 / 3));
          ctx.scale(1, 0.32);
          ctx.beginPath();
          ctx.arc(0, 0, diskRadii[i], 0, Math.PI * 2);
          ctx.strokeStyle = diskColors[i];
          ctx.lineWidth = 3 - i * 0.6;
          ctx.shadowColor = "#BB44FF";
          ctx.shadowBlur = 14;
          ctx.stroke();
          ctx.restore();
        }

        // Event horizon — black core with glow
        const core = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 20);
        core.addColorStop(0,   "rgba(0,0,0,1)");
        core.addColorStop(0.7, "rgba(8,0,18,0.98)");
        core.addColorStop(1,   "rgba(50,0,90,0.5)");
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.shadowColor = "#CC44FF";
        ctx.shadowBlur = 22;
        ctx.fill();
        ctx.strokeStyle = "rgba(210,110,255,0.9)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Countdown arc (last 2 seconds, turns orange → red)
        const lifeRatio = this.life / this.maxLife;
        if (lifeRatio < 0.4) {
          const r = Math.floor((1 - lifeRatio / 0.4) * 255);
          ctx.beginPath();
          ctx.arc(this.x, this.y, 24, -Math.PI / 2, -Math.PI / 2 + lifeRatio / 0.4 * Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${255 - r},0,0.85)`;
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    class LastEgg {
      constructor() {
        this.width = 76; this.height = 104;
        this.x = canvas.width / 2 - this.width / 2 + (Math.random() - 0.5) * 80;
        this.y = -this.height;
        this.vy = 0.42;
        this.wobble = 0;
        this.glowPhase = 0;
        this.arrowBounce = 0;
        this.sparkles = Array.from({ length: 8 }, (_, i) => ({
          angle: (i / 8) * Math.PI * 2, dist: 70 + Math.random() * 20, phase: Math.random() * Math.PI * 2
        }));
        this.caught = false;
        this.catchScale = 1;
        this.cracked = false;
        this.crackedFrames = 0;
        this.crackedRotation = 0;
        this.crackedAlpha = 1;
      }
      update() {
        if (this.cracked) {
          this.crackedFrames++;
          this.vy += 0.12;
          this.y += this.vy;
          this.crackedRotation += 0.07;
          this.crackedAlpha = Math.max(0, 1 - this.crackedFrames / 55);
          this.glowPhase += 0.05;
          return;
        }
        if (this.caught) { this.catchScale = Math.min(3, this.catchScale + 0.07); return; }
        this.y += this.vy;
        this.wobble += 0.025;
        this.x += Math.sin(this.wobble) * 0.55;
        this.glowPhase += 0.05;
        this.arrowBounce += 0.12;
      }
      draw() {
        if (this.cracked) {
          const cx = this.x + this.width / 2;
          const cy = this.y + this.height / 2 + 4;
          ctx.save();
          ctx.globalAlpha = this.crackedAlpha;
          ctx.translate(cx, cy);
          ctx.rotate(this.crackedRotation);
          ctx.translate(-cx, -cy);

          // Red danger glow
          ctx.shadowColor = "#FF2200";
          ctx.shadowBlur = 32 + Math.sin(this.glowPhase * 3) * 12;

          // Cracked egg body — dark orange-red tint
          const eggGrad = ctx.createRadialGradient(cx - 14, cy - 20, 6, cx, cy, this.height / 2);
          eggGrad.addColorStop(0, "#FFE082");
          eggGrad.addColorStop(0.35, "#FF8800");
          eggGrad.addColorStop(0.7, "#CC2200");
          eggGrad.addColorStop(1, "#660000");
          ctx.beginPath();
          ctx.ellipse(cx, cy, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = eggGrad;
          ctx.fill();

          // Heavy crack lines
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "#1a0000";
          ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(cx - 4, cy - 30); ctx.lineTo(cx + 10, cy - 8); ctx.lineTo(cx - 8, cy + 10); ctx.lineTo(cx + 4, cy + 30); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx + 18, cy - 18); ctx.lineTo(cx + 4, cy + 2); ctx.lineTo(cx + 20, cy + 22); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx - 22, cy - 10); ctx.lineTo(cx - 6, cy + 6); ctx.lineTo(cx - 18, cy + 26); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx - 10, cy - 28); ctx.lineTo(cx + 2, cy - 12); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx + 8, cy + 10); ctx.lineTo(cx - 4, cy + 28); ctx.stroke();

          // Red flash overlay
          const flashA = 0.25 + 0.2 * Math.sin(this.glowPhase * 6);
          ctx.beginPath();
          ctx.ellipse(cx, cy, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,0,0,${flashA})`;
          ctx.fill();

          ctx.restore();
          return;
        }

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2 + 4;
        const glow = 0.5 + 0.5 * Math.sin(this.glowPhase);
        const progress = Math.max(0, Math.min(1, this.y / (canvas.height - 120)));
        const alpha = this.caught ? Math.max(0, 1 - (this.catchScale - 1) / 2) : 1;
        ctx.save();
        if (this.caught) {
          ctx.translate(cx, cy);
          ctx.scale(this.catchScale, this.catchScale);
          ctx.translate(-cx, -cy);
          ctx.globalAlpha = alpha;
        }

        // Wide outer halo — very visible
        const haloR = 110 + glow * 24;
        const halo = ctx.createRadialGradient(cx, cy, 8, cx, cy, haloR);
        halo.addColorStop(0,   `rgba(255,240,60,${0.45 + glow * 0.25})`);
        halo.addColorStop(0.4, `rgba(80,255,160,${0.22 + glow * 0.14})`);
        halo.addColorStop(0.75,`rgba(255,180,0,${0.08 + glow * 0.06})`);
        halo.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.ellipse(cx, cy, haloR, haloR, 0, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Orbiting sparkles
        this.sparkles.forEach(sp => {
          const a = sp.angle + this.glowPhase * 0.6;
          const sx = cx + Math.cos(a) * sp.dist;
          const sy = cy + Math.sin(a) * sp.dist * 0.5;
          const sb = 0.5 + 0.5 * Math.sin(this.glowPhase * 2 + sp.phase);
          ctx.save();
          ctx.globalAlpha = alpha * (0.5 + 0.5 * sb);
          ctx.shadowColor = "#FFD700";
          ctx.shadowBlur = 8;
          ctx.fillStyle = sb > 0.5 ? "#FFFDE7" : "#FFD700";
          ctx.beginPath();
          ctx.arc(sx, sy, 3 + sb * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Egg body
        const eggGrad = ctx.createRadialGradient(cx - 14, cy - 20, 6, cx, cy, this.height / 2);
        eggGrad.addColorStop(0,    "#FFFDE7");
        eggGrad.addColorStop(0.3,  "#FFE082");
        eggGrad.addColorStop(0.68, "#F9A825");
        eggGrad.addColorStop(1,    "#E65100");
        ctx.shadowColor = `rgba(255,210,60,${0.7 + glow * 0.3})`;
        ctx.shadowBlur = 38 + glow * 22;
        ctx.beginPath();
        ctx.ellipse(cx, cy, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = eggGrad;
        ctx.fill();

        // Cracks — grow in as egg descends
        if (progress > 0.25) {
          const ca = Math.min(0.9, (progress - 0.25) / 0.45);
          ctx.globalAlpha = alpha * ca;
          ctx.strokeStyle = "#7B3F00";
          ctx.lineWidth = 2;
          ctx.shadowBlur = 0;
          ctx.beginPath(); ctx.moveTo(cx - 6, cy - 20); ctx.lineTo(cx + 6, cy - 2); ctx.lineTo(cx - 4, cy + 18); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx + 14, cy - 8); ctx.lineTo(cx + 8, cy + 14); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx - 16, cy + 4); ctx.lineTo(cx - 8, cy + 20); ctx.stroke();
          ctx.globalAlpha = alpha;
        }

        // Specular highlights
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.65)";
        ctx.beginPath();
        ctx.ellipse(cx - 18, cy - 22, 13, 19, -0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.beginPath();
        ctx.ellipse(cx + 12, cy - 8, 6, 9, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Inner glow pulse
        const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
        inner.addColorStop(0, `rgba(255,255,200,${0.35 + glow * 0.3})`);
        inner.addColorStop(1, "rgba(255,190,40,0)");
        ctx.beginPath();
        ctx.ellipse(cx, cy, 32, 40, 0, 0, Math.PI * 2);
        ctx.fillStyle = inner;
        ctx.fill();

        // "CATCH IT!" label above egg — big, pulsing, urgent
        if (!this.caught) {
          const labelY = this.y - 18;
          const pulse = 0.75 + 0.25 * Math.sin(this.glowPhase * 2);
          ctx.save();
          ctx.globalAlpha = alpha * pulse;
          ctx.shadowColor = "#FFD700";
          ctx.shadowBlur = 18;
          ctx.font = "bold 16px Arial";
          ctx.textAlign = "center";
          ctx.fillStyle = "#FFF176";
          ctx.fillText("⬇ CATCH IT! ⬇", cx, labelY);
          ctx.restore();

          // Bouncing arrow
          const arrowY = this.y - 50 + Math.sin(this.arrowBounce) * 8;
          ctx.save();
          ctx.globalAlpha = alpha * (0.6 + 0.4 * Math.sin(this.arrowBounce));
          ctx.shadowColor = "#FF4444";
          ctx.shadowBlur = 14;
          ctx.font = "bold 22px Arial";
          ctx.textAlign = "center";
          ctx.fillStyle = "#FF6666";
          ctx.fillText("▼", cx, arrowY);
          ctx.restore();
        }

        ctx.restore();
      }
      checkCatch() {
        if (this.caught) return false;
        const shipCx = ship.x + ship.width / 2;
        const eggCx  = this.x + this.width / 2;
        const eggBottom = this.y + this.height;
        return Math.abs(shipCx - eggCx) < 44 &&
               eggBottom > ship.y && this.y < ship.y + ship.height;
      }
      isDoneBeingCaught() { return this.caught && this.catchScale >= 3; }
      isOffScreen() { return this.y > canvas.height + 10; }
    }

    // ---- FIREWORK HELPERS ----

    const FW_PALETTES = [
      ["#FFD700","#FFF9A0"], ["#FF4466","#FF99BB"], ["#44AAFF","#AADDFF"],
      ["#44FF88","#AAFFCC"], ["#CC44FF","#DDAAFF"], ["#FF8800","#FFCCAA"], ["#FFFFFF","#CCE8FF"],
    ];
    const FW_TYPES = ["ring","chrysanthemum","star","willow","glitter"];

    function spawnFireworkShell() {
      const [c1, c2] = FW_PALETTES[Math.floor(Math.random() * FW_PALETTES.length)];
      return {
        x: 70 + Math.random() * (canvas.width - 140),
        y: canvas.height - 10,
        vy: -(12 + Math.random() * 6),
        vx: (Math.random() - 0.5) * 1.8,
        targetY: 50 + Math.random() * (canvas.height * 0.48),
        color: c1, color2: c2,
        trail: [],
        type: FW_TYPES[Math.floor(Math.random() * FW_TYPES.length)],
        exploded: false,
      };
    }

    function explodeShell(shell) {
      const count = { willow: 90, glitter: 100, ring: 72, star: 72, chrysanthemum: 80 }[shell.type] || 72;
      for (let k = 0; k < count; k++) {
        const angle = (k / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
        let spd, vx, vy;
        if (shell.type === "ring") {
          spd = 4.8 + (Math.random() - 0.5) * 0.7;
          vx = Math.cos(angle) * spd; vy = Math.sin(angle) * spd;
        } else if (shell.type === "star") {
          const pt = Math.floor(k / (count / 6)) % 2 === 0;
          spd = pt ? 5.5 + Math.random() * 2 : 2 + Math.random() * 1.5;
          vx = Math.cos(angle) * spd; vy = Math.sin(angle) * spd;
        } else if (shell.type === "willow") {
          spd = 2 + Math.random() * 5.5;
          vx = Math.cos(angle) * spd * 0.7; vy = Math.sin(angle) * spd - 2.5;
        } else if (shell.type === "glitter") {
          spd = Math.random() * 7;
          vx = Math.cos(Math.random() * Math.PI * 2) * spd; vy = -Math.random() * 5;
        } else { // chrysanthemum
          spd = 1.5 + Math.random() * 5.5;
          vx = Math.cos(angle) * spd; vy = Math.sin(angle) * spd;
        }
        const c = Math.random() > 0.35 ? shell.color : shell.color2;
        fireworkParticles.push(new FireworkParticle(shell.x, shell.y, c, vx, vy, Math.random() > 0.55));
      }
    }

    function drawFireworks() {
      // Rising shells + trails
      fireworkShells.forEach(shell => {
        shell.trail.forEach((t, i) => {
          ctx.globalAlpha = (i / shell.trail.length) * 0.55;
          ctx.shadowColor = shell.color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = shell.color;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.shadowColor = shell.color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(shell.x, shell.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      // Burst particles
      fireworkParticles.forEach(p => p.draw());
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // ---- DRAW ----

    function drawBackground() {
      const pal = LEVEL_PALETTES[(levelVal - 1) % LEVEL_PALETTES.length];
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0,   pal.bg[0]);
      grad.addColorStop(0.3, pal.bg[1]);
      grad.addColorStop(0.6, pal.bg[2]);
      grad.addColorStop(1,   pal.bg[3]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawStars() {
      // Nebula clouds
      nebulaClouds.forEach((cloud) => {
        cloud.y += cloud.speed;
        if (cloud.y > canvas.height + cloud.radius) { cloud.y = -cloud.radius; cloud.x = Math.random() * canvas.width; }
        const g = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
        const c = cloud.color;
        g.addColorStop(0,   c.replace(/[\d.]+\)$/, "0.22)"));
        g.addColorStop(0.4, c);
        g.addColorStop(0.8, c.replace(/[\d.]+\)$/, "0.06)"));
        g.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2); ctx.fill();
      });

      // Shooting stars
      shootingStarTimer++;
      if (shootingStarTimer > 180 + Math.random() * 300) {
        shootingStarTimer = 0;
        shootingStars.push({
          x: Math.random() * canvas.width * 0.8,
          y: Math.random() * canvas.height * 0.4,
          len: 80 + Math.random() * 80,
          speed: 8 + Math.random() * 6,
          life: 1,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        });
      }
      shootingStars = shootingStars.filter((s) => {
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= 0.03;
        if (s.life <= 0) return false;
        const tx = s.x - Math.cos(s.angle) * s.len;
        const ty = s.y - Math.sin(s.angle) * s.len;
        const sg = ctx.createLinearGradient(tx, ty, s.x, s.y);
        sg.addColorStop(0, "rgba(255,255,255,0)");
        sg.addColorStop(1, `rgba(255,255,255,${s.life * 0.9})`);
        ctx.strokeStyle = sg; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.stroke();
        return true;
      });

      // Planets with glow halos
      distantPlanets.forEach((planet) => {
        // Outer glow halo
        const halo = ctx.createRadialGradient(planet.x, planet.y, planet.radius * 0.8, planet.x, planet.y, planet.radius * 2.5);
        halo.addColorStop(0, planet.glowColor);
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(planet.x, planet.y, planet.radius * 2.5, 0, Math.PI * 2); ctx.fill();

        // Planet body
        const pg = ctx.createRadialGradient(planet.x - planet.radius*0.35, planet.y - planet.radius*0.35, planet.radius*0.05, planet.x, planet.y, planet.radius);
        pg.addColorStop(0, "rgba(255,255,255,0.5)");
        pg.addColorStop(0.2, planet.color);
        pg.addColorStop(1, "rgba(0,0,0,0.5)");
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2); ctx.fill();

        if (planet.rings) {
          ctx.strokeStyle = "rgba(220,200,255,0.35)"; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.ellipse(planet.x, planet.y, planet.radius*2, planet.radius*0.35, 0.3, 0, Math.PI*2); ctx.stroke();
          ctx.strokeStyle = "rgba(220,200,255,0.15)"; ctx.lineWidth = 8;
          ctx.beginPath(); ctx.ellipse(planet.x, planet.y, planet.radius*2.3, planet.radius*0.42, 0.3, 0, Math.PI*2); ctx.stroke();
        }
      });

      // Stars
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
        star.brightness += star.twinkleSpeed;
        const b = (Math.sin(star.brightness) + 1) / 2;
        const alpha = b * 0.85 + 0.15;
        ctx.globalAlpha = alpha;

        if (star.bright) {
          // Cross sparkle for bright stars
          const sg = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          sg.addColorStop(0, star.color); sg.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle = star.color; ctx.lineWidth = 0.5 * alpha;
          const arm = star.size * 5;
          ctx.beginPath(); ctx.moveTo(star.x - arm, star.y); ctx.lineTo(star.x + arm, star.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(star.x, star.y - arm); ctx.lineTo(star.x, star.y + arm); ctx.stroke();
        } else {
          const sg = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2.5);
          sg.addColorStop(0, star.color); sg.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI*2); ctx.fill();
        }
        ctx.fillStyle = star.color;
        ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    function drawShip() {
      ship.engineGlow += 0.15;

      const isMoving = keys["ArrowLeft"] || keys["a"] || keys["ArrowRight"] || keys["d"];
      const isMovingLeft = keys["ArrowLeft"] || keys["a"];
      const isMovingRight = keys["ArrowRight"] || keys["d"];
      const thrustMult = isMoving ? 1.6 : 1.0;

      // Subtle visual-only hover bob
      const bobY = Math.sin(ship.engineGlow * 0.55) * 2.5;

      // Flame flicker using harmonic sines
      const flicker = 0.88 + Math.sin(ship.engineGlow * 3.5) * 0.08 + Math.sin(ship.engineGlow * 7.3) * 0.04;
      const flameLen = (20 + Math.sin(ship.engineGlow * 4.2) * 5) * thrustMult;

      // Ion exhaust particles (cyan/blue/white)
      if (Math.random() > 0.6) {
        const spread = isMoving ? 16 : 10;
        const maxL = 30 + Math.floor(Math.random() * 20);
        ship.trailParticles.push({
          x: ship.x + ship.width / 2 + (Math.random() - 0.5) * spread,
          y: ship.y + ship.height + bobY,
          life: maxL,
          maxLife: maxL,
          vx: (Math.random() - 0.5) * 1.2,
          vy: 1.5 + Math.random() * 2,
          size: 1.5 + Math.random() * 2.5,
        });
      }

      ship.trailParticles = ship.trailParticles.filter((p) => {
        p.y += p.vy; p.x += p.vx; p.life--;
        const t = p.life / p.maxLife;
        ctx.globalAlpha = t * 0.8;
        const r = Math.floor(180 * t * t);
        const g2 = Math.floor(200 * t);
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        pg.addColorStop(0, `rgba(${r}, ${g2}, 255, 1)`);
        pg.addColorStop(1, "rgba(0, 60, 255, 0)");
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        return p.life > 0;
      });

      ctx.save();
      ctx.translate(ship.x + ship.width / 2, ship.y + ship.height / 2 + bobY);
      ctx.rotate(ship.tilt);
      ctx.scale(ship.scale, ship.scale);

      // Bottom of ship in local coords (center is 0,0)
      const ey = ship.height / 2;

      // --- ENGINE FLAME (drawn before ship image so it appears behind) ---

      // Outer diffuse glow blob
      const og = ctx.createRadialGradient(0, ey + flameLen * 0.4, 0, 0, ey + flameLen * 0.6, flameLen * 1.3);
      og.addColorStop(0, `rgba(60, 140, 255, ${0.4 * flicker})`);
      og.addColorStop(0.6, `rgba(0, 60, 200, ${0.15 * flicker})`);
      og.addColorStop(1, "rgba(0, 0, 80, 0)");
      ctx.fillStyle = og;
      ctx.beginPath(); ctx.ellipse(0, ey + flameLen * 0.5, flameLen * 0.9, flameLen * 1.3, 0, 0, Math.PI * 2); ctx.fill();

      // Outer flame teardrop
      const fOuter = ctx.createLinearGradient(0, ey, 0, ey + flameLen * 1.4);
      fOuter.addColorStop(0, "rgba(120, 200, 255, 0.6)");
      fOuter.addColorStop(0.5, "rgba(60, 120, 255, 0.35)");
      fOuter.addColorStop(1, "rgba(0, 30, 180, 0)");
      ctx.fillStyle = fOuter;
      ctx.beginPath();
      ctx.moveTo(-13, ey);
      ctx.quadraticCurveTo(-15, ey + flameLen * 0.7, 0, ey + flameLen * 1.4);
      ctx.quadraticCurveTo(15, ey + flameLen * 0.7, 13, ey);
      ctx.closePath(); ctx.fill();

      // Inner flame teardrop (brighter, narrower)
      const fInner = ctx.createLinearGradient(0, ey, 0, ey + flameLen);
      fInner.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      fInner.addColorStop(0.1, "rgba(210, 240, 255, 0.9)");
      fInner.addColorStop(0.35, `rgba(100, 200, 255, ${0.85 * flicker})`);
      fInner.addColorStop(0.7, `rgba(50, 100, 255, ${0.6 * flicker})`);
      fInner.addColorStop(1, "rgba(0, 40, 200, 0)");
      ctx.fillStyle = fInner;
      ctx.beginPath();
      ctx.moveTo(-7, ey);
      ctx.quadraticCurveTo(-8, ey + flameLen * 0.55, 0, ey + flameLen);
      ctx.quadraticCurveTo(8, ey + flameLen * 0.55, 7, ey);
      ctx.closePath(); ctx.fill();

      // Hot core spot at nozzle
      const hc = ctx.createRadialGradient(0, ey + 4, 0, 0, ey + 4, 9);
      hc.addColorStop(0, `rgba(255, 255, 255, ${flicker})`);
      hc.addColorStop(0.4, `rgba(180, 230, 255, ${0.8 * flicker})`);
      hc.addColorStop(1, "rgba(100, 200, 255, 0)");
      ctx.fillStyle = hc;
      ctx.beginPath(); ctx.arc(0, ey + 4, 9, 0, Math.PI * 2); ctx.fill();

      // --- SHIP IMAGE ---
      if (ship.flash) ctx.globalAlpha = 0.4;

      if (shipImgLoaded) {
        ctx.drawImage(shipImg, -ship.width / 2, -ship.height / 2, ship.width, ship.height);
      } else {
        ctx.save();
        ctx.translate(-ship.width / 2, -ship.height / 2);
        const g = ctx.createLinearGradient(ship.width / 2, 0, ship.width / 2, ship.height);
        g.addColorStop(0, "#5DADE2"); g.addColorStop(1, "#2874A6");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(ship.width / 2, 0);
        ctx.lineTo(ship.width - 5, ship.height - 10);
        ctx.quadraticCurveTo(ship.width / 2, ship.height - 5, 5, ship.height - 10);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1;

      // Side thruster glow when turning
      if (isMovingLeft) {
        const stg = ctx.createRadialGradient(ship.width / 2 - 4, ship.height / 4, 0, ship.width / 2 - 4, ship.height / 4, 13);
        stg.addColorStop(0, "rgba(100, 220, 255, 0.5)");
        stg.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = stg;
        ctx.beginPath(); ctx.arc(ship.width / 2 - 4, ship.height / 4, 13, 0, Math.PI * 2); ctx.fill();
      }
      if (isMovingRight) {
        const stg = ctx.createRadialGradient(-ship.width / 2 + 4, ship.height / 4, 0, -ship.width / 2 + 4, ship.height / 4, 13);
        stg.addColorStop(0, "rgba(100, 220, 255, 0.5)");
        stg.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = stg;
        ctx.beginPath(); ctx.arc(-ship.width / 2 + 4, ship.height / 4, 13, 0, Math.PI * 2); ctx.fill();
      }

      if (invulnerable) {
        const pulse = Math.sin(Date.now() * 0.015) * 4;
        ctx.strokeStyle = "rgba(100,200,255,0.6)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, 38 + pulse, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = "rgba(100,200,255,0.25)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, 46 + pulse, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.restore();
    }

    // ---- GAME LOGIC ----

    function loseLife() {
      if (invulnerable) return;
      livesVal--;
      invulnerable = true;
      damagedFrames = 270;
      playHit();
      setLives(livesVal);
      setHalfDamage(false);

      for (let i = 0; i < 30; i++) {
        particles.push(new Particle(ship.x+ship.width/2, ship.y+ship.height/2, ["#FF6B6B","#FF8C42","#FFD93D"][Math.floor(Math.random()*3)]));
      }

      if (flashIntervalId) clearInterval(flashIntervalId);
      let flashCount = 0;
      flashIntervalId = setInterval(() => {
        ship.flash = !ship.flash;
        if (++flashCount >= 10) {
          clearInterval(flashIntervalId);
          flashIntervalId = null;
          ship.flash = false;
          invulnerable = false;
        }
      }, 100);

      if (livesVal <= 0) endGame();
    }

    function endGame() {
      gameRunning = false;
      if (flashIntervalId) { clearInterval(flashIntervalId); flashIntervalId = null; }
      ship.flash = false;
      playGameOver();
      setIsGameOver(true);
    }

    function updateGame() {
      if (!gameRunning) return;

      // Handle buy-bullets request from UI button
      if (buyBulletsRef.current) {
        buyBulletsRef.current = false;
        if (coinsVal >= BULLET_BUY_COST) {
          coinsVal -= BULLET_BUY_COST;
          bulletsVal += BULLET_BUY_COUNT;
          setCoins(coinsVal);
          setBullets(bulletsVal);
          pauseFrames = 90;
          buyFlashFrames = 90;
          buyFlashText = "+ 5 bullets!";
        }
      }

      if (buyLivesRef.current) {
        buyLivesRef.current = false;
        if (coinsVal >= 120) {
          coinsVal -= 120;
          livesVal += 1;
          setCoins(coinsVal);
          setLives(livesVal);
          pauseFrames = 90;
          buyFlashFrames = 90;
          buyFlashText = "❤️ +1 life!";
        }
      }

      if (pauseFrames > 0) { pauseFrames--; return; }

      if (gravityWell) {
        const { ax } = gravityWell.applyTo(ship.x + ship.width / 2, ship.y + ship.height / 2);
        ship.x = Math.max(0, Math.min(canvas.width - ship.width, ship.x + ax * 0.018));
      }

      const scrambled = scrambleFrames > 0;
      const damaged = damagedFrames > 0;
      if (damaged) {
        damagedFrames--;
        // Random drift and speed penalty
        const drift = (Math.random() - 0.5) * 1.4;
        ship.x = Math.max(0, Math.min(canvas.width - ship.width, ship.x + drift));
      }
      // 30% chance input is swallowed while damaged (stutter)
      const inputBlocked = damaged && Math.random() < 0.3;
      const movingLeft  = !inputBlocked && (scrambled ? (keys["ArrowRight"] || keys["d"]) : (keys["ArrowLeft"]  || keys["a"]));
      const movingRight = !inputBlocked && (scrambled ? (keys["ArrowLeft"]  || keys["a"]) : (keys["ArrowRight"] || keys["d"]));
      const speedMult = damaged ? 0.45 : 1;
      if (movingLeft) {
        ship.x = Math.max(0, ship.x - ship.speed * speedMult);
        ship.tilt = Math.max(-0.2, ship.tilt - 0.03);
      } else if (movingRight) {
        ship.x = Math.min(canvas.width - ship.width, ship.x + ship.speed * speedMult);
        ship.tilt = Math.min(0.2, ship.tilt + 0.03);
      } else {
        ship.tilt *= 0.85;
      }

      // Engine trail particles
      if (movingLeft || movingRight) {
        const trailColors = ["#64C8FF", "#CC88FF", "#FF6060", "#60FFC0", "#FFB84D"];
        for (let i = 0; i < 2; i++) {
          engineTrails.push({
            x: ship.x + ship.width / 2 + (Math.random() - 0.5) * 24,
            y: ship.y + ship.height - 4,
            vx: (Math.random() - 0.5) * 1.2,
            vy: Math.random() * 2 + 0.8,
            life: 18 + Math.random() * 10,
            maxLife: 28,
            color: trailColors[Math.floor(Math.random() * trailColors.length)],
            size: Math.random() * 3 + 1,
          });
        }
      }
      engineTrails = engineTrails.filter((t) => { t.x += t.vx; t.y += t.vy; t.life--; return t.life > 0; });

      if (shootCooldown > 0) shootCooldown--;

      // Update bullets — move upward, check rock collisions
      for (let i = bulletsList.length - 1; i >= 0; i--) {
        const b = bulletsList[i];
        b.y -= b.speed;
        if (b.y + b.height < 0) { bulletsList.splice(i, 1); continue; }
        let hit = false;
        for (let j = rocks.length - 1; j >= 0; j--) {
          const rock = rocks[j];
          if (b.x < rock.x + rock.width && b.x + b.width > rock.x &&
              b.y < rock.y + rock.height && b.y + b.height > rock.y) {
            rock.hp--;
            rock.hitFlash = 8;
            if (rock.isBoss) {
              screenShakeFrames = 12;
              screenShakeMag = rock.hp > 0 ? 5 : 10;
            }
            if (rock.hp <= 0) {
              playExplosion();
              // Explode rock
              const pCount = rock.isBoss ? 55 : 22;
              for (let k = 0; k < pCount; k++) {
                particles.push(new Particle(
                  rock.x + rock.width / 2, rock.y + rock.height / 2,
                  rock.isBoss
                    ? ["#ff4400", "#ff8800", "#ffcc00", "#ff2200", "#ffffff"][Math.floor(Math.random() * 5)]
                    : ["#ff8844", "#ffbb44", "#ff6622", "#ffdd88"][Math.floor(Math.random() * 4)]
                ));
              }
              // Free aliens riding this rock
              aliens.forEach((a) => {
                if (a.rock === rock && a.onRock) {
                  a.onRock = false;
                  a.fallSpeed = 1;
                  a.rotationSpeed = a.direction * 0.1;
                }
              });
              rocks.splice(j, 1);
            } else {
              playRockHit();
            }
            hit = true;
            break;
          }
        }
        if (!hit) {
          for (let ri = reverseAliens.length - 1; ri >= 0; ri--) {
            const ra = reverseAliens[ri];
            if (ra.checkBulletHit(b)) {
              coinsVal += 25;
              setCoins(coinsVal);
              for (let k = 0; k < 22; k++) {
                particles.push(new Particle(ra.x + ra.width / 2, ra.y + ra.height / 2,
                  ["#FF4488", "#FF88CC", "#ffffff"][Math.floor(Math.random() * 3)]));
              }
              floatingTexts.push({ x: ra.x + ra.width / 2, y: ra.y, text: "+25 🎯", alpha: 1, vy: 1.8, color: "#FF88CC" });
              reverseAliens.splice(ri, 1);
              hit = true;
              break;
            }
          }
        }
        if (!hit) {
          for (let mi = meteorRocks.length - 1; mi >= 0; mi--) {
            if (meteorRocks[mi].checkBulletHit(b)) {
              const mr = meteorRocks[mi];
              for (let k = 0; k < 16; k++) {
                particles.push(new Particle(mr.x, mr.y, ["#ff8800", "#ffcc00", "#ff4400"][Math.floor(Math.random() * 3)]));
              }
              coinsVal += 5;
              setCoins(coinsVal);
              floatingTexts.push({ x: mr.x, y: mr.y, text: "+5", alpha: 1, vy: 1.2, color: "#ffcc00" });
              playMeteorExplosion();
              meteorRocks.splice(mi, 1);
              hit = true;
              break;
            }
          }
        }
        if (!hit && ufo) {
          if (ufo.checkBulletHit(b)) {
            ufo.hp--;
            ufo.hitFlash = 10;
            playRockHit();
            hit = true;
            if (ufo.hp <= 0) {
              playExplosion();
              screenShakeFrames = 25; screenShakeMag = 12;
              const ufoCx = ufo.x + ufo.w / 2;
              const ufoCy = ufo.y + ufo.h / 2;
              const expColors = ["#FF4400", "#FF8800", "#FFCC00", "#FF2200", "#FFFFFF", "#44CCFF", "#FF44FF"];
              for (let k = 0; k < 80; k++) {
                const p = new Particle(ufoCx, ufoCy, expColors[Math.floor(Math.random() * expColors.length)]);
                p.vx = (Math.random() - 0.5) * 14;
                p.vy = (Math.random() - 0.5) * 14;
                p.life = 45 + Math.floor(Math.random() * 35);
                p.size = 3 + Math.random() * 5;
                particles.push(p);
              }
              coinsVal += 300;
              setCoins(coinsVal);
              floatingTexts.push({ x: ufoCx, y: ufoCy - 20, text: "🛸 UFO DOWN! +300", alpha: 1, vy: 1.8, color: "#44CCFF" });
              ufo = null;
            }
          }
        }
        if (!hit && lastEgg && !lastEgg.caught && !lastEgg.cracked) {
          const ex = lastEgg.x, ey = lastEgg.y, ew = lastEgg.width, eh = lastEgg.height;
          if (b.x < ex + ew && b.x + b.width > ex && b.y < ey + eh && b.y + b.height > ey) {
            lastEgg.cracked = true;
            playExplosion();
            screenShakeFrames = 20; screenShakeMag = 9;
            for (let k = 0; k < 40; k++) {
              const p = new Particle(ex + ew / 2, ey + eh / 2,
                ["#F9A825","#FFE082","#E65100","#FFFDE7","#FF4400","#fff"][Math.floor(Math.random() * 6)]);
              p.vx = (Math.random() - 0.5) * 11;
              p.vy = (Math.random() - 0.5) * 11;
              p.life = 40 + Math.floor(Math.random() * 30);
              p.size = 2 + Math.random() * 4;
              particles.push(p);
            }
            floatingTexts.push({ x: ex + ew / 2, y: ey - 10, text: "💥 YOU SHOT THE EGG!", alpha: 1, vy: 1.1, color: "#FF4444", fontSize: 18 });
            setTimeout(() => { if (gameRunning) { endGame(); setEggWasShot(true); } }, 1500);
            hit = true;
          }
        }
        if (hit) bulletsList.splice(i, 1);
      }

      // Level 1→2 at 3 aliens caught, then every 5 after
      const newLevel = scoreVal < 3 ? 1 : Math.floor((scoreVal - 3) / 5) + 2;
      if (newLevel !== levelVal) {
        levelVal = newLevel;
        setLevel(levelVal);
        playLevelUp();
        setLevelUpBanner(levelVal);
        if (levelUpTimerId) clearTimeout(levelUpTimerId);
        levelUpTimerId = setTimeout(() => setLevelUpBanner(null), 1800);
      }

      // Periodic meteor storm (level 14+); interval shrinks every 2 levels above 15
      const stormInterval = Math.max(600, 1800 - Math.floor(Math.max(0, levelVal - 15) / 2) * 180);
      if (levelVal >= 1 && meteorStormFrames <= 0) {
        meteorStormTimer++;
        if (meteorStormTimer >= stormInterval) {
          meteorStormTimer = 0;
          if (Math.random() < 0.65) {
            meteorStormFrames = 600;
            screenShakeFrames = 30;
            screenShakeMag = 8;
            playMeteorStormWarning();
          }
        }
      }

      if (meteorStormFrames > 0) {
        meteorStormFrames--;
        meteorStormSpawnTimer++;
        if (meteorStormSpawnTimer >= 28) {
          meteorStormSpawnTimer = 0;
          const count = 2 + Math.floor(Math.random() * 2);
          const slots = count + 2;
          const laneW = canvas.width / slots;
          const skipSlot = Math.floor(Math.random() * slots);
          let spawned = 0;
          for (let mi = 0; mi < slots && spawned < count; mi++) {
            if (mi === skipSlot) continue;
            const mr = new MeteorRock();
            mr.x = laneW * (mi + 0.5) + (Math.random() - 0.5) * laneW * 0.3;
            meteorRocks.push(mr);
            spawned++;
          }
        }
      } else {
        rockTimer++;
        if (rockTimer >= getRockInterval()) {
          rockTimer = 0;
          const rock = new Rock();
          rocks.push(rock);
          if (rock.hasAlien) {
            for (let i = 0; i < rock.alienCount; i++) aliens.push(new Alien(rock, i));
            if (spotlightAlien === null) spotlightAlien = aliens[aliens.length - 1];
          }
        }
      }

      rocks = rocks.filter((rock) => {
        if (gravityWell) {
          const { ax, ay } = gravityWell.applyTo(rock.x + rock.width / 2, rock.y + rock.height / 2);
          rock.x += ax * 0.06;
          rock.y += ay * 0.06;
        }
        rock.update();
        if (!invulnerable && rock.checkCollision(ship)) loseLife();
        return !rock.isOffScreen();
      });

      meteorRocks = meteorRocks.filter((mr) => {
        mr.update();
        if (!invulnerable && mr.checkCollision(ship)) {
          if (meteorHalfDamage) {
            meteorHalfDamage = false;
            setHalfDamage(false);
            playMeteorImpact();
            loseLife();
          } else {
            meteorHalfDamage = true;
            setHalfDamage(true);
            playMeteorImpact();
            invulnerable = true;
            floatingTexts.push({ x: ship.x + ship.width / 2, y: ship.y - 10, text: "½ hit!", alpha: 1, vy: 1.2, color: "#ff8800" });
            setTimeout(() => { invulnerable = false; }, 800);
          }
        }
        return !mr.isOffScreen();
      });

      for (let i = aliens.length - 1; i >= 0; i--) {
        const alien = aliens[i];
        alien.update();

        if (alien.isDoneBeingCaught()) { aliens.splice(i, 1); continue; }

        if (!alien.caught && !alien.onRock && alien.checkCatch()) {
          alien.caught = true;
          playCatch(alien.isGolden, alien.isQueen);
          if (spotlightAlien === alien) spotlightAlien = null;
          scoreVal += 1;
          comboVal++;
          const multiplier = comboVal >= 3 ? 2 : 1;
          const coinReward = (alien.isQueen ? 150 : alien.isGolden ? 50 : 10) * multiplier;
          coinsVal += coinReward;
          setScore(scoreVal);
          setCoins(coinsVal);
          if (comboVal >= 3) comboDisplayTimer = 90;
          if (alien.isQueen) {
            coinRainFrames = 300;
            coinRainSpawnTimer = 0;
            coinRainCoinsTimer = 0;
            screenShakeFrames = 20; screenShakeMag = 6;
          }
          alien.expression = alien.isQueen ? "👑" : alien.isGolden ? "✨" : "⭐";
          alien.expressionTimer = 40;
          floatingTexts.push({
            x: alien.x + alien.width / 2,
            y: alien.y - 5,
            text: multiplier > 1 ? `+${coinReward} ×${multiplier}` : `+${coinReward}`,
            alpha: 1, vy: 1.8,
            color: alien.isGolden ? "#FFD700" : "#64C8FF",
          });
          const pCount = alien.isGolden ? 30 : 15;
          for (let j = 0; j < pCount; j++) {
            particles.push(new Particle(alien.x+10, alien.y+12, alien.isGolden ? ["#FFD700", "#FFF176", "#FFEE58", "#ffffff"][Math.floor(Math.random()*4)] : alien.color));
          }
        } else if (!alien.caught && alien.isOffScreen()) {
          if (!alien.onRock) comboVal = 0;
          if (spotlightAlien === alien) spotlightAlien = null;
          aliens.splice(i, 1);
        }
      }

      floatingTexts = floatingTexts.filter((ft) => { ft.y -= ft.vy; ft.vy *= 0.94; ft.alpha -= 0.022; return ft.alpha > 0; });
      particles = particles.filter((p) => { p.update(); return p.life > 0; });

      // Reverse aliens (level 17+)
      reverseAlienTimer++;
      if (levelVal >= 17 && reverseAlienTimer >= 320) {
        reverseAlienTimer = 0;
        reverseAliens.push(new ReverseAlien());
      }
      reverseAliens = reverseAliens.filter((ra) => { ra.update(); return !ra.isOffScreen(); });

      // UFO abductor (level 20+)
      ufoTimer++;
      if (levelVal >= 20 && !ufo && ufoTimer >= 440) {
        ufoTimer = 0;
        ufo = new UFO();
      }
      if (ufo) {
        ufo.update();
        const beam = ufo.getBeamBounds();
        for (let i = aliens.length - 1; i >= 0; i--) {
          const alien = aliens[i];
          if (!alien.caught && !alien.onRock) {
            const ax = alien.x + alien.width / 2;
            if (ax >= beam.xMin && ax <= beam.xMax) {
              floatingTexts.push({ x: ax, y: alien.y, text: "😱 ABDUCTED!", alpha: 1, vy: 1.4, color: "#88FFCC" });
              if (spotlightAlien === alien) spotlightAlien = null;
              comboVal = 0;
              aliens.splice(i, 1);
            }
          }
        }
        if (ufo.isOffScreen()) ufo = null;
      }

      // SOS alien (level 23+)
      sosAlienTimer++;
      if (levelVal >= 23 && !sosAlien && sosAlienTimer >= 520) {
        sosAlienTimer = 0;
        sosAlien = new SOSAlien();
      }
      if (sosAlien) {
        sosAlien.update();
        if (sosAlien.checkCatch()) {
          sosAlien.caught = true;
          coinsVal += 200;
          setCoins(coinsVal);
          const hColors = ["#FF1493", "#FF69B4", "#FF4081", "#FF0080", "#ffffff"];
          for (let k = 0; k < 50; k++) {
            const p = new Particle(sosAlien.x + sosAlien.width / 2, sosAlien.y + sosAlien.height / 2, hColors[Math.floor(Math.random() * 5)]);
            p.vx = (Math.random() - 0.5) * 9; p.vy = (Math.random() - 0.5) * 9; p.life = 55; p.size = 4 + Math.random() * 4;
            particles.push(p);
          }
          floatingTexts.push({ x: sosAlien.x + sosAlien.width / 2, y: sosAlien.y - 10, text: "❤️ +200!", alpha: 1, vy: 2, color: "#FF69B4" });
          screenShakeFrames = 15; screenShakeMag = 5;
        }
        if (sosAlien.isDoneBeingCaught() || sosAlien.isOffScreen()) sosAlien = null;
      }

      // Gravity well (level 35+)
      gravityWellTimer++;
      if (levelVal >= 35 && !gravityWell && gravityWellTimer >= 900) {
        gravityWellTimer = 0;
        gravityWell = new GravityWell();
        floatingTexts.push({ x: canvas.width / 2, y: canvas.height / 2 - 40, text: "⚫ GRAVITY WELL!", alpha: 1, vy: 1.2, color: "#CC44FF" });
      }
      if (gravityWell) {
        gravityWell.update();
        if (gravityWell.isDone()) gravityWell = null;
      }

      // Scrambled controls (level 37+)
      if (levelVal >= 37 && scrambleFrames <= 0 && scrambleWarnFrames <= 0) {
        scrambleTimer++;
        if (scrambleTimer >= 1200) {
          scrambleTimer = 0;
          scrambleWarnFrames = 180; // 3s warning
        }
      }
      if (scrambleWarnFrames > 0) {
        scrambleWarnFrames--;
        if (scrambleWarnFrames === 0) scrambleFrames = 300; // 5s active
      }
      if (scrambleFrames > 0) scrambleFrames--;

      // Last Egg — mission complete (level 50+)
      if (levelVal >= 50 && !lastEgg && !lastEggSpawned) {
        lastEggSpawned = true;
        lastEgg = new LastEgg();
        floatingTexts.push({ x: canvas.width / 2, y: canvas.height / 2 - 80, text: "🥚 THE LAST EGG!", alpha: 1, vy: 0.9, color: "#FFD700", fontSize: 28 });
        floatingTexts.push({ x: canvas.width / 2, y: canvas.height / 2 - 40, text: "CATCH IT TO COMPLETE THE MISSION!", alpha: 1, vy: 0.9, color: "#FFF176", fontSize: 16 });
      }
      if (lastEgg) {
        lastEgg.update();
        if (lastEgg.checkCatch()) {
          lastEgg.caught = true;
          const ecx = lastEgg.x + lastEgg.width / 2;
          const ecy = lastEgg.y + lastEgg.height / 2;
          playExplosion();
          playWin();
          winMusicActive = true;
          fireworksFrames = 108;
          screenShakeFrames = 30; screenShakeMag = 14;
          // Burst at catch point
          const expColors = ["#FFD700","#FFF9A0","#FF8C00","#FFFFFF","#90EE90","#00FF88","#AAFFCC"];
          for (let k = 0; k < 90; k++) {
            const angle = (k / 90) * Math.PI * 2;
            const spd = 3 + Math.random() * 9;
            fireworkParticles.push(new FireworkParticle(ecx, ecy, expColors[Math.floor(Math.random() * expColors.length)], Math.cos(angle) * spd, Math.sin(angle) * spd, true));
          }
          // Launch 3 shells immediately
          for (let i = 0; i < 3; i++) fireworkShells.push(spawnFireworkShell());
          coinsVal += 500;
          setCoins(coinsVal);
          setTimeout(() => { gameRunning = false; setIsMissionComplete(true); }, 1800);
        }
        if (lastEgg.isDoneBeingCaught()) lastEgg = null;
        if (lastEgg && lastEgg.isOffScreen()) { lastEgg = null; lastEggSpawned = false; }
      }

      // Fireworks (after catching last egg)
      if (fireworksFrames > 0) {
        fireworksFrames--;
        if (fireworksFrames % 16 === 0) fireworkShells.push(spawnFireworkShell());
      }
      // Update shells
      fireworkShells = fireworkShells.filter(s => !s.exploded);
      fireworkShells.forEach(shell => {
        shell.trail.push({ x: shell.x, y: shell.y });
        if (shell.trail.length > 12) shell.trail.shift();
        shell.x += shell.vx;
        shell.y += shell.vy;
        shell.vy += 0.22;
        if (shell.y <= shell.targetY || shell.vy >= -0.5) {
          explodeShell(shell);
          shell.exploded = true;
        }
      });
      // Update firework burst particles
      fireworkParticles = fireworkParticles.filter(p => p.life > 0);
      fireworkParticles.forEach(p => p.update());

      // Coin rain (after catching queen)
      if (coinRainFrames > 0) {
        coinRainFrames--;
        coinRainSpawnTimer++;
        if (coinRainSpawnTimer >= 5) {
          coinRainSpawnTimer = 0;
          coinParticles.push({ x: Math.random() * canvas.width, y: -8, vx: (Math.random() - 0.5) * 2.5, vy: 1.5 + Math.random() * 2.5, alpha: 1, size: 8 + Math.random() * 6, spin: Math.random() * Math.PI * 2, spinSpeed: 0.06 + Math.random() * 0.09 });
        }
        coinRainCoinsTimer++;
        if (coinRainCoinsTimer >= 8) { coinRainCoinsTimer = 0; coinsVal++; setCoins(coinsVal); }
      }
      coinParticles = coinParticles.filter((c) => { c.x += c.vx; c.y += c.vy; c.alpha -= 0.007; c.spin += c.spinSpeed; return c.alpha > 0 && c.y < canvas.height + 10; });
    }

    function drawBullets() {
      bulletsList.forEach((b) => {
        // Glow halo
        const glow = ctx.createRadialGradient(b.x + b.width / 2, b.y + b.height / 2, 0, b.x + b.width / 2, b.y + b.height / 2, 12);
        glow.addColorStop(0, "rgba(100,220,255,0.45)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(b.x + b.width / 2, b.y + b.height / 2, 12, 0, Math.PI * 2);
        ctx.fill();
        // Laser bolt
        const grad = ctx.createLinearGradient(b.x + b.width / 2, b.y + b.height, b.x + b.width / 2, b.y);
        grad.addColorStop(0, "rgba(100,220,255,0)");
        grad.addColorStop(0.4, "rgba(150,230,255,0.9)");
        grad.addColorStop(1, "rgba(255,255,255,1)");
        ctx.fillStyle = grad;
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });
    }

    function drawEngineTrails() {
      engineTrails.forEach((t) => {
        ctx.globalAlpha = (t.life / t.maxLife) * 0.65;
        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function drawFloatingTexts() {
      floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.font = `bold ${ft.fontSize || 15}px Arial`;
        ctx.textAlign = "center";
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = ft.fontSize ? 18 : 10;
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });
    }

    function drawComboDisplay() {
      if (comboDisplayTimer <= 0) return;
      comboDisplayTimer--;
      const alpha = comboDisplayTimer < 25 ? comboDisplayTimer / 25 : 1;
      const scale = comboDisplayTimer > 75 ? 1 + (comboDisplayTimer - 75) / 15 * 0.3 : 1;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(canvas.width / 2, canvas.height / 2 - 60);
      ctx.scale(scale, scale);
      ctx.font = "bold 26px Arial";
      ctx.textAlign = "center";
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "#FFD700";
      ctx.fillText(`× ${comboVal} COMBO!`, 0, 0);
      ctx.restore();
    }

    function drawMeteorStormBanner() {
      if (meteorStormFrames <= 0) return;
      const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.012);
      const fadeIn = Math.min(1, (600 - meteorStormFrames) / 30);
      const fadeOut = meteorStormFrames < 60 ? meteorStormFrames / 60 : 1;
      const alpha = Math.min(fadeIn, fadeOut) * pulse;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = "bold 22px Arial";
      ctx.textAlign = "center";
      ctx.shadowColor = "#FF4400";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#FF6622";
      ctx.fillText("☄️  METEOR STORM!", canvas.width / 2, 52);
      ctx.font = "13px Arial";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#ffaa88";
      const secs = Math.ceil(meteorStormFrames / 60);
      ctx.fillText(`${secs}s remaining — SURVIVE!`, canvas.width / 2, 72);
      ctx.restore();
    }

    function drawScrambleBanner() {
      if (scrambleWarnFrames <= 0 && scrambleFrames <= 0) return;
      ctx.save();
      ctx.textAlign = "center";
      if (scrambleWarnFrames > 0) {
        const blink = Math.floor(Date.now() / 200) % 2 === 0;
        ctx.globalAlpha = blink ? 1 : 0.35;
        ctx.font = "bold 24px Arial";
        ctx.shadowColor = "#FF2222";
        ctx.shadowBlur = 28;
        ctx.fillStyle = "#FF4444";
        ctx.fillText("⚡ CONTROLS JAMMED!", canvas.width / 2, 52);
        ctx.font = "13px Arial";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#ffaaaa";
        const secs = Math.ceil(scrambleWarnFrames / 60);
        ctx.fillText(`Activating in ${secs}s — brace yourself!`, canvas.width / 2, 72);
      } else {
        const pulse = 0.65 + 0.35 * Math.sin(Date.now() * 0.018);
        ctx.globalAlpha = pulse;
        ctx.font = "bold 24px Arial";
        ctx.shadowColor = "#FFAA00";
        ctx.shadowBlur = 28;
        ctx.fillStyle = "#FFD700";
        ctx.fillText("⚡ CONTROLS JAMMED!", canvas.width / 2, 52);
        ctx.font = "13px Arial";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#ffe8a0";
        const secs = Math.ceil(scrambleFrames / 60);
        ctx.fillText(`${secs}s — left is right, right is left!`, canvas.width / 2, 72);
      }
      ctx.restore();
    }

    function drawDamagedBanner() {
      if (damagedFrames <= 0) return;
      const secs = Math.ceil(damagedFrames / 60);
      const blink = Math.floor(Date.now() / 150) % 2 === 0;
      // Screen-edge static overlay
      ctx.save();
      ctx.globalAlpha = 0.07 + 0.05 * Math.sin(Date.now() * 0.04);
      for (let i = 0; i < 40; i++) {
        const sx = Math.random() * canvas.width;
        const sy = Math.random() * canvas.height;
        const sw = 2 + Math.random() * 80;
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,80,80,0.6)" : "rgba(255,255,255,0.3)";
        ctx.fillRect(sx, sy, sw, 1 + Math.random() * 2);
      }
      ctx.restore();
      // Banner text — sits below scramble banner area so they don't overlap
      ctx.save();
      ctx.textAlign = "center";
      ctx.globalAlpha = blink ? 1 : 0.55;
      ctx.font = "bold 18px Arial";
      ctx.shadowColor = "#FF3300";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "#FF6633";
      ctx.fillText("⚠ SYSTEMS DAMAGED!", canvas.width / 2, 98);
      ctx.font = "12px Arial";
      ctx.shadowBlur = 6;
      ctx.fillStyle = "#ffb09a";
      ctx.fillText(`Controls impaired — ${secs}s`, canvas.width / 2, 114);
      ctx.restore();
    }

    function drawReverseAliens() {
      reverseAliens.forEach((ra) => ra.draw());
    }

    function drawUFO() {
      if (ufo) ufo.draw();
    }

    function drawSOSAlien() {
      if (sosAlien) sosAlien.draw();
    }

    function drawCoinRain() {
      if (coinParticles.length === 0 && coinRainFrames <= 0) return;
      coinParticles.forEach((c) => {
        const spinX = Math.abs(Math.cos(c.spin));
        const rx = Math.max(0.5, c.size * spinX);
        const ry = c.size;
        const edgeH = Math.max(2, c.size * 0.28);
        ctx.save();
        ctx.globalAlpha = c.alpha;
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 12;
        // Rim / edge (3-D depth)
        if (spinX > 0.08) {
          ctx.beginPath();
          ctx.ellipse(c.x, c.y + edgeH, rx, ry, 0, 0, Math.PI * 2);
          ctx.fillStyle = "#9A6700";
          ctx.fill();
        }
        // Coin face with radial gradient
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, rx, ry, 0, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(c.x - rx * 0.3, c.y - ry * 0.3, ry * 0.08, c.x, c.y, Math.max(rx, ry));
        grad.addColorStop(0, "#FFF9A0");
        grad.addColorStop(0.45, "#FFD700");
        grad.addColorStop(1, "#B8860B");
        ctx.fillStyle = grad;
        ctx.fill();
        // "$" symbol — fades in when face-on
        if (spinX > 0.35) {
          ctx.save();
          ctx.globalAlpha = c.alpha * Math.min(1, (spinX - 0.35) / 0.4);
          ctx.fillStyle = "#7A4F00";
          ctx.font = `bold ${Math.floor(c.size * 1.15)}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("$", c.x, c.y + 1);
          ctx.restore();
        }
        // Specular highlight
        if (spinX > 0.15) {
          ctx.globalAlpha = c.alpha * 0.55 * spinX;
          ctx.beginPath();
          ctx.ellipse(c.x - rx * 0.28, c.y - ry * 0.28, rx * 0.38, ry * 0.28, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.75)";
          ctx.fill();
        }
        ctx.restore();
      });
      if (coinRainFrames > 0) {
        const alpha = coinRainFrames < 60 ? coinRainFrames / 60 : 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = "bold 22px Arial"; ctx.textAlign = "center";
        ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 20;
        ctx.fillStyle = "#FFD700";
        ctx.fillText("👑 COIN RAIN! 👑", canvas.width / 2, 95);
        ctx.restore();
      }
    }

    function drawLastEgg() {
      if (lastEgg) lastEgg.draw();
    }

    function drawGravityWell() {
      if (gravityWell) gravityWell.draw();
    }

    function drawSpotlight() {
      if (!spotlightAlien || spotlightAlien.onRock) return;
      const cx = spotlightAlien.x + spotlightAlien.width / 2;
      const cy = spotlightAlien.y + spotlightAlien.height / 2;
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.008);
      ctx.save();
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 14;
      ctx.globalAlpha = 0.5 + pulse * 0.4;
      ctx.beginPath();
      ctx.arc(cx, cy, 28 + pulse * 6, 0, Math.PI * 2);
      ctx.stroke();
      const arrowTip = spotlightAlien.y - 20 - pulse * 6;
      ctx.globalAlpha = 0.7 + pulse * 0.3;
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.moveTo(cx, arrowTip + 12);
      ctx.lineTo(cx - 7, arrowTip);
      ctx.lineTo(cx + 7, arrowTip);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawFrame() {
      drawBackground();
      drawStars();
      const shaking = screenShakeFrames > 0;
      if (shaking) {
        screenShakeFrames--;
        const dx = (Math.random() - 0.5) * screenShakeMag * 2;
        const dy = (Math.random() - 0.5) * screenShakeMag * 2;
        ctx.save();
        ctx.translate(dx, dy);
      }
      rocks.forEach((r) => r.draw());
      meteorRocks.forEach((mr) => mr.draw());
      drawLastEgg();
      drawGravityWell();
      drawSpotlight();
      aliens.forEach((a) => a.draw());
      drawReverseAliens();
      drawSOSAlien();
      particles.forEach((p) => p.draw());
      drawCoinRain();
      drawEngineTrails();
      drawUFO();
      drawBullets();
      drawShip();
      drawFloatingTexts();
      drawComboDisplay();
      drawMeteorStormBanner();
      drawScrambleBanner();
      drawDamagedBanner();
      if (shaking) ctx.restore();
      drawFireworks();
    }

    function gameLoop() {
      if (!gameRunning) return;

      if (readyFrames > 0) {
        readyFrames--;
        const n = Math.ceil(readyFrames / 60);
        if (n !== lastCountdownShown) { lastCountdownShown = n; setCountdown(n); }
        drawFrame();
        animFrameId = requestAnimationFrame(gameLoop);
        return;
      }
      if (lastCountdownShown !== -1) {
        lastCountdownShown = -1;
        setCountdown(0); // "GO!"
        setTimeout(() => setCountdown(null), 700);
      }

      updateGame();
      drawFrame();

      if (buyFlashFrames > 0) {
        buyFlashFrames--;
        const alpha = buyFlashFrames < 30 ? buyFlashFrames / 30 : 1;
        const cy = canvas.height / 2;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(100,200,255,0.9)";
        ctx.shadowBlur = 24;
        ctx.fillStyle = "#64C8FF";
        ctx.fillText(buyFlashText, canvas.width / 2, cy - 16);
        ctx.font = "14px Arial";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.shadowBlur = 0;
        ctx.fillText("PAUSED", canvas.width / 2, cy + 16);
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(gameLoop);
    }

    // ---- CONTROLS ----
    const onKeyDown = (e) => {
      keys[e.key] = true;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key) && gameRunning) {
        e.preventDefault();
      }
      if (e.key === " " && bulletsVal > 0 && shootCooldown <= 0 && gameRunning && readyFrames <= 0) {
        bulletsList.push({
          x: ship.x + ship.width / 2 - 2,
          y: ship.y - 10,
          width: 4,
          height: 16,
          speed: 13,
        });
        playShoot();
        bulletsVal--;
        setBullets(bulletsVal);
        shootCooldown = 12;
      }
    };
    const onKeyUp = (e) => { keys[e.key] = false; };

    const fireBullet = () => {
      if (bulletsVal > 0 && shootCooldown <= 0 && gameRunning && readyFrames <= 0) {
        bulletsList.push({
          x: ship.x + ship.width / 2 - 2,
          y: ship.y - 10,
          width: 4,
          height: 16,
          speed: 13,
        });
        playShoot();
        bulletsVal--;
        setBullets(bulletsVal);
        shootCooldown = 12;
      }
    };

    // Expose shoot to the HTML fire button
    canvas._fireBullet = fireBullet;

    const onTouchStart = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const relX = e.touches[0].clientX - rect.left;
      const relY = e.touches[0].clientY - rect.top;
      // Bottom-center zone (middle third, bottom 25%) → shoot
      if (relX > rect.width * 0.33 && relX < rect.width * 0.67 && relY > rect.height * 0.75) {
        fireBullet();
      } else if (relX < rect.width / 2) {
        keys["ArrowLeft"] = true; keys["ArrowRight"] = false;
      } else {
        keys["ArrowRight"] = true; keys["ArrowLeft"] = false;
      }
    };
    const onTouchEnd = (e) => {
      e.preventDefault();
      keys["ArrowLeft"] = false; keys["ArrowRight"] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

    const onWheel = (e) => e.preventDefault();
    window.addEventListener("wheel", onWheel, { passive: false });
    document.body.style.overflow = "hidden";

    animFrameId = requestAnimationFrame(gameLoop);

    return () => {
      gameRunning = false;
      cancelAnimationFrame(animFrameId);
      if (flashIntervalId) clearInterval(flashIntervalId);
      if (levelUpTimerId) clearTimeout(levelUpTimerId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("wheel", onWheel);
      document.body.style.overflow = "";
      clearTimeout(melodyInterval);
      audioCtx.close();
    };
  }, [restartKey, gameStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Alifallx: Don't Leave Them Behind</title>
        <meta name="description" content="Catch the falling Alifallx with your spaceship. Don't leave them behind!" />
      </Head>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes pulse-ring2 {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes spin-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float-title {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow-text {
          0%, 100% { text-shadow: 0 0 20px rgba(100,200,255,0.8), 0 0 40px rgba(100,200,255,0.4); }
          50% { text-shadow: 0 0 30px rgba(100,200,255,1), 0 0 60px rgba(100,200,255,0.6), 0 0 80px rgba(100,200,255,0.3); }
        }
        .play-btn:hover .play-circle {
          transform: scale(1.08);
          background: rgba(100,200,255,0.25);
        }
        .play-btn:hover .play-triangle {
          border-left-color: #fff;
        }
        .play-circle { transition: transform 0.2s ease, background 0.2s ease; }
        .play-triangle { transition: border-left-color 0.2s ease; }
        @keyframes countdown-pop {
          0% { transform: scale(0.4); opacity: 0; }
          40% { transform: scale(1.15); opacity: 1; }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes go-pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes level-up-anim {
          0%   { transform: scale(0.4) translateY(30px); opacity: 0; }
          18%  { transform: scale(1.08) translateY(0); opacity: 1; }
          38%  { transform: scale(1); opacity: 1; }
          75%  { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.92) translateY(-20px); opacity: 0; }
        }
        @keyframes level-up-sub {
          0%   { opacity: 0; letter-spacing: 12px; }
          20%  { opacity: 1; letter-spacing: 8px; }
          75%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes hud-danger {
          0%, 100% { box-shadow: 0 0 0px rgba(255,60,60,0); border-color: rgba(255,60,60,0.3); }
          50%       { box-shadow: 0 0 14px rgba(255,60,60,0.9); border-color: rgba(255,60,60,0.95); }
        }
        @keyframes hud-warn {
          0%, 100% { box-shadow: 0 0 0px rgba(255,160,0,0); border-color: rgba(180,100,255,0.3); }
          50%       { box-shadow: 0 0 12px rgba(255,160,0,0.85); border-color: rgba(255,160,0,0.9); }
        }
      `}</style>

      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        paddingTop: NAV_HEIGHT,
        boxSizing: "border-box",
        overflow: "hidden",
        alignItems: "center",
        background: "#05071a",
      }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: GAME_MAX_WIDTH,
        flex: 1,
        overflow: "hidden",
      }}>
        {/* HUD Bar */}
        <div style={{
          height: HUD_HEIGHT,
          background: "linear-gradient(90deg, #070b1f 0%, #12173a 40%, #12173a 60%, #070b1f 100%)",
          borderBottom: "2px solid rgba(100,200,255,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(0.4rem, 2vw, 1.4rem)",
          flexShrink: 0,
          userSelect: "none",
          fontFamily: "'Arial', sans-serif",
          padding: "0 8px",
        }}>
          {/* Aliens caught */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(100,200,255,0.1)", borderRadius: 8,
            padding: "5px 12px", border: "1px solid rgba(100,200,255,0.25)",
          }}>
            <AlienIcon />
            <span style={{ color: "#64C8FF", fontSize: 14, fontWeight: "bold", letterSpacing: 1 }}>
              <span style={{ color: "#fff", fontSize: 18 }}>{score}</span>
            </span>
          </div>

          {/* Coins */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,215,0,0.1)", borderRadius: 8,
            padding: "5px 12px", border: "1px solid rgba(255,215,0,0.3)",
          }}>
            <span style={{ fontSize: 16 }}>🪙</span>
            <span style={{ color: "#FFD700", fontSize: 14, fontWeight: "bold" }}>
              <span style={{ color: "#fff", fontSize: 18 }}>{coins}</span>
            </span>
          </div>

          {/* Bullets + buy button */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: bullets < 5 ? "rgba(255,100,0,0.13)" : "rgba(180,100,255,0.1)", borderRadius: 8,
            padding: "5px 10px", border: "1px solid rgba(180,100,255,0.3)",
            animation: bullets < 5 ? "hud-warn 0.9s ease-in-out infinite" : "none",
          }}>
            <span style={{ fontSize: 16 }}>🔫</span>
            <span style={{ color: bullets < 5 ? "#ffaa44" : "#cc88ff", fontSize: 14, fontWeight: "bold" }}>
              <span style={{ color: bullets === 0 ? "#ff4444" : bullets < 5 ? "#ffcc66" : "#fff", fontSize: 18, fontWeight: "bold" }}>{bullets}</span>
            </span>
            <button
              onClick={() => { buyBulletsRef.current = true; }}
              onKeyDown={(e) => e.preventDefault()}
              tabIndex={-1}
              disabled={coins < 30}
              title="Buy 5 bullets for 30 coins"
              style={{
                marginLeft: 4,
                background: coins >= 30 ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "rgba(80,80,80,0.4)",
                color: coins >= 30 ? "#fff" : "#666",
                border: "none",
                borderRadius: 5,
                padding: "2px 7px",
                fontSize: 11,
                fontWeight: "bold",
                cursor: coins >= 30 ? "pointer" : "default",
                letterSpacing: 0.5,
                lineHeight: "18px",
              }}
            >
              +5 / 🪙30
            </button>
          </div>

          {/* Lives */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: lives <= 1 ? "rgba(255,40,40,0.18)" : "rgba(255,107,107,0.1)", borderRadius: 8,
            padding: "5px 10px", border: "1px solid rgba(255,107,107,0.25)",
            animation: lives <= 1 ? "hud-danger 0.7s ease-in-out infinite" : "none",
          }}>
            <span style={{ fontSize: 16, letterSpacing: 1 }}>
              {"❤️".repeat(Math.max(0, lives))}
              {halfDamage && (
                <span style={{ position: "relative", display: "inline-block" }}>
                  🖤
                  <span style={{ position: "absolute", left: 0, top: 0, overflow: "hidden", width: "50%" }}>❤️</span>
                </span>
              )}
              {"🖤".repeat(Math.max(0, 3 - lives - (halfDamage ? 1 : 0)))}
            </span>
            <button
              onClick={() => { buyLivesRef.current = true; }}
              onKeyDown={(e) => e.preventDefault()}
              tabIndex={-1}
              disabled={coins < 120}
              title="Buy 1 life for 120 coins"
              style={{
                marginLeft: 4,
                background: coins >= 120 ? "linear-gradient(135deg,#e53e3e,#c05621)" : "rgba(80,80,80,0.4)",
                color: coins >= 120 ? "#fff" : "#666",
                border: "none",
                borderRadius: 5,
                padding: "2px 7px",
                fontSize: 11,
                fontWeight: "bold",
                cursor: coins >= 120 ? "pointer" : "default",
                letterSpacing: 0.5,
                lineHeight: "18px",
              }}
            >
              +1 / 🪙120
            </button>
          </div>

          {/* Level */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,215,0,0.07)", borderRadius: 8,
            padding: "5px 12px", border: "1px solid rgba(255,215,0,0.2)",
          }}>
            <span style={{ fontSize: 16 }}>⭐</span>
            <span style={{ color: "#FFD700", fontSize: 14, fontWeight: "bold" }}>
              <span style={{ color: "#fff", fontSize: 18 }}>{level}</span>
            </span>
          </div>

          {/* Mute */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              soundEnabledRef.current = next;
              if (bgGainRef.current && audioCtxRef.current) {
                bgGainRef.current.gain.setTargetAtTime(next ? 0.4 : 0, audioCtxRef.current.currentTime, 0.1);
              }
            }}
            onKeyDown={(e) => e.preventDefault()}
            tabIndex={-1}
            title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              padding: "5px 10px",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              color: "#fff",
            }}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
        </div>

        {/* Game Canvas */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <canvas
            ref={canvasRef}
            style={{ display: "block", width: "100%", height: "100%" }}
          />

          {/* Start Screen */}
          {!gameStarted && !isGameOver && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 20,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(180deg, #070b1f 0%, #12173a 50%, #1a0a2e 100%)",
              fontFamily: "'Arial', sans-serif",
              gap: 32,
            }}>
              {/* Stars bg dots */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    left: `${Math.sin(i * 2.5) * 50 + 50}%`,
                    top: `${Math.cos(i * 1.7) * 50 + 50}%`,
                    width: i % 5 === 0 ? 3 : 2,
                    height: i % 5 === 0 ? 3 : 2,
                    borderRadius: "50%",
                    background: "#fff",
                    opacity: 0.3 + (i % 4) * 0.15,
                  }} />
                ))}
              </div>

              {/* Title */}
              <div style={{
                animation: "float-title 3s ease-in-out infinite",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 14, letterSpacing: 6, color: "rgba(100,200,255,0.7)", marginBottom: 8, textTransform: "uppercase" }}>
                  Welcome to
                </div>
                <h1 style={{
                  margin: 0,
                  fontSize: "clamp(28px, 6vw, 48px)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: 4,
                  animation: "glow-text 2.5s ease-in-out infinite",
                  textTransform: "uppercase",
                }}>
                  Alifallx
                </h1>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8, letterSpacing: 2 }}>
                  Catch the falling aliens. Dodge the rocks.
                </div>
              </div>

              {/* Play Button */}
              <button
                className="play-btn"
                onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); setGameStarted(true); }}
                style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 0 }}
              >
                {/* Pulse rings */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  border: "2px solid rgba(100,200,255,0.6)",
                  animation: "pulse-ring 1.8s ease-out infinite",
                }} />
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  border: "2px solid rgba(100,200,255,0.4)",
                  animation: "pulse-ring2 1.8s ease-out infinite 0.4s",
                }} />
                {/* Spinning border */}
                <div style={{
                  position: "absolute", inset: -4, borderRadius: "50%",
                  background: "conic-gradient(from 0deg, rgba(100,200,255,0.8), rgba(180,100,255,0.8), rgba(100,200,255,0), rgba(100,200,255,0.8))",
                  animation: "spin-border 2s linear infinite",
                }} />
                {/* Inner mask for spinning border */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "#0d1230",
                  margin: 2,
                }} />
                {/* Circle */}
                <div className="play-circle" style={{
                  width: 90, height: 90, borderRadius: "50%",
                  background: "rgba(100,200,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  {/* Play triangle */}
                  <div className="play-triangle" style={{
                    width: 0, height: 0,
                    borderTop: "18px solid transparent",
                    borderBottom: "18px solid transparent",
                    borderLeft: "30px solid rgba(100,200,255,0.9)",
                    marginLeft: 8,
                  }} />
                </div>
              </button>

              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase" }}>
                Click to play
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textAlign: "center", lineHeight: 1.7 }}>
                ← → to move &nbsp;·&nbsp; SPACE to shoot<br/>
                Catch aliens for coins · Buy bullets in HUD
              </div>
            </div>
          )}


          {/* Level Up Banner */}
          {levelUpBanner !== null && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 14,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div key={levelUpBanner} style={{
                textAlign: "center",
                animation: "level-up-anim 1.8s ease forwards",
              }}>
                <div style={{
                  fontSize: 15,
                  letterSpacing: 8,
                  textTransform: "uppercase",
                  color: getLevelColor(levelUpBanner),
                  fontFamily: "'Arial', sans-serif",
                  fontWeight: 700,
                  textShadow: `0 0 24px ${getLevelColor(levelUpBanner)}`,
                  marginBottom: 2,
                  animation: "level-up-sub 1.8s ease forwards",
                }}>
                  Level Up!
                </div>
                <div style={{
                  fontSize: 108,
                  fontWeight: 900,
                  fontFamily: "'Arial', sans-serif",
                  color: "#fff",
                  lineHeight: 1,
                  textShadow: `0 0 40px ${getLevelColor(levelUpBanner)}, 0 0 90px ${getLevelColor(levelUpBanner)}88`,
                }}>
                  {levelUpBanner}
                </div>
              </div>
            </div>
          )}

          {/* Countdown overlay */}
          {countdown !== null && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 15,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div key={countdown} style={{
                fontSize: countdown === 0 ? 72 : 110,
                fontWeight: 900,
                color: countdown === 0 ? "#7CFC00" : "#fff",
                fontFamily: "'Arial', sans-serif",
                letterSpacing: countdown === 0 ? 6 : 0,
                textShadow: countdown === 0
                  ? "0 0 30px rgba(124,252,0,0.8), 0 0 60px rgba(124,252,0,0.4)"
                  : "0 0 30px rgba(100,200,255,0.8), 0 0 60px rgba(100,200,255,0.4)",
                animation: countdown === 0 ? "go-pop 0.7s ease forwards" : "countdown-pop 0.5s ease forwards",
              }}>
                {countdown === 0 ? "GO!" : countdown}
              </div>
            </div>
          )}

          {/* Game Over overlay */}
          {isGameOver && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 20,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(180deg, #070b1f 0%, #12173a 50%, #1a0a2e 100%)",
              fontFamily: "'Arial', sans-serif",
              gap: 28,
            }}>
              {/* Star dots — same as start screen */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    left: `${Math.sin(i * 2.5) * 50 + 50}%`,
                    top: `${Math.cos(i * 1.7) * 50 + 50}%`,
                    width: i % 5 === 0 ? 3 : 2,
                    height: i % 5 === 0 ? 3 : 2,
                    borderRadius: "50%",
                    background: "#fff",
                    opacity: 0.3 + (i % 4) * 0.15,
                  }} />
                ))}
              </div>

              {/* Title */}
              <div style={{ animation: "float-title 3s ease-in-out infinite", textAlign: "center" }}>
                <div style={{ fontSize: 13, letterSpacing: 6, color: "rgba(255,120,120,0.75)", marginBottom: 8, textTransform: "uppercase" }}>
                  {eggWasShot ? "You shot the egg" : "Mission failed"}
                </div>
                <h1 style={{
                  margin: 0,
                  fontSize: "clamp(28px, 6vw, 48px)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  textShadow: eggWasShot
                    ? "0 0 24px rgba(255,80,0,0.9), 0 0 50px rgba(255,80,0,0.45)"
                    : "0 0 24px rgba(100,200,255,0.9), 0 0 50px rgba(100,200,255,0.45)",
                  animation: "glow-text 2.5s ease-in-out infinite",
                }}>
                  {eggWasShot ? "Cracked!" : "Game Over"}
                </h1>
                {eggWasShot && (
                  <div style={{ fontSize: 14, color: "rgba(255,180,80,0.9)", marginTop: 10, letterSpacing: 1 }}>
                    🥚 The Last Egg is gone forever...
                  </div>
                )}
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  background: "rgba(100,200,255,0.08)", borderRadius: 10,
                  padding: "10px 18px", border: "1px solid rgba(100,200,255,0.2)",
                }}>
                  <AlienIcon />
                  <span style={{ fontSize: 11, color: "rgba(100,200,255,0.7)", letterSpacing: 2, textTransform: "uppercase" }}>Caught</span>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{score}</span>
                </div>
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  background: "rgba(255,215,0,0.08)", borderRadius: 10,
                  padding: "10px 18px", border: "1px solid rgba(255,215,0,0.2)",
                }}>
                  <span style={{ fontSize: 22 }}>🪙</span>
                  <span style={{ fontSize: 11, color: "rgba(255,215,0,0.7)", letterSpacing: 2, textTransform: "uppercase" }}>Coins</span>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{coins}</span>
                </div>
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  background: "rgba(255,215,0,0.06)", borderRadius: 10,
                  padding: "10px 18px", border: "1px solid rgba(255,215,0,0.15)",
                }}>
                  <span style={{ fontSize: 22 }}>⭐</span>
                  <span style={{ fontSize: 11, color: "rgba(255,215,0,0.7)", letterSpacing: 2, textTransform: "uppercase" }}>Level</span>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{level}</span>
                </div>
              </div>

              {/* Restart button — same structure as play button */}
              <button
                className="play-btn"
                onClick={handleRestart}
                style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 0 }}
              >
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  border: "2px solid rgba(100,200,255,0.6)",
                  animation: "pulse-ring 1.8s ease-out infinite",
                }} />
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  border: "2px solid rgba(100,200,255,0.4)",
                  animation: "pulse-ring2 1.8s ease-out infinite 0.4s",
                }} />
                <div style={{
                  position: "absolute", inset: -4, borderRadius: "50%",
                  background: "conic-gradient(from 0deg, rgba(100,200,255,0.8), rgba(180,100,255,0.8), rgba(100,200,255,0), rgba(100,200,255,0.8))",
                  animation: "spin-border 2s linear infinite",
                }} />
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "#0d1230",
                  margin: 2,
                }} />
                <div className="play-circle" style={{
                  width: 90, height: 90, borderRadius: "50%",
                  background: "rgba(100,200,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  <div className="play-triangle" style={{
                    width: 0, height: 0,
                    borderTop: "18px solid transparent",
                    borderBottom: "18px solid transparent",
                    borderLeft: "30px solid rgba(100,200,255,0.9)",
                    marginLeft: 8,
                  }} />
                </div>
              </button>

              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase" }}>
                Play again
              </div>
            </div>
          )}

          {isMissionComplete && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 20,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(180deg, #030d08 0%, #071a10 45%, #0a1f08 100%)",
              fontFamily: "'Arial', sans-serif",
              gap: 26,
            }}>
              {/* Star field */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                {Array.from({ length: 50 }).map((_, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    left: `${Math.sin(i * 2.3) * 50 + 50}%`,
                    top: `${Math.cos(i * 1.9) * 50 + 50}%`,
                    width: i % 4 === 0 ? 3 : 2,
                    height: i % 4 === 0 ? 3 : 2,
                    borderRadius: "50%",
                    background: i % 5 === 0 ? "#FFD700" : "#fff",
                    opacity: 0.25 + (i % 5) * 0.12,
                  }} />
                ))}
              </div>

              {/* Egg graphic */}
              <div style={{
                fontSize: 72,
                animation: "float-title 3s ease-in-out infinite",
                filter: "drop-shadow(0 0 24px rgba(255,210,60,0.9)) drop-shadow(0 0 48px rgba(100,255,160,0.5))",
              }}>🥚</div>

              {/* Title */}
              <div style={{ textAlign: "center", animation: "float-title 3.5s ease-in-out infinite 0.3s" }}>
                <div style={{ fontSize: 12, letterSpacing: 6, color: "rgba(100,255,160,0.75)", marginBottom: 8, textTransform: "uppercase" }}>
                  All aliens safe
                </div>
                <h1 style={{
                  margin: 0,
                  fontSize: "clamp(26px, 5.5vw, 44px)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  textShadow: "0 0 24px rgba(100,255,160,0.9), 0 0 50px rgba(255,210,60,0.5)",
                }}>
                  Mission Complete
                </h1>
                <div style={{ fontSize: 14, color: "rgba(200,255,220,0.65)", marginTop: 10, letterSpacing: 1 }}>
                  The last egg is safe. The species will survive.
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { icon: "👽", label: "Caught",  value: score,  color: "rgba(100,255,160,0.1)", border: "rgba(100,255,160,0.25)", text: "rgba(100,255,160,0.8)" },
                  { icon: "🪙", label: "Coins",   value: coins,  color: "rgba(255,215,0,0.1)",   border: "rgba(255,215,0,0.25)",   text: "rgba(255,215,0,0.8)" },
                  { icon: "⭐", label: "Level",   value: level,  color: "rgba(255,215,0,0.08)",  border: "rgba(255,215,0,0.2)",    text: "rgba(255,215,0,0.7)" },
                ].map(({ icon, label, value, color, border, text }) => (
                  <div key={label} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    background: color, borderRadius: 10,
                    padding: "10px 20px", border: `1px solid ${border}`,
                  }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <span style={{ fontSize: 11, color: text, letterSpacing: 2, textTransform: "uppercase" }}>{label}</span>
                    <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Play again */}
              <button
                className="play-btn"
                onClick={handleRestart}
                style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 0 }}
              >
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(100,255,160,0.6)", animation: "pulse-ring 1.8s ease-out infinite" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(100,255,160,0.4)", animation: "pulse-ring2 1.8s ease-out infinite 0.4s" }} />
                <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "conic-gradient(from 0deg, rgba(100,255,160,0.8), rgba(255,210,60,0.8), rgba(100,255,160,0), rgba(100,255,160,0.8))", animation: "spin-border 2s linear infinite" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#030d08", margin: 2 }} />
                <div className="play-circle" style={{
                  width: 90, height: 90, borderRadius: "50%",
                  background: "rgba(100,255,160,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  <div className="play-triangle" style={{
                    width: 0, height: 0,
                    borderTop: "18px solid transparent",
                    borderBottom: "18px solid transparent",
                    borderLeft: "30px solid rgba(100,255,160,0.9)",
                    marginLeft: 8,
                  }} />
                </div>
              </button>

              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase" }}>
                Play again
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
