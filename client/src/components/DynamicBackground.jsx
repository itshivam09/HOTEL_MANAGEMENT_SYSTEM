import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

function DynamicBackground() {
  const { isNight } = useTheme();
  const canvasRef = useRef(null);

  // Dynamic particle canvas (stars/fireflies for night, golden sunlight motes for day)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Generate particles
    const particleCount = isNight ? 55 : 35;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * (isNight ? 1.8 : 2.5) + 0.5,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35 - (isNight ? 0.05 : 0.15),
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulsePhase += p.pulseSpeed;

        // Wrap around borders
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dynamicOpacity =
          p.opacity * (0.6 + 0.4 * Math.sin(p.pulsePhase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (isNight) {
          // Night: Starlight & glowing cyan/violet embers
          ctx.fillStyle = `rgba(199, 210, 254, ${dynamicOpacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(168, 85, 247, 0.6)";
        } else {
          // Day: Warm golden sun sparkles
          ctx.fillStyle = `rgba(245, 158, 11, ${dynamicOpacity * 0.7})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(251, 191, 36, 0.4)";
        }

        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isNight]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none transition-colors duration-700"
    >
      {/* Base Canvas Gradient */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isNight
            ? "bg-gradient-to-b from-[#070A13] via-[#0B0F19] to-[#04070D] opacity-100"
            : "bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] opacity-100"
        }`}
      />

      {/* Floating Aurora Orb 1: Royal Indigo / Solar Gold */}
      <div
        className={`absolute -top-20 -left-20 h-[500px] w-[500px] sm:h-[650px] sm:w-[650px] rounded-full blur-[130px] sm:blur-[160px] animate-float-slow transition-colors duration-700 ${
          isNight
            ? "bg-indigo-600/25"
            : "bg-amber-400/20"
        }`}
      />

      {/* Floating Aurora Orb 2: Ultraviolet / Sky Azure */}
      <div
        className={`absolute top-1/3 -right-24 h-[450px] w-[450px] sm:h-[600px] sm:w-[600px] rounded-full blur-[130px] sm:blur-[160px] animate-float-reverse transition-colors duration-700 ${
          isNight
            ? "bg-purple-600/20"
            : "bg-sky-400/25"
        }`}
      />

      {/* Floating Aurora Orb 3: Warm Sunset Amber / Rose Champagne */}
      <div
        className={`absolute -bottom-28 left-1/4 h-[420px] w-[420px] sm:h-[580px] sm:w-[580px] rounded-full blur-[120px] sm:blur-[150px] animate-float-lateral transition-colors duration-700 ${
          isNight
            ? "bg-amber-500/15"
            : "bg-rose-400/18"
        }`}
      />

      {/* Floating Aurora Orb 4: Cyan Starlight Pulse / Sunbeam Glow */}
      <div
        className={`absolute top-2/3 right-1/4 h-[350px] w-[350px] sm:h-[450px] sm:w-[450px] rounded-full blur-[100px] sm:blur-[130px] animate-pulse-glow transition-colors duration-700 ${
          isNight
            ? "bg-cyan-500/15"
            : "bg-indigo-400/15"
        }`}
      />

      {/* Dynamic Animated Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-80"
      />

      {/* Subtle Luxury Grid Overlay */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] ${
          isNight ? "opacity-40" : "opacity-25"
        }`}
      />
    </div>
  );
}

export default DynamicBackground;
