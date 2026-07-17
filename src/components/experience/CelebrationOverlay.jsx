import { useEffect, useRef } from 'react';

function spawnParticles(canvas, colors, count = 150) {
  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: count }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 12,
    vy: (Math.random() - 0.5) * 12 - 4,
    size: 3 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 1,
    decay: 0.008 + Math.random() * 0.01,
    gravity: 0.15,
  }));

  let animId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach((p) => {
      if (p.life <= 0) return;
      alive = true;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    if (alive) animId = requestAnimationFrame(animate);
  }

  animate();
  return () => cancelAnimationFrame(animId);
}

export default function CelebrationOverlay({ trigger, colors = ['#a78bfa', '#fbbf24', '#c4b5fd', '#ffffff'] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger || !canvasRef.current) return undefined;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cleanup = spawnParticles(canvas, colors);
    return cleanup;
  }, [trigger, colors]);

  if (!trigger) return null;

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[200]" />;
}