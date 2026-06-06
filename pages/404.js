import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Custom404() {
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

    // Drifting alien — lost in space
    const alien = {
      x: canvas.width * 0.75,
      y: canvas.height * 0.3,
      vx: 0.22,
      vy: 0.14,
      angle: 0,
      wobble: 0,
    };

    let animId;

    const drawAlien = (ax, ay, angle) => {
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(angle);

      // body
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 16, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#7effb2";
      ctx.fill();
      ctx.strokeStyle = "#00e676";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // dome
      ctx.beginPath();
      ctx.ellipse(0, -10, 13, 10, 0, Math.PI, Math.PI * 2);
      ctx.fillStyle = "rgba(180,255,220,0.55)";
      ctx.fill();
      ctx.strokeStyle = "#00e676";
      ctx.lineWidth = 1;
      ctx.stroke();

      // eyes
      ctx.fillStyle = "#111";
      ctx.beginPath(); ctx.ellipse(-7, -4, 4, 5, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(7, -4, 4, 5, 0.3, 0, Math.PI * 2); ctx.fill();

      // pupils
      ctx.fillStyle = "#00ffaa";
      ctx.beginPath(); ctx.arc(-7, -4, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -4, 1.8, 0, Math.PI * 2); ctx.fill();

      // antennae
      ctx.strokeStyle = "#00e676";
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-6, -16); ctx.lineTo(-10, -26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(6, -16); ctx.lineTo(10, -26); ctx.stroke();
      ctx.fillStyle = "#ff6ee7";
      ctx.beginPath(); ctx.arc(-10, -27, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(10, -27, 2.5, 0, Math.PI * 2); ctx.fill();

      // legs
      ctx.strokeStyle = "#00e676"; ctx.lineWidth = 1.2;
      [[-14, 8], [-7, 12], [7, 12], [14, 8]].forEach(([lx, ly]) => {
        ctx.beginPath(); ctx.moveTo(lx * 0.7, 12); ctx.lineTo(lx, ly + 8); ctx.stroke();
      });

      ctx.restore();
    };

    const draw = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "#06091c");
      grad.addColorStop(0.4, "#0e1035");
      grad.addColorStop(0.7, "#150d2e");
      grad.addColorStop(1, "#1a0828");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
        star.brightness += star.twinkleSpeed;
        const b = (Math.sin(star.brightness) + 1) / 2;
        ctx.globalAlpha = b * 0.85 + 0.15;
        if (star.bright) {
          const sg = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          sg.addColorStop(0, star.color); sg.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = star.color;
        ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      });

      alien.x += alien.vx;
      alien.y += alien.vy;
      alien.wobble += 0.04;
      alien.angle = Math.sin(alien.wobble) * 0.18;
      if (alien.x > canvas.width + 40) alien.x = -40;
      if (alien.x < -40) alien.x = canvas.width + 40;
      if (alien.y > canvas.height + 40) alien.y = -40;
      if (alien.y < -40) alien.y = canvas.height + 40;

      drawAlien(alien.x, alien.y + Math.sin(alien.wobble * 0.7) * 5, alien.angle);

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
        <title>404 — Page Not Found | AlifallX</title>
        <meta name="description" content="This page does not exist. Head back to AlifallX to play the game." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="error-page">
        <canvas ref={canvasRef} aria-hidden="true" className="error-page__canvas" />
        <div className="error-page__content">
          <p className="error-page__code">404</p>
          <h1 className="error-page__title">Lost in Space</h1>
          <p className="error-page__message">
            One of our aliens drifted off and took this page with them.<br />
            No signal. No coordinates. Just vibes and stardust.
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
