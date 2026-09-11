import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

function DynamicCursor() {
  const { isNight } = useTheme();
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if touch device
    if (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches
    ) {
      setIsTouchDevice(true);
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Direct position for precision dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check for hoverable elements
      const target = e.target;
      const isInteractive = target && target.closest(
        'a, button, input, textarea, select, [role="button"], .cursor-pointer, label'
      );
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Smooth lerp loop for the trailing ring
    const render = () => {
      // Linear interpolation (ease follow)
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 1. Precision Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full pointer-events-none will-change-transform"
        style={{
          transition: "transform 0.04s ease-out, width 0.2s, height 0.2s",
        }}
      >
        <div
          className={`h-full w-full rounded-full shadow-md transition-all duration-300 ${
            isNight
              ? isHovered
                ? "bg-amber-400 scale-125 shadow-amber-400/80"
                : "bg-indigo-400 shadow-indigo-400/80"
              : isHovered
              ? "bg-amber-500 scale-125 shadow-amber-500/80"
              : "bg-indigo-600 shadow-indigo-600/80"
          }`}
        />
      </div>

      {/* 2. Trailing Radiant Fluid Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-5 -mt-5 h-10 w-10 rounded-full pointer-events-none will-change-transform"
      >
        <div
          className={`h-full w-full rounded-full transition-all duration-300 ease-out border backdrop-blur-[1px] ${
            isNight
              ? isClicked
                ? "scale-75 border-amber-400 bg-amber-400/30 shadow-lg shadow-amber-400/40"
                : isHovered
                ? "scale-150 border-indigo-400 bg-indigo-500/25 shadow-xl shadow-indigo-500/30"
                : "scale-100 border-indigo-500/40 bg-indigo-600/10 shadow-md shadow-indigo-500/15"
              : isClicked
              ? "scale-75 border-amber-500 bg-amber-500/30 shadow-lg shadow-amber-500/30"
              : isHovered
              ? "scale-150 border-indigo-600 bg-indigo-600/20 shadow-xl shadow-indigo-600/20"
              : "scale-100 border-indigo-600/40 bg-indigo-600/5 shadow-sm"
          }`}
        />
      </div>
    </div>
  );
}

export default DynamicCursor;
