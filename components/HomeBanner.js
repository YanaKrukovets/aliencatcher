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
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />

      <style>{`
        @keyframes float-banner {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow-cyan {
          0%, 100% { text-shadow: 0 0 20px rgba(100,200,255,0.8), 0 0 40px rgba(100,200,255,0.4); }
          50% { text-shadow: 0 0 30px rgba(100,200,255,1), 0 0 60px rgba(100,200,255,0.6), 0 0 80px rgba(100,200,255,0.3); }
        }
        @keyframes scroll-bob {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
        .banner-btn {
          position: relative;
          display: inline-block;
          padding: 14px 36px;
          text-transform: uppercase;
          letter-spacing: 4px;
          text-decoration: none;
          font-size: 18px;
          font-family: Arial, sans-serif;
          font-weight: bold;
          overflow: hidden;
          transition: color 0.2s, background 0.2s;
          color: #64C8FF;
        }
        .banner-btn:hover {
          color: #050c25;
          background: #64C8FF;
          box-shadow: 0 0 12px #64C8FF, 0 0 40px rgba(100,200,255,0.6), 0 0 80px rgba(100,200,255,0.3);
          transition-delay: 0.7s;
        }
        .banner-btn span { position: absolute; display: block; }
        .banner-btn span:nth-child(1) { top:0; left:-100%; width:100%; height:2px; background:linear-gradient(90deg,transparent,#64C8FF); }
        .banner-btn:hover span:nth-child(1) { left:100%; transition:0.7s; }
        .banner-btn span:nth-child(2) { top:-100%; right:0; width:2px; height:100%; background:linear-gradient(180deg,transparent,#64C8FF); }
        .banner-btn:hover span:nth-child(2) { top:100%; transition:0.7s; transition-delay:0.25s; }
        .banner-btn span:nth-child(3) { bottom:0; right:-100%; width:100%; height:2px; background:linear-gradient(270deg,transparent,#64C8FF); }
        .banner-btn:hover span:nth-child(3) { right:100%; transition:0.7s; transition-delay:0.5s; }
        .banner-btn span:nth-child(4) { bottom:-100%; left:0; width:2px; height:100%; background:linear-gradient(360deg,transparent,#64C8FF); }
        .banner-btn:hover span:nth-child(4) { bottom:100%; transition:0.7s; transition-delay:0.75s; }
      `}</style>

      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: "100vh",
        padding: "120px 24px 100px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        gap: 36,
      }}>
        <div style={{ animation: "float-banner 3s ease-in-out infinite" }}>
          <div style={{ fontSize: 13, letterSpacing: 6, color: "rgba(100,200,255,0.65)", marginBottom: 14, textTransform: "uppercase" }}>
            Welcome to
          </div>
          <div style={{
            fontSize: "clamp(20px, 4vw, 40px)",
            fontWeight: 700,
            color: "#fff",
            animation: "glow-cyan 2.5s ease-in-out infinite",
            lineHeight: 1.5,
            maxWidth: 720,
          }}>
            <Typewriter
              words={[
                "Hello there!",
                "My name is Yana.",
                "I am showing my progress on a browser game.",
                "Welcome to Alifallx: Don't Leave Them Behind.",
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

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <Link className="banner-btn" href="/game">
            <span /><span /><span /><span />Play Game
          </Link>
          <Link className="banner-btn" href="https://buymeacoffee.com/yanashellii" target="_blank">
            <span /><span /><span /><span />Support
          </Link>
        </div>

        <a href="#aboutgame" style={{
          position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          color: "rgba(100,200,255,0.5)", textDecoration: "none",
        }}>
          <div style={{
            width: 26, height: 42, borderRadius: 13,
            border: "2px solid rgba(100,200,255,0.4)",
            display: "flex", justifyContent: "center", alignItems: "flex-start",
            padding: "7px 0",
          }}>
            <div style={{
              width: 4, height: 8, borderRadius: 2,
              background: "rgba(100,200,255,0.7)",
              animation: "scroll-bob 1.6s ease-in-out infinite",
            }} />
          </div>
        </a>
      </div>
    </div>
  );
};

export default HeaderBanner;
