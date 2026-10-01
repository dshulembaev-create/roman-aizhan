import { useEffect, useRef } from 'react';

export default function PlanesCanvas({ name1, name2 }) {
  const ref = useRef(null);
  const state = useRef({ planes: [], timer: 0, animId: null });

  const SYMBOLS = ['❤', '💋', '✨', '♡', '💕', name1, name2];

  function createPlane(fromRight, W, H) {
    const yMin = H * 0.08, yMax = H * 0.6;
    const startY = yMin + Math.random() * (yMax - yMin);
    const endY = yMin + Math.random() * (yMax - yMin);
    const symCount = 7 + Math.floor(Math.random() * 5);
    const syms = Array.from({ length: symCount }, (_, i) => ({
      sym: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      tAt: 0.04 + (i / symCount) * 0.78,
      placed: false, x: 0, y: 0, age: 0,
      size: Math.random() > 0.55 ? 17 + Math.floor(Math.random() * 5) : 22 + Math.floor(Math.random() * 7),
      drift: (Math.random() - 0.5) * 16,
      rise: 14 + Math.random() * 18,
      color: ['#ff6b9d','#ffb3cc','#ff9ec8','#ffd6e7','#c9a7ff','#ffcce5','#ff4d8d'][Math.floor(Math.random() * 7)],
    }));
    return { fromRight, t: 0, speed: 0.0012 + Math.random() * 0.0013, startY, endY, syms, done: false };
  }

  function drawPlane(ctx, p, W) {
    const t = p.t;
    const x = p.fromRight ? W - t * W : t * W;
    const midY = Math.min(p.startY, p.endY) - (ctx.canvas.height * 0.05);
    const y = (1-t)*(1-t)*p.startY + 2*(1-t)*t*midY + t*t*p.endY;
    const dt = 0.01, t2 = Math.min(t + dt, 1);
    const x2 = p.fromRight ? W - t2*W : t2*W;
    const y2 = (1-t2)*(1-t2)*p.startY + 2*(1-t2)*t2*midY + t2*t2*p.endY;
    const angle = Math.atan2(y2-y, x2-x);

    p.syms.forEach(s => {
      if (!s.placed && t >= s.tAt) {
        s.placed = true;
        const tS = s.tAt;
        const xS = p.fromRight ? W - tS*W : tS*W;
        const yS = (1-tS)*(1-tS)*p.startY + 2*(1-tS)*tS*midY + tS*tS*p.endY;
        s.x = xS; s.y = yS; s.age = 0;
      }
      if (s.placed) {
        s.age++;
        const a = Math.max(0, 1 - s.age / 240);
        if (a <= 0) return;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.font = (s.sym.length > 2 ? 'italic ' : '') + s.size + "px 'Cormorant Garamond', Georgia, serif";
        ctx.fillStyle = s.color;
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 5;
        ctx.textAlign = 'center';
        ctx.fillText(s.sym, s.x + s.drift * (s.age / 140), s.y - s.rise * (s.age / 140));
        ctx.restore();
      }
    });

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha = 0.94;
    ctx.beginPath(); ctx.moveTo(24,0); ctx.lineTo(-18,-6); ctx.lineTo(-13,0); ctx.lineTo(-18,6); ctx.closePath();
    ctx.fillStyle = 'white'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(3,0); ctx.lineTo(-5,-18); ctx.lineTo(-11,-13); ctx.lineTo(-7,0); ctx.closePath();
    ctx.fillStyle = 'rgba(255,200,220,0.92)'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(3,0); ctx.lineTo(-5,18); ctx.lineTo(-11,13); ctx.lineTo(-7,0); ctx.closePath();
    ctx.fillStyle = 'rgba(255,200,220,0.92)'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-13,0); ctx.lineTo(-18,-9); ctx.lineTo(-21,-7); ctx.lineTo(-16,0); ctx.lineTo(-21,7); ctx.lineTo(-18,9); ctx.closePath();
    ctx.fillStyle = 'rgba(255,220,235,0.88)'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(21,-2); ctx.lineTo(3,-4); ctx.lineTo(-8,-5);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 0.9; ctx.stroke();
    ctx.restore();
  }

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = state.current;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = () => {
      while (s.planes.length < 6) s.planes.push(createPlane(Math.random() > 0.5, canvas.width, canvas.height));
    };
    spawn(); spawn(); spawn(); spawn();

    const loop = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      s.timer++;
      if (s.timer > 140) { s.timer = 0; spawn(); }
      s.planes = s.planes.filter(p => !p.done);
      s.planes.forEach(p => {
        p.t += p.speed;
        if (p.t >= 1) p.done = true;
        else drawPlane(ctx, p, W);
      });
      s.animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      if (s.animId) cancelAnimationFrame(s.animId);
    };
  }, [name1, name2]);

  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:3 }}/>;
}
