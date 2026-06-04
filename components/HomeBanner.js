import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";

const HeaderBanner = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const starColors = ["#FFFFFF", "#C8E6FF", "#FFE8A0", "#E8C8FF", "#A0FFE8"];
    const stars = [];
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
    const nebulaClouds = [];
    for (let i = 0; i < 6; i++) {
      nebulaClouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 220 + 120,
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
        speed: Math.random() * 0.06 + 0.02,
      });
    }

    let animId;

    const draw = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "#06091c");
      grad.addColorStop(0.3, "#0e1035");
      grad.addColorStop(0.6, "#150d2e");
      grad.addColorStop(1, "#1a0828");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nebulaClouds.forEach((cloud) => {
        cloud.y += cloud.speed;
        if (cloud.y > canvas.height + cloud.radius) { cloud.y = -cloud.radius; cloud.x = Math.random() * canvas.width; }
        const g = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
        const c = cloud.color;
        g.addColorStop(0, c.replace(/[\d.]+\)$/, "0.22)"));
        g.addColorStop(0.4, c);
        g.addColorStop(0.8, c.replace(/[\d.]+\)$/, "0.06)"));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2); ctx.fill();
      });

      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
        star.brightness += star.twinkleSpeed;
        const b = (Math.sin(star.brightness) + 1) / 2;
        const alpha = b * 0.85 + 0.15;
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

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full block"
      />

      <div className="banner-content">
        <div className="banner-float">
          <div className="banner-subtitle">Welcome to</div>
          <div className="banner-title">
            <Typewriter
              words={[
                "Hello there!",
                "My name is Yana.",
                "I am showing my progress on a browser game.",
                "Welcome to AlifallX: Don't Leave Them Behind.",
              ]}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={120}
              deleteSpeed={80}
              delaySpeed={950}
            />
          </div>
        </div>

        <h1 className="banner-heading">AlifallX: Don&apos;t Leave Them Behind</h1>

        <div className="flex flex-wrap gap-5 justify-center">
          <Link className="banner-btn" href="/game">
            <span /><span /><span /><span />Play Game
          </Link>
          <Link className="banner-btn" href="https://buymeacoffee.com/yanashellii" target="_blank" rel="noopener noreferrer">
            <span /><span /><span /><span />Support
          </Link>
        </div>

        <a href="#aboutgame" aria-label="Scroll down to game information" className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-ball" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default HeaderBanner;
