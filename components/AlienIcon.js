import { useEffect, useRef } from "react";

export default function AlienIcon({ color = "#7CFC00" }) {
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

  return <canvas ref={ref} width={30} height={36} className="block w-[20px] h-[24px]" aria-hidden="true" />;
}
