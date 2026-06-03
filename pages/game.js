import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import AlienIcon from "../components/AlienIcon";
import { NAV_HEIGHT, HUD_HEIGHT, GAME_MAX_WIDTH, getLevelColor } from "../lib/game/constants";
import { createSounds, createBackgroundMusic } from "../lib/game/sounds";
import { createEntityClasses } from "../lib/game/entities";
import { createDrawFunctions } from "../lib/game/draw";

function HeartIcon({ filled, half }) {
  return (
    <svg width="18" height="17" viewBox="0 0 24 22" xmlns="http://www.w3.org/2000/svg">
      {half && (
        <defs>
          <clipPath id="hud-half">
            <rect x="0" y="0" width="12" height="22" />
          </clipPath>
        </defs>
      )}
      <path
        d="M12 21.6C11.6 21.5 2 15.7 2 8.5 2 4.2 4.2 2 7 2c1.6 0 3 .8 4 2A5 5 0 0 1 17 2c2.8 0 5 2.2 5 6.5 0 7.2-9.6 13-10 13.1z"
        fill="rgba(255,255,255,0.12)"
      />
      {(filled || half) && (
        <path
          d="M12 21.6C11.6 21.5 2 15.7 2 8.5 2 4.2 4.2 2 7 2c1.6 0 3 .8 4 2A5 5 0 0 1 17 2c2.8 0 5 2.2 5 6.5 0 7.2-9.6 13-10 13.1z"
          fill="#e53e3e"
          clipPath={half ? "url(#hud-half)" : undefined}
        />
      )}
    </svg>
  );
}

function BuyButton({ onClick, disabled, label, cost }) {
  return (
    <button
      onClick={onClick}
      onKeyDown={(e) => e.preventDefault()}
      tabIndex={-1}
      className="hud-buy"
      title={`${label} — costs 🪙${cost}`}
      style={{
        background: disabled ? "transparent" : "rgba(255,255,255,0.08)",
        color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)",
        border: `1px solid ${disabled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.18)"}`,
        borderRadius: 4,
        padding: "1px 6px",
        fontSize: 10,
        fontWeight: "bold",
        cursor: disabled ? "default" : "pointer",
        letterSpacing: 0.5,
        lineHeight: "16px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

const STAR_COLORS = ["#FFFFFF", "#C8E6FF", "#FFE8A0", "#E8C8FF", "#A0FFE8", "#FFB0B0"];

function GameStarfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;

    const stars = [];
    const shootingStars = [];
    let shootingStarTimer = 0;

    for (let i = 0; i < 160; i++) {
      const layer = i < 80 ? 0 : i < 130 ? 1 : 2;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: layer === 0 ? Math.random() * 1 + 0.3 : layer === 1 ? Math.random() * 1.5 + 0.8 : Math.random() * 2.5 + 1.5,
        speed: layer === 0 ? Math.random() * 0.15 + 0.05 : layer === 1 ? Math.random() * 0.3 + 0.15 : Math.random() * 0.6 + 0.3,
        brightness: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        bright: layer === 2 && Math.random() > 0.5,
      });
    }

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    let raf;
    function tick() {
      ctx.clearRect(0, 0, w, h);

      // falling stars
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > h) { star.y = 0; star.x = Math.random() * w; }
        star.brightness += star.twinkleSpeed;
        const b = (Math.sin(star.brightness) + 1) / 2;
        const alpha = 0.3 + b * 0.7;
        ctx.globalAlpha = alpha;
        if (star.bright) {
          const sg = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          sg.addColorStop(0, star.color); sg.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = star.color; ctx.lineWidth = 0.5 * alpha;
          const arm = star.size * 5;
          ctx.beginPath(); ctx.moveTo(star.x - arm, star.y); ctx.lineTo(star.x + arm, star.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(star.x, star.y - arm); ctx.lineTo(star.x, star.y + arm); ctx.stroke();
        } else {
          const sg = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2.5);
          sg.addColorStop(0, star.color); sg.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = star.color;
        ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      });

      // shooting stars
      shootingStarTimer++;
      if (shootingStarTimer > 180 + Math.random() * 300) {
        shootingStarTimer = 0;
        shootingStars.push({
          x: Math.random() * w, y: Math.random() * h * 0.5,
          vx: 4 + Math.random() * 4, vy: 2 + Math.random() * 2,
          len: 60 + Math.random() * 80, life: 1,
        });
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx; s.y += s.vy; s.life -= 0.018;
        if (s.life <= 0) { shootingStars.splice(i, 1); continue; }
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 10, s.y - s.vy * 10);
        grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.len * (s.vx / 6), s.y - s.len * (s.vy / 6)); ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
  );
}

export default function Game() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [bullets, setBullets] = useState(50);
  const [shields, setShields] = useState(2);
  const [lives, setLives] = useState(3);
  const [lifeGained, setLifeGained] = useState(false);
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
  const buyShieldsRef = useRef(false);
  const soundEnabledRef = useRef(true);
  const pausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);
  const bgGainRef = useRef(null);
  const touchControlsRef = useRef({});
  const touchFireIntervalRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !isGameOver) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("game-active");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("game-active");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("game-active");
    };
  }, [gameStarted, isGameOver]);

  useEffect(() => {
    if (lifeGained) {
      const t = setTimeout(() => setLifeGained(false), 800);
      return () => clearTimeout(t);
    }
  }, [lifeGained]);

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setScore(0);
    setCoins(0);
    setBullets(50);
    setShields(2);
    setLives(3);
    setHalfDamage(false);
    setLevel(1);
    setIsGameOver(false);
    setIsMissionComplete(false);
    setEggWasShot(false);
    setCountdown(null);
    pausedRef.current = false;
    setIsPaused(false);
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
      distantPlanets[1].x = canvas.width - 110;
      distantPlanets[2].x = canvas.width / 2 + 60;
      distantPlanets[2].y = canvas.height - 130;
    };
    window.addEventListener("resize", handleResize);

    // ---- GAME STATE ----
    let scoreVal = 0;
    let coinsVal = 0;
    let bulletsVal = 50;
    let meteorShieldsVal = 2;
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
    let rockTimer = 9999;
    let animFrameId = null;
    let levelUpTimerId = null;
    let readyFrames = 180;
    let lastCountdownShown = 3;
    setCountdown(3);

    const BULLET_BUY_COUNT = 30;
    const BULLET_BUY_COST = 100;
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
    let meteorStormSafePos = 0; // cycles 0=left, 1=middle, 2=right
    let meteorHalfDamage = false;
    let halfDamageTimeoutId = null;
    let shieldActive = false;
    let shieldFrames = 0;
    let shieldAngle = 0;
    let reverseAliens = [];
    let reverseAlienTimer = 0;
    let heartAliens = [];
    let shieldAliens = [];
    let bombAliens = [];
    let ufo = null;
    let ufoTimer = 0;
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
    let winPending = false;

    // ---- SOUNDS ----
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = audioCtx;

    const {
      playShoot, playCatch, playHit, playExplosion,
      playMeteorExplosion, playMeteorImpact, playMeteorStormWarning,
      playLevelUp, playRockHit, playGameOver, playWin,
    } = createSounds(audioCtx, soundEnabledRef);

    // ---- BACKGROUND MUSIC ----
    const bgMusic = createBackgroundMusic(
      audioCtx, soundEnabledRef,
      () => levelVal,
      () => winMusicActive,
    );
    bgGainRef.current = bgMusic.bgGain;
    bgMusic.start();

    // ---- SPEED / INTERVAL HELPERS ----
    const getRockInterval = () => Math.max(55, 200 - (levelVal - 1) * 20);
    const getAlienSpeed = () => 1 + (Math.min(levelVal, 12) - 1) * 0.2;
    const getRockSpeed  = () => 1 + (levelVal - 1) * 0.2;

    // ---- BACKGROUND ELEMENTS ----
    const distantPlanets = [
      { x: 90, y: 90, radius: 34, color: "#c97bde", glowColor: "rgba(180,80,220,0.35)", rings: true },
      { x: canvas.width - 110, y: 130, radius: 22, color: "#5fc8c8", glowColor: "rgba(50,180,180,0.3)", rings: false },
      { x: canvas.width / 2 + 60, y: canvas.height - 130, radius: 18, color: "#f0a050", glowColor: "rgba(240,140,40,0.3)", rings: false },
    ];

    // ---- SHIP ----
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

    // ---- INIT STARS / NEBULAE ----
    const starColors = ["#FFFFFF", "#C8E6FF", "#FFE8A0", "#E8C8FF", "#A0FFE8", "#FFB0B0"];
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

    // ---- ENTITY CLASSES ----
    const rockImages = {
      left: rockImgLeft, right: rockImgRight,
      get leftLoaded()  { return rockImgLeftLoaded; },
      get rightLoaded() { return rockImgRightLoaded; },
    };
    const {
      Rock, Alien, Particle, FireworkParticle,
      MeteorRock, ReverseAlien, UFO, GravityWell, LastEgg, HeartAlien, ShieldAlien, BombAlien,
    } = createEntityClasses(ctx, canvas, ship, {
      getLevel: () => levelVal,
      getRockSpeed,
      getAlienSpeed,
      rockImages,
    });

    // ---- FIREWORK HELPERS (use FireworkParticle + canvas) ----
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
        } else {
          spd = 1.5 + Math.random() * 5.5;
          vx = Math.cos(angle) * spd; vy = Math.sin(angle) * spd;
        }
        const c = Math.random() > 0.35 ? shell.color : shell.color2;
        fireworkParticles.push(new FireworkParticle(shell.x, shell.y, c, vx, vy, Math.random() > 0.55));
      }
    }

    // ---- DRAW STATE PROXY ----
    // Getters let draw.js always read the current let-var values, even after reassignment
    const drawState = {
      keys,
      distantPlanets,
      shipImg,
      get level()              { return levelVal; },
      get invulnerable()       { return invulnerable; },
      get comboVal()           { return comboVal; },
      get comboDisplayTimer()  { return comboDisplayTimer; },
      set comboDisplayTimer(v) { comboDisplayTimer = v; },
      get screenShakeFrames()  { return screenShakeFrames; },
      set screenShakeFrames(v) { screenShakeFrames = v; },
      get screenShakeMag()     { return screenShakeMag; },
      get scrambleFrames()     { return scrambleFrames; },
      get scrambleWarnFrames() { return scrambleWarnFrames; },
      get damagedFrames()      { return damagedFrames; },
      get meteorStormFrames()  { return meteorStormFrames; },
      get meteorStormSafePos() { return meteorStormSafePos; },
      get shieldActive()       { return shieldActive; },
      get shieldFrames()       { return shieldFrames; },
      get shieldAngle()        { return shieldAngle; },
      set shieldAngle(v)       { shieldAngle = v; },
      get fireworksFrames()    { return fireworksFrames; },
      get coinRainFrames()     { return coinRainFrames; },
      get shipImgLoaded()      { return shipImgLoaded; },
      get ufo()                { return ufo; },
      get gravityWell()        { return gravityWell; },
      get lastEgg()            { return lastEgg; },
      get spotlightAlien()     { return spotlightAlien; },
      // reassignable arrays — getters always return current reference
      get stars()              { return stars; },
      get nebulaClouds()       { return nebulaClouds; },
      get rocks()              { return rocks; },
      get meteorRocks()        { return meteorRocks; },
      get reverseAliens()      { return reverseAliens; },
      get heartAliens()        { return heartAliens; },
      get shieldAliens()       { return shieldAliens; },
      get bombAliens()         { return bombAliens; },
      get floatingTexts()      { return floatingTexts; },
      get particles()          { return particles; },
      get engineTrails()       { return engineTrails; },
      get coinParticles()      { return coinParticles; },
      get fireworkShells()     { return fireworkShells; },
      get fireworkParticles()  { return fireworkParticles; },
      // in-place arrays — no getters needed, but consistent to use state
      get aliens()             { return aliens; },
      get bulletsList()        { return bulletsList; },
    };

    const { drawFrame } = createDrawFunctions(ctx, canvas, ship, drawState);

    // ---- GAME LOGIC ----

    function loseLife() {
      if (invulnerable || winPending) return;
      livesVal--;
      invulnerable = true;
      damagedFrames = 270;
      meteorHalfDamage = false;
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

      if (pauseFrames > 0) { pauseFrames--; return; }

      if (gravityWell) {
        const { ax } = gravityWell.applyTo(ship.x + ship.width / 2, ship.y + ship.height / 2);
        ship.x = Math.max(0, Math.min(canvas.width - ship.width, ship.x + ax * 0.018));
      }

      const scrambled = scrambleFrames > 0;
      const damaged = damagedFrames > 0;
      if (damaged) {
        damagedFrames--;
        const drift = (Math.random() - 0.5) * 1.4;
        ship.x = Math.max(0, Math.min(canvas.width - ship.width, ship.x + drift));
      }
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
              const pCount = rock.isBoss ? 55 : 22;
              for (let k = 0; k < pCount; k++) {
                particles.push(new Particle(
                  rock.x + rock.width / 2, rock.y + rock.height / 2,
                  rock.isBoss
                    ? ["#ff4400", "#ff8800", "#ffcc00", "#ff2200", "#ffffff"][Math.floor(Math.random() * 5)]
                    : ["#ff8844", "#ffbb44", "#ff6622", "#ffdd88"][Math.floor(Math.random() * 4)]
                ));
              }
              aliens.forEach((a) => {
                if (a.rock === rock && a.onRock) {
                  a.onRock = false;
                  a.fallSpeed = 1;
                  a.rotationSpeed = a.direction * 0.1;
                }
              });
              heartAliens.forEach((ha) => {
                if (ha.rock === rock && ha.onRock) {
                  ha.onRock = false;
                  ha.fallSpeed = 1;
                  ha.rotationSpeed = ha.direction * 0.1;
                }
              });
              shieldAliens.forEach((sa) => {
                if (sa.rock === rock && sa.onRock) {
                  sa.onRock = false;
                  sa.fallSpeed = 1;
                  sa.rotationSpeed = sa.direction * 0.1;
                }
              });
              bombAliens.forEach((ba) => {
                if (ba.rock === rock && ba.onRock) {
                  ba.onRock = false;
                  ba.fallSpeed = 1;
                  ba.rotationSpeed = ba.direction * 0.1;
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
            setTimeout(() => { setEggWasShot(true); if (gameRunning) endGame(); }, 1500);
            hit = true;
          }
        }
        if (hit) bulletsList.splice(i, 1);
      }

      const newLevel = (() => {
        if (scoreVal < 3) return 1;
        let lvl = 2, used = 3;
        while (true) {
          const cost = lvl < 10 ? 5 : lvl < 15 ? 7 : lvl < 20 ? 10 : 15;
          if (scoreVal < used + cost) return lvl;
          used += cost;
          lvl++;
        }
      })();
      if (newLevel !== levelVal) {
        levelVal = newLevel;
        setLevel(levelVal);
        playLevelUp();
        setLevelUpBanner(levelVal);
        if (levelUpTimerId) clearTimeout(levelUpTimerId);
        levelUpTimerId = setTimeout(() => setLevelUpBanner(null), 1800);
      }

      if (shieldFrames > 0) { shieldFrames--; if (shieldFrames === 0) shieldActive = false; }

      const stormInterval = Math.max(600, 1800 - Math.floor(Math.max(0, levelVal - 15) / 2) * 180);
      if (levelVal >= 1 && meteorStormFrames <= 0) {
        meteorStormTimer++;
        if (meteorStormTimer >= stormInterval) {
          meteorStormTimer = 0;
          if (Math.random() < 0.65) {
            meteorStormSafePos = (meteorStormSafePos + 1) % 3;
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
          const skipSlot = meteorStormSafePos === 0 ? 0
            : meteorStormSafePos === 2 ? slots - 1
            : Math.floor(slots / 2);
          const available = [];
          for (let mi = 0; mi < slots; mi++) { if (mi !== skipSlot) available.push(mi); }
          for (let i = available.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [available[i], available[j]] = [available[j], available[i]];
          }
          for (let i = 0; i < count; i++) {
            const mr = new MeteorRock();
            mr.x = laneW * (available[i] + 0.5) + (Math.random() - 0.5) * laneW * 0.3;
            meteorRocks.push(mr);
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
          if (!rock.hasAlien) {
            const bonusRoll = Math.random();
            if (levelVal >= 4 && bonusRoll < 0.07) heartAliens.push(new HeartAlien(rock, 0));
            else if (levelVal >= 3 && bonusRoll < 0.22) shieldAliens.push(new ShieldAlien(rock, 0));
            else if (levelVal >= 7 && bonusRoll < 0.32) bombAliens.push(new BombAlien(rock, 0));
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
        if (!invulnerable && rock.checkCollision(ship)) { loseLife(); return false; }
        return !rock.isOffScreen();
      });

      meteorRocks = meteorRocks.filter((mr) => {
        mr.update();
        if (mr.checkCollision(ship)) {
          if (shieldActive) {
            for (let k = 0; k < 18; k++) {
              const p = new Particle(mr.x + mr.width / 2, mr.y + mr.height / 2, ["#44CCFF", "#88EEFF", "#ffffff"][k % 3]);
              p.vx = (Math.random() - 0.5) * 8; p.vy = (Math.random() - 0.5) * 8; p.life = 30; p.size = 3 + Math.random() * 3;
              particles.push(p);
            }
            return false;
          }
          if (!invulnerable) {
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
              if (halfDamageTimeoutId) clearTimeout(halfDamageTimeoutId);
              halfDamageTimeoutId = setTimeout(() => { invulnerable = false; halfDamageTimeoutId = null; }, 800);
            }
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

      reverseAlienTimer++;
      if (levelVal >= 17 && reverseAlienTimer >= 320) {
        reverseAlienTimer = 0;
        reverseAliens.push(new ReverseAlien());
      }
      reverseAliens = reverseAliens.filter((ra) => { ra.update(); return !ra.isOffScreen(); });

      heartAliens = heartAliens.filter((ha) => {
        ha.update();
        if (ha.isDoneBeingCaught()) return false;
        if (!ha.caught && ha.checkCatch()) {
          ha.caught = true;
          playCatch(false, false);
          livesVal += 1;
          setLives(livesVal);
          setLifeGained(true);
          floatingTexts.push({ x: ha.x + ha.width / 2, y: ha.y - 10, text: "❤️ +1 life!", alpha: 1, vy: 1.8, color: "#FF4466" });
          for (let j = 0; j < 20; j++) {
            particles.push(new Particle(ha.x + ha.width / 2, ha.y + ha.height / 2, ["#FF4466", "#FF88AA", "#ffffff"][j % 3]));
          }
        }
        return !ha.isDoneBeingCaught() && !ha.isOffScreen();
      });

      shieldAliens = shieldAliens.filter((sa) => {
        sa.update();
        if (sa.isDoneBeingCaught()) return false;
        if (!sa.caught && sa.checkCatch()) {
          sa.caught = true;
          playCatch(false, false);
          meteorShieldsVal += 1;
          setShields(meteorShieldsVal);
          floatingTexts.push({ x: sa.x + sa.width / 2, y: sa.y - 10, text: "🛡️ +1 shield!", alpha: 1, vy: 1.8, color: "#44CCFF" });
          for (let j = 0; j < 20; j++) {
            particles.push(new Particle(sa.x + sa.width / 2, sa.y + sa.height / 2, ["#44CCFF", "#88EEFF", "#ffffff"][j % 3]));
          }
        }
        return !sa.isDoneBeingCaught() && !sa.isOffScreen();
      });

      bombAliens = bombAliens.filter((ba) => {
        ba.update();
        if (!ba.hit && ba.checkHit()) {
          ba.hit = true;
          loseLife();
          playExplosion();
          floatingTexts.push({ x: ba.x + ba.width / 2, y: ba.y - 10, text: "💣 -1 life!", alpha: 1, vy: 1.8, color: "#FF6600" });
          screenShakeFrames = 22; screenShakeMag = 11;
          const expCx = ba.x + ba.width / 2;
          const expCy = ba.y + ba.height / 2;
          const hotColors = ["#FF6600", "#FF9900", "#FFCC00", "#FF3300", "#FF0000", "#ffffff", "#FFEE88"];
          const smokeColors = ["#442200", "#331100", "#666666"];
          for (let j = 0; j < 60; j++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 3 + Math.random() * 14;
            const color = j < 50
              ? hotColors[Math.floor(Math.random() * hotColors.length)]
              : smokeColors[Math.floor(Math.random() * smokeColors.length)];
            fireworkParticles.push(new FireworkParticle(expCx, expCy, color, Math.cos(angle) * spd, Math.sin(angle) * spd, j < 25));
          }
          for (let j = 0; j < 20; j++) {
            particles.push(new Particle(expCx, expCy, ["#FF6600", "#FF9944", "#333333"][j % 3]));
          }
        }
        return !ba.hit && !ba.isOffScreen();
      });

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

      if (levelVal >= 37 && scrambleFrames <= 0 && scrambleWarnFrames <= 0) {
        scrambleTimer++;
        if (scrambleTimer >= 1200) {
          scrambleTimer = 0;
          scrambleWarnFrames = 180;
        }
      }
      if (scrambleWarnFrames > 0) {
        scrambleWarnFrames--;
        if (scrambleWarnFrames === 0) scrambleFrames = 300;
      }
      if (scrambleFrames > 0) scrambleFrames--;

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
          winPending = true;
          const ecx = lastEgg.x + lastEgg.width / 2;
          const ecy = lastEgg.y + lastEgg.height / 2;
          playExplosion();
          playWin();
          winMusicActive = true;
          fireworksFrames = 108;
          screenShakeFrames = 30; screenShakeMag = 14;
          const expColors = ["#FFD700","#FFF9A0","#FF8C00","#FFFFFF","#90EE90","#00FF88","#AAFFCC"];
          for (let k = 0; k < 90; k++) {
            const angle = (k / 90) * Math.PI * 2;
            const spd = 3 + Math.random() * 9;
            fireworkParticles.push(new FireworkParticle(ecx, ecy, expColors[Math.floor(Math.random() * expColors.length)], Math.cos(angle) * spd, Math.sin(angle) * spd, true));
          }
          for (let i = 0; i < 3; i++) fireworkShells.push(spawnFireworkShell());
          coinsVal += 500;
          setCoins(coinsVal);
          setTimeout(() => { gameRunning = false; setIsMissionComplete(true); }, 1800);
        }
        if (lastEgg.isDoneBeingCaught()) lastEgg = null;
        if (lastEgg && lastEgg.isOffScreen()) { lastEgg = null; lastEggSpawned = false; }
      }

      if (fireworksFrames > 0) {
        fireworksFrames--;
        if (fireworksFrames % 16 === 0) fireworkShells.push(spawnFireworkShell());
      }
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
      fireworkParticles = fireworkParticles.filter(p => p.life > 0);
      fireworkParticles.forEach(p => p.update());

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
        setCountdown(0);
        setTimeout(() => setCountdown(null), 700);
      }

      // Process buys — runs whether paused or not
      if (buyBulletsRef.current) {
        buyBulletsRef.current = false;
        if (coinsVal >= BULLET_BUY_COST) {
          coinsVal -= BULLET_BUY_COST;
          bulletsVal += BULLET_BUY_COUNT;
          setCoins(coinsVal);
          setBullets(bulletsVal);
          if (!pausedRef.current) pauseFrames = 90;
          buyFlashFrames = 90;
          buyFlashText = "+ 5 bullets!";
        }
      }
      if (buyLivesRef.current) {
        buyLivesRef.current = false;
        if (coinsVal >= 200) {
          coinsVal -= 200;
          livesVal += 1;
          setCoins(coinsVal);
          setLives(livesVal);
          setLifeGained(true);
          if (!pausedRef.current) pauseFrames = 90;
          buyFlashFrames = 90;
          buyFlashText = "❤️ +1 life!";
        }
      }
      if (buyShieldsRef.current) {
        buyShieldsRef.current = false;
        if (coinsVal >= 70) {
          coinsVal -= 70;
          meteorShieldsVal += 1;
          setCoins(coinsVal);
          setShields(meteorShieldsVal);
          if (!pausedRef.current) pauseFrames = 90;
          buyFlashFrames = 90;
          buyFlashText = "🛡️ +1 shield!";
        }
      }

      if (pausedRef.current) {
        drawFrame();
        ctx.save();
        ctx.fillStyle = "rgba(5,7,26,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "rgba(100,200,255,0.8)";
        ctx.shadowBlur = 24;
        ctx.fillText("⏸ PAUSED", canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = "14px Arial";
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.fillText("Press P or Escape to resume", canvas.width / 2, canvas.height / 2 + 22);
        if (buyFlashFrames > 0) {
          buyFlashFrames--;
          const alpha = buyFlashFrames < 30 ? buyFlashFrames / 30 : 1;
          ctx.globalAlpha = alpha;
          ctx.font = "bold 22px Arial";
          ctx.shadowColor = "rgba(100,200,255,0.9)";
          ctx.shadowBlur = 18;
          ctx.fillStyle = "#64C8FF";
          ctx.fillText(buyFlashText, canvas.width / 2, canvas.height / 2 + 58);
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
        ctx.restore();
        animFrameId = requestAnimationFrame(gameLoop);
        return;
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
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(gameLoop);
    }

    // ---- CONTROLS ----
    const onKeyDown = (e) => {
      keys[e.key] = true;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "s", "S", "1", "2", "3"].includes(e.key) && gameRunning) {
        e.preventDefault();
      }
      if ((e.key === "p" || e.key === "P" || e.key === "Escape") && gameRunning && readyFrames <= 0) {
        pausedRef.current = !pausedRef.current;
        setIsPaused(pausedRef.current);
      }
      if ((e.key === "s" || e.key === "S") && gameRunning && readyFrames <= 0 && !shieldActive && meteorShieldsVal > 0) {
        meteorShieldsVal--;
        setShields(meteorShieldsVal);
        shieldActive = true;
        shieldFrames = 300;
        floatingTexts.push({ x: ship.x + ship.width / 2, y: ship.y - 30, text: "🛡️ Shield!", alpha: 1, vy: 1.5, color: "#44CCFF" });
      }
      if (e.key === "1" && gameRunning && readyFrames <= 0) { buyBulletsRef.current = true; }
      if (e.key === "2" && gameRunning && readyFrames <= 0) { buyShieldsRef.current = true; }
      if (e.key === "3" && gameRunning && readyFrames <= 0) { buyLivesRef.current = true; }
      if (e.key === " " && bulletsVal > 0 && shootCooldown <= 0 && gameRunning && readyFrames <= 0) {
        bulletsList.push({ x: ship.x + ship.width / 2 - 2, y: ship.y - 10, width: 4, height: 16, speed: 13 });
        playShoot();
        bulletsVal--;
        setBullets(bulletsVal);
        shootCooldown = 12;
      }
    };
    const onKeyUp = (e) => { keys[e.key] = false; };

    const fireBullet = () => {
      if (bulletsVal > 0 && shootCooldown <= 0 && gameRunning && readyFrames <= 0) {
        bulletsList.push({ x: ship.x + ship.width / 2 - 2, y: ship.y - 10, width: 4, height: 16, speed: 13 });
        playShoot();
        bulletsVal--;
        setBullets(bulletsVal);
        shootCooldown = 12;
      }
    };
    const activateShield = () => {
      if (gameRunning && readyFrames <= 0 && !shieldActive && meteorShieldsVal > 0) {
        meteorShieldsVal--;
        setShields(meteorShieldsVal);
        shieldActive = true;
        shieldFrames = 300;
        floatingTexts.push({ x: ship.x + ship.width / 2, y: ship.y - 30, text: "🛡️ Shield!", alpha: 1, vy: 1.5, color: "#44CCFF" });
      }
    };
    touchControlsRef.current = {
      moveLeft:  (on) => { keys["ArrowLeft"] = on; if (on) keys["ArrowRight"] = false; },
      moveRight: (on) => { keys["ArrowRight"] = on; if (on) keys["ArrowLeft"] = false; },
      fire: fireBullet,
      shield: activateShield,
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const onWheel = (e) => e.preventDefault();
    window.addEventListener("wheel", onWheel, { passive: false });
    document.body.style.overflow = "hidden";

    animFrameId = requestAnimationFrame(gameLoop);

    return () => {
      gameRunning = false;
      cancelAnimationFrame(animFrameId);
      if (flashIntervalId) clearInterval(flashIntervalId);
      if (levelUpTimerId) clearTimeout(levelUpTimerId);
      if (halfDamageTimeoutId) clearTimeout(halfDamageTimeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("wheel", onWheel);
      document.body.style.overflow = "";
      bgMusic.stop();
      audioCtx.close();
    };
  }, [restartKey, gameStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  const touchBtnStyle = {
    width: 64, height: 64, borderRadius: "50%",
    background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)",
    color: "#fff", fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", userSelect: "none", touchAction: "none",
    WebkitTapHighlightColor: "transparent", outline: "none",
  };

  return (
    <>
      <Head>
        <title>AlifallX: Don&apos;t Leave Them Behind</title>
        <meta name="description" content="Catch the falling AlifallX with your spaceship. Don't leave them behind!" />
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
        @keyframes hud-life-gain {
          0%   { box-shadow: 0 0 0px rgba(255,68,102,0); }
          25%  { box-shadow: 0 0 22px rgba(255,68,102,1), 0 0 8px rgba(255,180,200,0.9); }
          100% { box-shadow: 0 0 0px rgba(255,68,102,0); }
        }
        @keyframes hud-danger {
          0%, 100% { box-shadow: 0 0 0px rgba(255,60,60,0); border-color: rgba(255,60,60,0.3); }
          50%       { box-shadow: 0 0 14px rgba(255,60,60,0.9); border-color: rgba(255,60,60,0.95); }
        }
        @keyframes hud-warn {
          0%, 100% { box-shadow: 0 0 0px rgba(255,160,0,0); border-color: rgba(180,100,255,0.3); }
          50%       { box-shadow: 0 0 12px rgba(255,160,0,0.85); border-color: rgba(255,160,0,0.9); }
        }
        .hud-buy { display: inline-flex; }
        .controls-touch { display: none; }
        .start-cta-tap { display: none; }
        @media (max-width: 500px) {
          .hud-buy { display: none !important; }
          .hud-sep { display: none !important; }
          .hud-lvl-label { display: none !important; }
          .hud-right { gap: 4px !important; padding: 0 !important; }
          .hud-bar { padding: 0 6px !important; }
          .hud-score { font-size: 18px !important; }
          .hud-level { font-size: 16px !important; }
          .hud-coin-val { font-size: 13px !important; }
          .hud-ammo-val { font-size: 13px !important; }
          .controls-keyboard { display: none; }
          .controls-touch { display: block; }
          .start-cta-click { display: none; }
          .start-cta-tap { display: block; }
        }
      `}</style>

      <div style={{
        display: "flex", flexDirection: "column",
        height: "100vh", paddingTop: gameStarted && !isGameOver ? 0 : NAV_HEIGHT,
        boxSizing: "border-box", overflow: "hidden",
        alignItems: "center", background: "#05071a",
        position: "relative",
      }}>
      <GameStarfield />
      <div style={{
        display: "flex", flexDirection: "column",
        width: "100%", maxWidth: GAME_MAX_WIDTH,
        flex: 1, overflow: "hidden",
        position: "relative", zIndex: 1,
      }}>
        {/* HUD Bar */}
        <div className="hud-bar" style={{
          height: HUD_HEIGHT,
          background: "rgba(5,7,26,0.97)",
          borderBottom: "1px solid rgba(100,200,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
          userSelect: "none", fontFamily: "'Arial', sans-serif", padding: "0 14px",
        }}>

          {/* Left: Score + Level */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlienIcon />
              <span className="hud-score" style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: 1, lineHeight: 1 }}>{score}</span>
            </div>
            <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.1)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span className="hud-lvl-label" style={{ fontSize: 10, color: "rgba(255,215,0,0.5)", letterSpacing: 2, textTransform: "uppercase" }}>LVL</span>
              <span className="hud-level" style={{ fontSize: 20, fontWeight: 700, color: "#FFD700", lineHeight: 1 }}>{level}</span>
            </div>
          </div>

          {/* Center: Lives */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, animation: lifeGained ? "hud-life-gain 0.8s ease-out" : lives <= 1 ? "hud-danger 0.7s ease-in-out infinite" : "none", borderRadius: 6, padding: "3px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {Array.from({ length: Math.min(Math.max(lives, 3), 5) }).map((_, i) => (
                <HeartIcon
                  key={i}
                  filled={i < (halfDamage ? lives - 1 : lives)}
                  half={halfDamage && i === lives - 1}
                />
              ))}
              {lives > 5 && (
                <span style={{ fontSize: 13, fontWeight: 700, color: "#FF6688", lineHeight: 1 }}>+{lives - 5}</span>
              )}
            </div>
            <BuyButton onClick={() => { buyLivesRef.current = true; }} disabled={coins < 200} label="+1 🪙200" cost={200} />
          </div>

          {/* Right: Coins, Bullets, Shields, Mute */}
          <div className="hud-right" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Coins */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 14 }}>🪙</span>
              <span className="hud-coin-val" style={{ fontSize: 17, fontWeight: 700, color: "#FFD700", lineHeight: 1 }}>{coins}</span>
            </div>

            <div className="hud-sep" style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />

            {/* Bullets */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, animation: bullets < 5 ? "hud-warn 0.9s ease-in-out infinite" : "none", borderRadius: 5, padding: "2px 4px" }}>
              <span style={{ fontSize: 14 }}>🔫</span>
              <span className="hud-ammo-val" style={{ fontSize: 17, fontWeight: 700, color: bullets === 0 ? "#ff4444" : bullets < 5 ? "#ffcc66" : "#fff", lineHeight: 1 }}>{bullets}</span>
              <BuyButton onClick={() => { buyBulletsRef.current = true; }} disabled={coins < 100} label="+30 🪙100" cost={100} />
            </div>

            {/* Shields */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, animation: shields === 0 ? "hud-warn 0.9s ease-in-out infinite" : "none", borderRadius: 5, padding: "2px 4px" }}>
              <span style={{ fontSize: 14 }}>🛡️</span>
              <span className="hud-ammo-val" style={{ fontSize: 17, fontWeight: 700, color: shields === 0 ? "#ff4444" : "#fff", lineHeight: 1 }}>{shields}</span>
              <BuyButton onClick={() => { buyShieldsRef.current = true; }} disabled={coins < 70} label="+1 🪙70" cost={70} />
            </div>

            <div className="hud-sep" style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />

            {/* Pause */}
            <button
              onClick={() => {
                pausedRef.current = !pausedRef.current;
                setIsPaused(pausedRef.current);
              }}
              onKeyDown={(e) => e.preventDefault()}
              tabIndex={-1}
              title={isPaused ? "Resume (P)" : "Pause (P)"}
              style={{ background: "transparent", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer", fontSize: 17, lineHeight: 1, color: "rgba(255,255,255,0.6)" }}
            >
              {isPaused ? "▶️" : "⏸️"}
            </button>

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
              style={{ background: "transparent", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer", fontSize: 17, lineHeight: 1, color: "rgba(255,255,255,0.6)", opacity: soundEnabled ? 1 : 0.4 }}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </div>

        {/* Game Canvas */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

          {/* Touch Controls Overlay */}
          {gameStarted && !isGameOver && !isMissionComplete && countdown === null && (
            <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 20px", pointerEvents: "none", zIndex: 10 }}>
              <div style={{ display: "flex", gap: 12, pointerEvents: "auto" }}>
                {[["←", "moveLeft"], ["→", "moveRight"]].map(([label, action]) => (
                  <button key={label}
                    onPointerDown={(e) => { e.preventDefault(); touchControlsRef.current[action]?.(true); }}
                    onPointerUp={(e) => { e.preventDefault(); touchControlsRef.current[action]?.(false); }}
                    onPointerLeave={(e) => { e.preventDefault(); touchControlsRef.current[action]?.(false); }}
                    onPointerCancel={(e) => { e.preventDefault(); touchControlsRef.current[action]?.(false); }}
                    style={touchBtnStyle}
                  >{label}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, pointerEvents: "auto" }}>
                <button
                  onPointerDown={(e) => { e.preventDefault(); touchControlsRef.current.shield?.(); }}
                  style={{ ...touchBtnStyle, background: "rgba(68,204,255,0.15)", borderColor: "rgba(68,204,255,0.4)" }}
                >🛡</button>
                <button
                  onPointerDown={(e) => { e.preventDefault(); touchFireIntervalRef.current = setInterval(() => touchControlsRef.current.fire?.(), 180); touchControlsRef.current.fire?.(); }}
                  onPointerUp={(e) => { e.preventDefault(); clearInterval(touchFireIntervalRef.current); }}
                  onPointerLeave={(e) => { e.preventDefault(); clearInterval(touchFireIntervalRef.current); }}
                  onPointerCancel={(e) => { e.preventDefault(); clearInterval(touchFireIntervalRef.current); }}
                  style={{ ...touchBtnStyle, background: "rgba(255,100,100,0.15)", borderColor: "rgba(255,100,100,0.4)" }}
                >🔥</button>
              </div>
            </div>
          )}

          {/* Start Screen */}
          {!gameStarted && !isGameOver && (
            <div style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #070b1f 0%, #12173a 50%, #1a0a2e 100%)", fontFamily: "'Arial', sans-serif", gap: 32 }}>
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} style={{ position: "absolute", left: `${Math.sin(i * 2.5) * 50 + 50}%`, top: `${Math.cos(i * 1.7) * 50 + 50}%`, width: i % 5 === 0 ? 3 : 2, height: i % 5 === 0 ? 3 : 2, borderRadius: "50%", background: "#fff", opacity: 0.3 + (i % 4) * 0.15 }} />
                ))}
              </div>
              <div style={{ animation: "float-title 3s ease-in-out infinite", textAlign: "center" }}>
                <div style={{ fontSize: 14, letterSpacing: 6, color: "rgba(100,200,255,0.7)", marginBottom: 8, textTransform: "uppercase" }}>Welcome to</div>
                <h1 style={{ margin: 0, fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 900, color: "#fff", letterSpacing: 4, animation: "glow-text 2.5s ease-in-out infinite", textTransform: "uppercase" }}>AlifallX</h1>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8, letterSpacing: 2 }}>Catch the falling aliens. Dodge the rocks.</div>
              </div>
              <button className="play-btn" onClick={() => { window.scrollTo({ top: 0, behavior: "instant" }); setGameStarted(true); }} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 0 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(100,200,255,0.6)", animation: "pulse-ring 1.8s ease-out infinite" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(100,200,255,0.4)", animation: "pulse-ring2 1.8s ease-out infinite 0.4s" }} />
                <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "conic-gradient(from 0deg, rgba(100,200,255,0.8), rgba(180,100,255,0.8), rgba(100,200,255,0), rgba(100,200,255,0.8))", animation: "spin-border 2s linear infinite" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#0d1230", margin: 2 }} />
                <div className="play-circle" style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(100,200,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div className="play-triangle" style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: "30px solid rgba(100,200,255,0.9)", marginLeft: 8 }} />
                </div>
              </button>
              <div className="start-cta-click" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase" }}>Click to play</div>
              <div className="start-cta-tap" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase" }}>Tap to play</div>
              <div className="controls-keyboard" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textAlign: "center", lineHeight: 2 }}>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>← → / A / D</span> move &nbsp;·&nbsp; <span style={{ color: "rgba(255,255,255,0.45)" }}>Space</span> shoot &nbsp;·&nbsp; <span style={{ color: "rgba(255,255,255,0.45)" }}>S</span> shield &nbsp;·&nbsp; <span style={{ color: "rgba(255,255,255,0.45)" }}>P / Esc</span> pause<br/>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>1</span> buy bullets 🪙100 &nbsp;·&nbsp; <span style={{ color: "rgba(255,255,255,0.45)" }}>2</span> buy shield 🪙70 &nbsp;·&nbsp; <span style={{ color: "rgba(255,255,255,0.45)" }}>3</span> buy life 🪙200<br/>
                ❤️ catch Heart Alien (+1 life, lv4+) &nbsp;·&nbsp; 🛡️ Shield Alien (+1 shield, lv3+) &nbsp;·&nbsp; 💣 avoid Bomb Alien (−1 life, lv7+)
              </div>
              <div className="controls-touch" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textAlign: "center", lineHeight: 2 }}>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>← →</span> buttons to move &nbsp;·&nbsp; <span style={{ color: "rgba(255,255,255,0.45)" }}>🔥 hold</span> to fire &nbsp;·&nbsp; <span style={{ color: "rgba(255,255,255,0.45)" }}>🛡</span> to shield<br/>
                ❤️ catch Heart Alien (+1 life) &nbsp;·&nbsp; 🛡️ Shield Alien (+1 shield) &nbsp;·&nbsp; 💣 avoid Bomb Alien
              </div>
            </div>
          )}

          {/* Level Up Banner */}
          {levelUpBanner !== null && (
            <div style={{ position: "absolute", inset: 0, zIndex: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div key={levelUpBanner} style={{ textAlign: "center", animation: "level-up-anim 1.8s ease forwards" }}>
                <div style={{ fontSize: 15, letterSpacing: 8, textTransform: "uppercase", color: getLevelColor(levelUpBanner), fontFamily: "'Arial', sans-serif", fontWeight: 700, textShadow: `0 0 24px ${getLevelColor(levelUpBanner)}`, marginBottom: 2, animation: "level-up-sub 1.8s ease forwards" }}>Level Up!</div>
                <div style={{ fontSize: 108, fontWeight: 900, fontFamily: "'Arial', sans-serif", color: "#fff", lineHeight: 1, textShadow: `0 0 40px ${getLevelColor(levelUpBanner)}, 0 0 90px ${getLevelColor(levelUpBanner)}88` }}>{levelUpBanner}</div>
              </div>
            </div>
          )}

          {/* Countdown overlay */}
          {countdown !== null && (
            <div style={{ position: "absolute", inset: 0, zIndex: 15, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div key={countdown} style={{ fontSize: countdown === 0 ? 72 : 110, fontWeight: 900, color: countdown === 0 ? "#7CFC00" : "#fff", fontFamily: "'Arial', sans-serif", letterSpacing: countdown === 0 ? 6 : 0, textShadow: countdown === 0 ? "0 0 30px rgba(124,252,0,0.8), 0 0 60px rgba(124,252,0,0.4)" : "0 0 30px rgba(100,200,255,0.8), 0 0 60px rgba(100,200,255,0.4)", animation: countdown === 0 ? "go-pop 0.7s ease forwards" : "countdown-pop 0.5s ease forwards" }}>
                {countdown === 0 ? "GO!" : countdown}
              </div>
            </div>
          )}

          {/* Game Over overlay */}
          {isGameOver && (
            <div style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #070b1f 0%, #12173a 50%, #1a0a2e 100%)", fontFamily: "'Arial', sans-serif", gap: 28 }}>
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} style={{ position: "absolute", left: `${Math.sin(i * 2.5) * 50 + 50}%`, top: `${Math.cos(i * 1.7) * 50 + 50}%`, width: i % 5 === 0 ? 3 : 2, height: i % 5 === 0 ? 3 : 2, borderRadius: "50%", background: "#fff", opacity: 0.3 + (i % 4) * 0.15 }} />
                ))}
              </div>
              <div style={{ animation: "float-title 3s ease-in-out infinite", textAlign: "center" }}>
                <div style={{ fontSize: 13, letterSpacing: 6, color: "rgba(255,120,120,0.75)", marginBottom: 8, textTransform: "uppercase" }}>{eggWasShot ? "You shot the egg" : "Mission failed"}</div>
                <h1 style={{ margin: 0, fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 900, color: "#fff", letterSpacing: 4, textTransform: "uppercase", textShadow: eggWasShot ? "0 0 24px rgba(255,80,0,0.9), 0 0 50px rgba(255,80,0,0.45)" : "0 0 24px rgba(100,200,255,0.9), 0 0 50px rgba(100,200,255,0.45)", animation: "glow-text 2.5s ease-in-out infinite" }}>{eggWasShot ? "Cracked!" : "Game Over"}</h1>
                {eggWasShot && (<div style={{ fontSize: 14, color: "rgba(255,180,80,0.9)", marginTop: 10, letterSpacing: 1 }}>🥚 The Last Egg is gone forever...</div>)}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "rgba(100,200,255,0.08)", borderRadius: 10, padding: "10px 18px", border: "1px solid rgba(100,200,255,0.2)" }}>
                  <AlienIcon />
                  <span style={{ fontSize: 11, color: "rgba(100,200,255,0.7)", letterSpacing: 2, textTransform: "uppercase" }}>Caught</span>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{score}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "rgba(255,215,0,0.08)", borderRadius: 10, padding: "10px 18px", border: "1px solid rgba(255,215,0,0.2)" }}>
                  <span style={{ fontSize: 22 }}>🪙</span>
                  <span style={{ fontSize: 11, color: "rgba(255,215,0,0.7)", letterSpacing: 2, textTransform: "uppercase" }}>Coins</span>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{coins}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "rgba(255,215,0,0.06)", borderRadius: 10, padding: "10px 18px", border: "1px solid rgba(255,215,0,0.15)" }}>
                  <span style={{ fontSize: 22 }}>⭐</span>
                  <span style={{ fontSize: 11, color: "rgba(255,215,0,0.7)", letterSpacing: 2, textTransform: "uppercase" }}>Level</span>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{level}</span>
                </div>
              </div>
              <button className="play-btn" onClick={handleRestart} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 0 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(100,200,255,0.6)", animation: "pulse-ring 1.8s ease-out infinite" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(100,200,255,0.4)", animation: "pulse-ring2 1.8s ease-out infinite 0.4s" }} />
                <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "conic-gradient(from 0deg, rgba(100,200,255,0.8), rgba(180,100,255,0.8), rgba(100,200,255,0), rgba(100,200,255,0.8))", animation: "spin-border 2s linear infinite" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#0d1230", margin: 2 }} />
                <div className="play-circle" style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(100,200,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div className="play-triangle" style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: "30px solid rgba(100,200,255,0.9)", marginLeft: 8 }} />
                </div>
              </button>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase" }}>Play again</div>
            </div>
          )}

          {isMissionComplete && (
            <div style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #030d08 0%, #071a10 45%, #0a1f08 100%)", fontFamily: "'Arial', sans-serif", gap: 26 }}>
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                {Array.from({ length: 50 }).map((_, i) => (
                  <div key={i} style={{ position: "absolute", left: `${Math.sin(i * 2.3) * 50 + 50}%`, top: `${Math.cos(i * 1.9) * 50 + 50}%`, width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: "50%", background: i % 5 === 0 ? "#FFD700" : "#fff", opacity: 0.25 + (i % 5) * 0.12 }} />
                ))}
              </div>
              <div style={{ fontSize: 72, animation: "float-title 3s ease-in-out infinite", filter: "drop-shadow(0 0 24px rgba(255,210,60,0.9)) drop-shadow(0 0 48px rgba(100,255,160,0.5))" }}>🥚</div>
              <div style={{ textAlign: "center", animation: "float-title 3.5s ease-in-out infinite 0.3s" }}>
                <div style={{ fontSize: 12, letterSpacing: 6, color: "rgba(100,255,160,0.75)", marginBottom: 8, textTransform: "uppercase" }}>All aliens safe</div>
                <h1 style={{ margin: 0, fontSize: "clamp(26px, 5.5vw, 44px)", fontWeight: 900, color: "#fff", letterSpacing: 4, textTransform: "uppercase", textShadow: "0 0 24px rgba(100,255,160,0.9), 0 0 50px rgba(255,210,60,0.5)" }}>Mission Complete</h1>
                <div style={{ fontSize: 14, color: "rgba(200,255,220,0.65)", marginTop: 10, letterSpacing: 1 }}>The last egg is safe. The species will survive.</div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { icon: "👽", label: "Caught", value: score,  color: "rgba(100,255,160,0.1)", border: "rgba(100,255,160,0.25)", text: "rgba(100,255,160,0.8)" },
                  { icon: "🪙", label: "Coins",  value: coins,  color: "rgba(255,215,0,0.1)",   border: "rgba(255,215,0,0.25)",   text: "rgba(255,215,0,0.8)" },
                  { icon: "⭐", label: "Level",  value: level,  color: "rgba(255,215,0,0.08)",  border: "rgba(255,215,0,0.2)",    text: "rgba(255,215,0,0.7)" },
                ].map(({ icon, label, value, color, border, text }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: color, borderRadius: 10, padding: "10px 20px", border: `1px solid ${border}` }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <span style={{ fontSize: 11, color: text, letterSpacing: 2, textTransform: "uppercase" }}>{label}</span>
                    <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{value}</span>
                  </div>
                ))}
              </div>
              <button className="play-btn" onClick={handleRestart} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 0 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(100,255,160,0.6)", animation: "pulse-ring 1.8s ease-out infinite" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(100,255,160,0.4)", animation: "pulse-ring2 1.8s ease-out infinite 0.4s" }} />
                <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "conic-gradient(from 0deg, rgba(100,255,160,0.8), rgba(255,210,60,0.8), rgba(100,255,160,0), rgba(100,255,160,0.8))", animation: "spin-border 2s linear infinite" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#030d08", margin: 2 }} />
                <div className="play-circle" style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(100,255,160,0.12)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div className="play-triangle" style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: "30px solid rgba(100,255,160,0.9)", marginLeft: 8 }} />
                </div>
              </button>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase" }}>Play again</div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
