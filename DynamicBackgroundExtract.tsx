import { useEffect, useRef, useState } from 'react';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STANDALONE DYNAMIC BACKGROUND & COLOR THEME COMPONENT
 * 
 * 🛠️ HOW TO USE IN ANY OTHER PROJECT:
 * 1. Copy this file into your project (e.g. `src/components/DynamicBackgroundExtract.tsx`).
 * 2. Optionally copy the CSS variables below into your global CSS (e.g. `index.css` or `globals.css`).
 * 3. Import and render `<DynamicBackgroundExtract />` at the root layout or background layer.
 * 
 * 🎨 CSS THEME VARIABLES (Copy to your global CSS if using CSS variables):
 * -----------------------------------------------------------------------------
 * :root {
 *   --bg-base: #faf9f7;
 *   --bg-card: #ffffff;
 *   --text-primary: #1a1a2e;
 *   --accent-primary: #4f46e5;
 *   --accent-green: #059669;
 *   --accent-cyan: #0891b2;
 *   --accent-amber: #d97706;
 * }
 * .dark {
 *   --bg-base: #080a0f;
 *   --bg-card: #0d1117;
 *   --text-primary: #e6edf3;
 *   --accent-primary: #7c3aed;
 *   --accent-green: #3fb950;
 *   --accent-cyan: #58e6d9;
 *   --accent-amber: #f0a30a;
 * }
 * ─────────────────────────────────────────────────────────────────────────────
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  text?: string;
  alpha: number;
}

export interface DynamicBackgroundProps {
  /** Optional custom tech keywords to float in background */
  keywords?: string[];
  /** Optional force dark mode (defaults to detecting '.dark' class on <html>) */
  forceDark?: boolean;
}

const DEFAULT_KEYWORDS = [
  'Next.js', 'Vite', 'React', 'TypeScript', 'TailwindCSS',
  'Python', 'Django', 'FastAPI', 'Pandas', 'SQLAlchemy',
  'PostgreSQL', 'Prisma', 'Redis', 'MongoDB', 'Docker',
  'Nginx', 'GitHub', 'CI/CD', 'AWS', 'Kubernetes', 'Serverless'
];

export default function DynamicBackgroundExtract({
  keywords = DEFAULT_KEYWORDS,
  forceDark,
}: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState<boolean>(
    typeof forceDark === 'boolean' ? forceDark : true
  );

  // Monitor document.documentElement class list for dark mode changes
  useEffect(() => {
    if (typeof forceDark === 'boolean') {
      setIsDark(forceDark);
      return;
    }

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme(); // Initial check

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [forceDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles: Particle[] = [];
    const maxParticles = 65;

    const createParticle = (initRandom = false): Particle => {
      const size = Math.random() * 2 + 1;
      const isText = Math.random() > 0.60;
      return {
        x: Math.random() * width,
        y: initRandom ? Math.random() * height : height + 20,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.5 + 0.1), // Float upwards slowly
        size: isText ? Math.random() * 3 + 11 : size,
        color: '',
        text: isText ? keywords[Math.floor(Math.random() * keywords.length)] : undefined,
        alpha: isText ? Math.random() * 0.4 + 0.15 : Math.random() * 0.5 + 0.1,
      };
    };

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // ── THEME COLORS SWITCH ──
      // Dark Mode Palette: Cyber terminal (Neon Greens, Glowing Cyans, Deep Purples)
      // Light Mode Palette: Warm editorial (Warm Amber, Peach, Lavender, Soft Lilac)
      const particleColors = isDark
        ? ['#3fb950', '#58e6d9', '#7c3aed', '#a78bfa'] // green, cyan, violet, light violet
        : ['#4f46e5', '#7c71f8', '#d97706', '#0891b2']; // indigo, light indigo, amber, cyan

      ctx.globalCompositeOperation = 'source-over';

      // 1. Draw large blurry gradient blobs in background
      if (isDark) {
        // Blob 1 - Deep violet top right
        const grad1 = ctx.createRadialGradient(width * 0.8, height * 0.2, 0, width * 0.8, height * 0.2, Math.max(width, height) * 0.35);
        grad1.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
        grad1.addColorStop(1, 'rgba(8, 10, 15, 0)');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, width, height);

        // Blob 2 - Cyan bottom left
        const grad2 = ctx.createRadialGradient(width * 0.2, height * 0.8, 0, width * 0.2, height * 0.8, Math.max(width, height) * 0.35);
        grad2.addColorStop(0, 'rgba(88, 230, 217, 0.08)');
        grad2.addColorStop(1, 'rgba(8, 10, 15, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Light theme blobs - Warm Amber & Lavender
        const grad1 = ctx.createRadialGradient(width * 0.8, height * 0.15, 0, width * 0.8, height * 0.15, Math.max(width, height) * 0.4);
        grad1.addColorStop(0, 'rgba(217, 119, 6, 0.06)');
        grad1.addColorStop(1, 'rgba(250, 249, 247, 0)');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, width, height);

        const grad2 = ctx.createRadialGradient(width * 0.15, height * 0.8, 0, width * 0.15, height * 0.8, Math.max(width, height) * 0.4);
        grad2.addColorStop(0, 'rgba(79, 70, 229, 0.06)');
        grad2.addColorStop(1, 'rgba(250, 249, 247, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw & animate particles / floating code snippets
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -30 || p.x < -30 || p.x > width + 30) {
          particles[idx] = createParticle(false);
          return;
        }

        if (!p.color) {
          p.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.text) {
          ctx.fillStyle = p.color;
          ctx.font = `500 ${p.size}px 'JetBrains Mono', monospace`;
          ctx.fillText(p.text, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = isDark ? 10 : 0;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, keywords]);

  const baseBg = isDark ? '#080a0f' : '#faf9f7';

  return (
    <>
      {/* Dynamic Floating Canvas Layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -2,
          transition: 'all 0.5s ease',
          backgroundColor: 'var(--bg-base, ' + baseBg + ')',
        }}
      />
      {/* Color Gradient Radial Filter Overlay Layer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
          transition: 'all 0.5s ease',
          background: isDark
            ? 'radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.2) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(88, 230, 217, 0.12) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.08) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(79, 70, 229, 0.08) 0%, transparent 60%)',
        }}
      />
    </>
  );
}
