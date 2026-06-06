import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Custom500() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (stars) {
        stars.forEach((star) => {
          if (star.x > canvas.width) star.x = Math.random() * canvas.width;
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const starColors = ["#FFFFFF", "#C8E6FF", "#FFE8A0", "#E8C8FF", "#A0FFE8"];
    let stars = Array.from({ length: 140 }, (_, i) => {
      const layer = i < 70 ? 0 : i < 110 ? 1 : 2;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: layer === 0 ? Math.random() * 1 + 0.3 : layer === 1 ? Math.random() * 1.5 + 0.8 : Math.random() * 2.5 + 1.5,
        speed: layer === 0 ? Math.random() * 0.12 + 0.04 : layer === 1 ? Math.random() * 0.25 + 0.1 : Math.random() * 0.5 + 0.25,
        brightness: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        bright: layer === 2 && Math.random() > 0.5,
      };
    });

    // Meteors crashing — server got hit
    const meteors = Array.from({ length: 6 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      vx: Math.random() * 1.5 + 0.5,
      vy: Math.random() * 2.5 + 1.5,
      size: Math.random() * 10 + 6,
      color: ["#ff6b35", "#ff4757", "#ffa502", "#ff7f50"][Math.floor(Math.random() * 4)],
      trail: [],
    }));

    // Broken ship
    const ship = {
      x: 0,
      y: 0,
      wobble: 0,
      smokeParticles: [],
    };

    let animId;

    const drawBrokenShip = (sx, sy, wobble) => {
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(Math.sin(wobble) * 0.25);

      // main body (cracked)
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(14, 10);
      ctx.lineTo(8, 18);
      ctx.lineTo(-8, 18);
      ctx.lineTo(-14, 10);
      ctx.closePath();
      ctx.fillStyle = "#1e3a5f";
      ctx.fill();
      ctx.strokeStyle = "#64C8FF";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // crack
      ctx.strokeStyle = "#ff4757";
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-2, -10); ctx.lineTo(6, 2); ctx.lineTo(0, 12); ctx.stroke();

      // cockpit
      ctx.beginPath();
      ctx.ellipse(0, -8, 7, 9, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100,200,255,0.3)";
      ctx.fill();
      ctx.strokeStyle = "#64C8FF";
      ctx.lineWidth = 1;
      ctx.stroke();

      // wings
      ctx.fillStyle = "#2a4a7f";
      ctx.strokeStyle = "#64C8FF";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-14, 10); ctx.lineTo(-26, 22); ctx.lineTo(-10, 18); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(14, 10); ctx.lineTo(26, 22); ctx.lineTo(10, 18); ctx.closePath();
      ctx.fill(); ctx.stroke();

      // thruster glow (sputtering — flickers)
      const flicker = Math.random();
      if (flicker > 0.3) {
        const tg = ctx.createRadialGradient(0, 22, 0, 0, 26, 14 * flicker);
        tg.addColorStop(0, "rgba(255,120,0,0.9)");
        tg.addColorStop(0.5, "rgba(255,60,0,0.5)");
        tg.addColorStop(1, "rgba(255,0,0,0)");
        ctx.fillStyle = tg;
        ctx.beginPath(); ctx.arc(0, 22, 14 * flicker, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    };

    const drawMeteor = (meteor) => {
      meteor.trail.forEach((pt, i) => {
        const alpha = (i / meteor.trail.length) * 0.5;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = meteor.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, meteor.size * (i / meteor.trail.length) * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      const mg = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, meteor.size);
      mg.addColorStop(0, "#fff");
      mg.addColorStop(0.3, meteor.color);
      mg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = mg;
      ctx.beginPath(); ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2); ctx.fill();
    };

    const draw = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "#1a0505");
      grad.addColorStop(0.3, "#1a0a0e");
      grad.addColorStop(0.6, "#150d2e");
      grad.addColorStop(1, "#0e1035");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
        star.brightness += star.twinkleSpeed;
        const b = (Math.sin(star.brightness) + 1) / 2;
        ctx.globalAlpha = b * 0.7 + 0.1;
        if (star.bright) {
          const sg = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          sg.addColorStop(0, star.color); sg.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = star.color;
        ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      });

      meteors.forEach((meteor) => {
        meteor.trail.push({ x: meteor.x, y: meteor.y });
        if (meteor.trail.length > 18) meteor.trail.shift();
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        if (meteor.y > canvas.height + 20 || meteor.x > canvas.width + 20) {
          meteor.x = Math.random() * canvas.width * 0.6;
          meteor.y = -meteor.size * 3;
          meteor.trail = [];
        }
        drawMeteor(meteor);
      });

      ship.wobble += 0.05;
      ship.x = canvas.width * 0.72;
      ship.y = canvas.height * 0.35 + Math.sin(ship.wobble * 0.8) * 6;

      ship.smokeParticles.push({
        x: ship.x + (Math.random() - 0.5) * 10,
        y: ship.y + 22,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.5 + 0.3,
        life: 1,
        size: Math.random() * 5 + 3,
      });
      ship.smokeParticles = ship.smokeParticles.filter((p) => p.life > 0);
      ship.smokeParticles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.025;
        ctx.globalAlpha = p.life * 0.35;
        ctx.fillStyle = "#888";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      });

      drawBrokenShip(ship.x, ship.y, ship.wobble);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <Head>
        <title>500 — Server Error | AlifallX</title>
        <meta name="description" content="Something went wrong on our end. Please try again." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="error-page error-page--500">
        <canvas ref={canvasRef} aria-hidden="true" className="error-page__canvas" />
        <div className="error-page__content">
          <p className="error-page__code error-page__code--red">500</p>
          <h1 className="error-page__title">Meteor Strike!</h1>
          <p className="error-page__message">
            A rogue meteor hit our server.<br />
            Damage report: catastrophic. ETA: soon-ish.<br />
            Our ship is wobbling but we&apos;re still flying.
          </p>
          <div className="error-page__actions">
            <Link href="/" className="banner-btn">
              <span /><span /><span /><span />Back to Base
            </Link>
            <Link href="/game" className="banner-btn">
              <span /><span /><span /><span />Play Game
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
