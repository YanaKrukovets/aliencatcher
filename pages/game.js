import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const NAV_HEIGHT = 90;
const HUD_HEIGHT = 60;
const GAME_MAX_WIDTH = 800;

const LEVEL_COLORS = ["#64C8FF", "#CC88FF", "#FF6060", "#60FFC0"];
const getLevelColor = (lvl) => LEVEL_COLORS[Math.min(lvl - 1, LEVEL_COLORS.length - 1)];

const LEVEL_PALETTES = [
  { bg: ["#06091c", "#0e1035", "#150d2e", "#1a0828"] }, // 1: blue/indigo
  { bg: ["#110015", "#220030", "#2a0045", "#1a0030"] }, // 2: deep purple
  { bg: ["#1a0008", "#2e0412", "#200210", "#150005"] }, // 3: crimson
  { bg: ["#001518", "#002835", "#001e28", "#001015"] }, // 4+: teal
];

export default function Game() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [restartKey, setRestartKey] = useState(0);
  const [levelUpBanner, setLevelUpBanner] = useState(null);

  const handleRestart = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setIsGameOver(false);
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
    let rockTimer = 0;
    let animFrameId = null;
    let levelUpTimerId = null;
    let readyFrames = 180; // 3-second countdown at 60fps
    let lastCountdownShown = 3;
    setCountdown(3);

    const getRockInterval = () => Math.max(60, 220 - (levelVal - 1) * 20);
    const getAlienSpeed = () => 0.8 + (levelVal - 1) * 0.2;
    const getRockSpeed = () => 0.6 + (levelVal - 1) * 0.15;

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
        this.width = 80 + Math.random() * 220;
        this.height = 70 + Math.random() * 50;
        // Spawn flush with left or right edge
        this.side = Math.random() > 0.5 ? "left" : "right";
        if (this.side === "left") {
          this.x = 0;
        } else {
          this.x = canvas.width - this.width;
        }
        this.y = -this.height;
        this.speed = getRockSpeed() + Math.random() * 0.5;
        this.hasAlien = Math.random() > 0.35;
        this.scale = 0;
      }

      update() {
        this.y += this.speed;
        if (this.scale < 1) this.scale = Math.min(1, this.scale + 0.08);
      }

      draw() {
        const img = this.side === "left" ? rockImgLeft : rockImgRight;
        const loaded = this.side === "left" ? rockImgLeftLoaded : rockImgRightLoaded;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(this.scale, this.scale);
        if (loaded) {
          ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
          ctx.fillStyle = "#5a4a3a";
          ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
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
      constructor(rock) {
        this.rock = rock;
        this.width = 30;
        this.height = 35;
        this.x = rock.side === "right" ? rock.x + rock.width - 40 : rock.x + 10;
        this.y = rock.y - this.height;
        this.onRock = true;
        this.direction = rock.side === "right" ? -1 : 1;
        this.walkSpeed = getAlienSpeed();
        this.fallSpeed = 0;
        this.gravity = 0.04;
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
        this.color = ["#7CFC00", "#00FF7F", "#32CD32", "#ADFF2F"][Math.floor(Math.random() * 4)];
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
            this.fallSpeed = this.rock.speed * 0.3;
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

        const bodyColor = this.color === "#7CFC00" ? "#6BEB00" : this.color === "#00FF7F" ? "#00EE6F" : this.color === "#32CD32" ? "#2BBD2B" : "#9CEE2E";
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

        ctx.restore();
      }

      isOffScreen() { return this.y > canvas.height; }
      isDoneBeingCaught() { return this.caught && this.catchScale >= 2; }

      checkCatch() {
        return this.x + this.width / 2 - 10 > ship.x &&
               this.x + this.width / 2 + 10 < ship.x + ship.width &&
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

    // ---- DRAW ----

    function drawBackground() {
      const pal = LEVEL_PALETTES[Math.min(levelVal - 1, LEVEL_PALETTES.length - 1)];
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
      setLives(livesVal);

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
      setIsGameOver(true);
    }

    function updateGame() {
      if (!gameRunning) return;

      if (keys["ArrowLeft"] || keys["a"]) {
        ship.x = Math.max(0, ship.x - ship.speed);
        ship.tilt = Math.max(-0.2, ship.tilt - 0.03);
      } else if (keys["ArrowRight"] || keys["d"]) {
        ship.x = Math.min(canvas.width - ship.width, ship.x + ship.speed);
        ship.tilt = Math.min(0.2, ship.tilt + 0.03);
      } else {
        ship.tilt *= 0.85;
      }

      // Level 1→2 at 30pts, then every 50pts after
      const newLevel = scoreVal < 30 ? 1 : Math.floor((scoreVal - 30) / 50) + 2;
      if (newLevel !== levelVal) {
        levelVal = newLevel;
        setLevel(levelVal);
        setLevelUpBanner(levelVal);
        if (levelUpTimerId) clearTimeout(levelUpTimerId);
        levelUpTimerId = setTimeout(() => setLevelUpBanner(null), 1800);
      }

      rockTimer++;
      if (rockTimer >= getRockInterval()) {
        rockTimer = 0;
        const rock = new Rock();
        rocks.push(rock);
        if (rock.hasAlien) aliens.push(new Alien(rock));
      }

      rocks = rocks.filter((rock) => {
        rock.update();
        if (!invulnerable && rock.checkCollision(ship)) loseLife();
        return !rock.isOffScreen();
      });

      for (let i = aliens.length - 1; i >= 0; i--) {
        const alien = aliens[i];
        alien.update();

        if (alien.isDoneBeingCaught()) { aliens.splice(i, 1); continue; }

        if (!alien.caught && !alien.onRock && alien.checkCatch()) {
          alien.caught = true;
          scoreVal += 10;
          setScore(scoreVal);
          for (let j = 0; j < 15; j++) {
            particles.push(new Particle(alien.x+10, alien.y+12, alien.color));
          }
        } else if (!alien.caught && alien.isOffScreen()) {
          aliens.splice(i, 1);
        }
      }

      particles = particles.filter((p) => { p.update(); return p.life > 0; });
    }

    function drawFrame() {
      drawBackground();
      drawStars();
      rocks.forEach((r) => r.draw());
      aliens.forEach((a) => a.draw());
      particles.forEach((p) => p.draw());
      drawShip();
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
      animFrameId = requestAnimationFrame(gameLoop);
    }

    // ---- CONTROLS ----
    const onKeyDown = (e) => { keys[e.key] = true; };
    const onKeyUp = (e) => { keys[e.key] = false; };

    const onTouchStart = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const relX = e.touches[0].clientX - rect.left;
      if (relX < rect.width / 2) { keys["ArrowLeft"] = true; keys["ArrowRight"] = false; }
      else { keys["ArrowRight"] = true; keys["ArrowLeft"] = false; }
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

    animFrameId = requestAnimationFrame(gameLoop);

    return () => {
      gameRunning = false;
      cancelAnimationFrame(animFrameId);
      if (flashIntervalId) clearInterval(flashIntervalId);
      if (levelUpTimerId) clearTimeout(levelUpTimerId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [restartKey, gameStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Alien Rescue — Cosmic Adventure</title>
        <meta name="description" content="Catch the falling aliens with your spaceship!" />
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
          gap: "clamp(1rem, 4vw, 3rem)",
          flexShrink: 0,
          userSelect: "none",
          fontFamily: "'Arial', sans-serif",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(100,200,255,0.1)", borderRadius: 8,
            padding: "6px 16px", border: "1px solid rgba(100,200,255,0.25)",
          }}>
            <span style={{ fontSize: 20 }}>👾</span>
            <span style={{ color: "#64C8FF", fontSize: 16, fontWeight: "bold", letterSpacing: 1 }}>
              Score: <span style={{ color: "#fff", fontSize: 20 }}>{score}</span>
            </span>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,107,107,0.1)", borderRadius: 8,
            padding: "6px 16px", border: "1px solid rgba(255,107,107,0.25)",
          }}>
            <span style={{ color: "#ff9999", fontSize: 14, fontWeight: "bold", letterSpacing: 1, marginRight: 4 }}>Lives</span>
            <span style={{ fontSize: 18, letterSpacing: 2 }}>
              {"❤️".repeat(Math.max(0, lives))}{"🖤".repeat(Math.max(0, 3 - lives))}
            </span>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,215,0,0.1)", borderRadius: 8,
            padding: "6px 16px", border: "1px solid rgba(255,215,0,0.25)",
          }}>
            <span style={{ fontSize: 20 }}>⭐</span>
            <span style={{ color: "#FFD700", fontSize: 16, fontWeight: "bold", letterSpacing: 1 }}>
              Level: <span style={{ color: "#fff", fontSize: 20 }}>{level}</span>
            </span>
          </div>
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
                  Alien Catcher
                </h1>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8, letterSpacing: 2 }}>
                  Catch the falling aliens. Dodge the rocks.
                </div>
              </div>

              {/* Play Button */}
              <button
                className="play-btn"
                onClick={() => setGameStarted(true)}
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
              background: "rgba(0,0,0,0.85)",
              fontFamily: "'Arial', sans-serif",
            }}>
              <div style={{
                background: "linear-gradient(135deg, rgba(10,14,39,0.97), rgba(26,26,62,0.97))",
                border: "2px solid rgba(255,107,107,0.6)",
                borderRadius: 16, padding: "36px 48px", textAlign: "center", color: "#fff",
                boxShadow: "0 0 40px rgba(255,107,107,0.2)",
              }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🚀</div>
                <h2 style={{ color: "#ff6b6b", marginTop: 0, fontSize: 32, marginBottom: 8 }}>Game Over!</h2>
                <p style={{ fontSize: 18, color: "#aaa", margin: "4px 0" }}>Final Score: <strong style={{ color: "#fff", fontSize: 22 }}>{score}</strong></p>
                <p style={{ fontSize: 16, color: "#aaa", margin: "4px 0 20px" }}>Level reached: <strong style={{ color: "#FFD700" }}>{level}</strong></p>
                <button
                  onClick={handleRestart}
                  style={{
                    background: "linear-gradient(135deg, #4CAF50, #2e7d32)",
                    color: "#fff", border: "none",
                    padding: "13px 36px", fontSize: 18, borderRadius: 8,
                    cursor: "pointer", fontWeight: "bold",
                    boxShadow: "0 4px 15px rgba(76,175,80,0.4)",
                  }}
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
