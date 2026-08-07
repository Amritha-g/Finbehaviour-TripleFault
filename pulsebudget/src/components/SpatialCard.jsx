import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SpatialCard({
  children,
  delay = 0,
  style = {},
  className = '',
  onClick,
  accentColor = 'magenta', // 'magenta' | 'cyan' | 'purple' | 'amber'
}) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glint, setGlint] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const getGlowStyle = () => {
    switch (accentColor) {
      case 'cyan':
        return {
          borderColor: isHovered ? 'rgba(6, 182, 212, 0.6)' : 'rgba(255, 255, 255, 0.12)',
          boxShadow: isHovered
            ? '0 30px 70px rgba(6, 182, 212, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 35px rgba(6, 182, 212, 0.4)'
            : '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          glowGrad: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%)',
        };
      case 'amber':
        return {
          borderColor: isHovered ? 'rgba(245, 158, 11, 0.7)' : 'rgba(239, 68, 68, 0.3)',
          boxShadow: isHovered
            ? '0 30px 70px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 40px rgba(239, 68, 68, 0.5)'
            : '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          glowGrad: 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.25), transparent 70%)',
        };
      case 'purple':
        return {
          borderColor: isHovered ? 'rgba(168, 85, 247, 0.6)' : 'rgba(255, 255, 255, 0.15)',
          boxShadow: isHovered
            ? '0 35px 80px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 0 45px rgba(168, 85, 247, 0.4)'
            : '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          glowGrad: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.3), transparent 70%)',
        };
      case 'magenta':
      default:
        return {
          borderColor: isHovered ? 'rgba(236, 72, 153, 0.6)' : 'rgba(255, 255, 255, 0.12)',
          boxShadow: isHovered
            ? '0 30px 70px rgba(236, 72, 153, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 35px rgba(236, 72, 153, 0.4)'
            : '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          glowGrad: 'radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.25), transparent 70%)',
        };
    }
  };

  const glowProps = getGlowStyle();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
    setGlint({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.3,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlint((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.9, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
          translateZ: isHovered ? 24 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        style={{
          position: 'relative',
          background: 'rgba(12, 11, 24, 0.55)',
          border: `1px solid ${glowProps.borderColor}`,
          borderRadius: 28,
          backdropFilter: 'blur(32px) saturate(190%)',
          WebkitBackdropFilter: 'blur(32px) saturate(190%)',
          boxShadow: glowProps.boxShadow,
          overflow: 'hidden',
          cursor: onClick ? 'pointer' : 'default',
          transformStyle: 'preserve-3d',
          transition: 'border 0.3s ease, box-shadow 0.3s ease',
          ...style,
        }}
        className={className}
      >
        {/* Subtle Top Inner Aura Glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: glowProps.glowGrad,
            opacity: isHovered ? 1 : 0.4,
            transition: 'opacity 0.3s ease',
            zIndex: 1,
          }}
        />

        {/* Cursor Specular Glass Glint */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${glint.x}% ${glint.y}%, rgba(255, 255, 255, ${glint.opacity}), transparent 55%)`,
            transition: 'opacity 0.25s ease',
            zIndex: 2,
          }}
        />

        <div style={{ position: 'relative', zIndex: 3 }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}
