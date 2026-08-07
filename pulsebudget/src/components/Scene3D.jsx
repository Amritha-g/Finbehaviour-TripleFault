import { useEffect, useRef, useState } from 'react';

export default function Scene3D({ onSatelliteClick }) {
  const canvasRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const shockwavesRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      setMouse({ x, y });
    };

    const handleClick = (e) => {
      // Spawn a 3D ring shockwave at click coordinates
      shockwavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.45,
        opacity: 0.8,
        color: Math.random() > 0.5 ? '#ec4899' : '#06b6d4',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // 60FPS Dynamic Canvas Renderer for Liquid Collision + Particles + Satellites
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize 3D Floating Particles
    const particleCount = 120;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: (Math.random() - 0.5) * canvas.width * 1.2,
      y: (Math.random() - 0.5) * canvas.height * 1.2,
      z: Math.random() * 800 + 100,
      size: Math.random() * 2.5 + 1,
      speed: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.4 ? 'rgba(236, 72, 153, ' : 'rgba(6, 182, 212, ',
      alpha: Math.random() * 0.7 + 0.2,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitRadius: Math.random() * 250 + 150,
      orbitSpeed: (Math.random() - 0.5) * 0.015,
    }));

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;

      ctx.clearRect(0, 0, w, h);

      // ─── 1. DEEP MIDNIGHT BACKGROUND GRADIENT ───
      const bgGrad = ctx.createRadialGradient(
        centerX + mx * 40, centerY + my * 40, 0,
        centerX, centerY, Math.max(w, h) * 0.85
      );
      bgGrad.addColorStop(0, '#0a0818');
      bgGrad.addColorStop(0.5, '#05040d');
      bgGrad.addColorStop(1, '#020206');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // ─── 2. TOP NEON MAGENTA LIQUID SPHERE (INCOME CORE) ───
      ctx.save();
      const topSphereY = -h * 0.35 + my * 40;
      const topSphereX = centerX + mx * 60;
      const topRadius = Math.min(w, h) * 0.65;

      const magentaGrad = ctx.createRadialGradient(
        topSphereX, topSphereY + topRadius * 0.4, 0,
        topSphereX, topSphereY + topRadius * 0.4, topRadius
      );
      magentaGrad.addColorStop(0, 'rgba(244, 114, 182, 0.45)');
      magentaGrad.addColorStop(0.35, 'rgba(236, 72, 153, 0.35)');
      magentaGrad.addColorStop(0.65, 'rgba(168, 85, 247, 0.18)');
      magentaGrad.addColorStop(0.9, 'rgba(126, 34, 206, 0.05)');
      magentaGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = magentaGrad;
      ctx.beginPath();
      ctx.ellipse(
        topSphereX, topSphereY,
        topRadius * (1 + Math.sin(time * 0.8) * 0.02),
        topRadius * 0.65 * (1 + Math.cos(time * 0.8) * 0.02),
        0, 0, Math.PI * 2
      );
      ctx.fill();

      // Top Sphere Liquid Rim Glow Line
      ctx.shadowColor = '#f472b6';
      ctx.shadowBlur = 35;
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(
        topSphereX, topSphereY + topRadius * 0.48,
        topRadius * 0.72, topRadius * 0.18,
        0, 0.15 * Math.PI, 0.85 * Math.PI
      );
      ctx.stroke();
      ctx.restore();

      // ─── 3. BOTTOM CYBER CYAN LIQUID SPHERE (EXPENSE CORE) ───
      ctx.save();
      const botSphereY = h * 1.35 - my * 40;
      const botSphereX = centerX - mx * 60;
      const botRadius = Math.min(w, h) * 0.68;

      const cyanGrad = ctx.createRadialGradient(
        botSphereX, botSphereY - botRadius * 0.4, 0,
        botSphereX, botSphereY - botRadius * 0.4, botRadius
      );
      cyanGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      cyanGrad.addColorStop(0.35, 'rgba(6, 182, 212, 0.32)');
      cyanGrad.addColorStop(0.65, 'rgba(59, 130, 246, 0.18)');
      cyanGrad.addColorStop(0.9, 'rgba(30, 58, 138, 0.05)');
      cyanGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = cyanGrad;
      ctx.beginPath();
      ctx.ellipse(
        botSphereX, botSphereY,
        botRadius * (1 + Math.cos(time * 0.7) * 0.02),
        botRadius * 0.68 * (1 + Math.sin(time * 0.7) * 0.02),
        0, 0, Math.PI * 2
      );
      ctx.fill();

      // Bottom Sphere Liquid Rim Glow Line
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 35;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(
        botSphereX, botSphereY - botRadius * 0.48,
        botRadius * 0.74, botRadius * 0.18,
        0, 1.15 * Math.PI, 1.85 * Math.PI
      );
      ctx.stroke();
      ctx.restore();

      // ─── 4. COLLISION EVENT HORIZON PINCH & SWIRLING ENERGY ───
      ctx.save();
      const pinchY = centerY + my * 20;
      const pinchGrad = ctx.createRadialGradient(
        centerX, pinchY, 0,
        centerX, pinchY, 340
      );
      pinchGrad.addColorStop(0, 'rgba(216, 180, 254, 0.35)');
      pinchGrad.addColorStop(0.4, 'rgba(168, 85, 247, 0.2)');
      pinchGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.12)');
      pinchGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = pinchGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, pinchY, 400 + Math.sin(time * 2) * 20, 180 + Math.cos(time * 2) * 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Energy Ring Arcs
      for (let i = 0; i < 3; i++) {
        const ringRadiusX = 220 + i * 60 + Math.sin(time * 1.5 + i) * 15;
        const ringRadiusY = 60 + i * 20 + Math.cos(time * 1.5 + i) * 8;
        const angleOffset = time * (0.8 + i * 0.3);

        ctx.strokeStyle = i % 2 === 0 ? 'rgba(236, 72, 153, 0.4)' : 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = i % 2 === 0 ? '#ec4899' : '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.ellipse(centerX, pinchY, ringRadiusX, ringRadiusY, angleOffset * 0.2, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // ─── 5. DYNAMIC 3D COLLISION PARTICLES ───
      ctx.save();
      particles.forEach((p) => {
        p.orbitAngle += p.orbitSpeed;
        const pX = centerX + Math.cos(p.orbitAngle) * p.orbitRadius + mx * (p.z * 0.05);
        const pY = pinchY + Math.sin(p.orbitAngle) * (p.orbitRadius * 0.4) + my * (p.z * 0.03);
        const scale = 500 / (500 + p.z);

        ctx.fillStyle = `${p.color}${p.alpha * scale})`;
        ctx.shadowColor = p.color.includes('236') ? '#ec4899' : '#06b6d4';
        ctx.shadowBlur = 10 * scale;
        ctx.beginPath();
        ctx.arc(pX, pY, p.size * scale * 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // ─── 6. INTERACTIVE CLICK SHOCKWAVE BURSTS ───
      ctx.save();
      shockwavesRef.current.forEach((sw, index) => {
        sw.radius += 12;
        sw.opacity *= 0.96;

        ctx.strokeStyle = sw.color;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 25;
        ctx.lineWidth = 3 * (1 - sw.radius / sw.maxRadius) + 0.5;
        ctx.globalAlpha = sw.opacity;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (sw.radius >= sw.maxRadius || sw.opacity <= 0.02) {
          shockwavesRef.current.splice(index, 1);
        }
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* Ultra-subtle noise grid overlay for cinematic depth */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.02, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />
    </div>
  );
}
