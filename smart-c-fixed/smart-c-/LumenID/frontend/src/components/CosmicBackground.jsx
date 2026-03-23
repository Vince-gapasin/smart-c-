import { useEffect, useRef } from "react";

export function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to cover entire document
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      // Use the larger of viewport height or document height to cover scrollable content
      canvas.height = Math.max(
        window.innerHeight,
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Also update canvas size when content changes (for dynamic pages)
    const resizeObserver = new ResizeObserver(() => {
      setCanvasSize();
    });
    resizeObserver.observe(document.body);

    const stars = [];
    const numStars = 200;

    // Star colors
    const starColors = [
      "rgba(6, 182, 212, ", // cyan
      "rgba(168, 85, 247, ", // purple
      "rgba(236, 72, 153, ", // pink
      "rgba(255, 255, 255, ", // white
      "rgba(34, 211, 238, ", // cyan-400
      "rgba(192, 132, 252, ", // purple-400
    ];

    // Create stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Aurora wave configuration
    let auroraOffset = 0;

    const drawAurora = (time) => {
      const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient1.addColorStop(0, "rgba(6, 182, 212, 0.03)");
      gradient1.addColorStop(0.5, "rgba(168, 85, 247, 0.05)");
      gradient1.addColorStop(1, "rgba(236, 72, 153, 0.03)");

      ctx.fillStyle = gradient1;
      ctx.beginPath();

      const waveHeight = 300;
      const waveFrequency = 0.002;

      for (let x = 0; x < canvas.width; x += 10) {
        const y = Math.sin(x * waveFrequency + auroraOffset) * waveHeight + canvas.height * 0.3;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Second aurora layer
      const gradient2 = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
      gradient2.addColorStop(0, "rgba(236, 72, 153, 0.04)");
      gradient2.addColorStop(0.5, "rgba(168, 85, 247, 0.06)");
      gradient2.addColorStop(1, "rgba(6, 182, 212, 0.04)");

      ctx.fillStyle = gradient2;
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x += 10) {
        const y = Math.sin(x * waveFrequency * 1.5 - auroraOffset * 0.7) * waveHeight * 0.8 + canvas.height * 0.6;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      auroraOffset += 0.003;
    };

    // Draw stars
    const drawStars = (time) => {
      stars.forEach((star) => {
        // Twinkling effect
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        const currentOpacity = star.opacity * twinkle;

        // Draw star glow
        const glowRadius = star.radius * 3;
        const glowGradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          glowRadius
        );
        glowGradient.addColorStop(0, star.color + currentOpacity + ")");
        glowGradient.addColorStop(0.3, star.color + currentOpacity * 0.5 + ")");
        glowGradient.addColorStop(1, star.color + "0)");

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw star core
        ctx.fillStyle = star.color + currentOpacity + ")";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Add some larger glowing stars
    const glowingStars = [
      { x: canvas.width * 0.15, y: canvas.height * 0.2, size: 4, color: "rgba(6, 182, 212, " },
      { x: canvas.width * 0.75, y: canvas.height * 0.15, size: 3.5, color: "rgba(168, 85, 247, " },
      { x: canvas.width * 0.85, y: canvas.height * 0.7, size: 3, color: "rgba(236, 72, 153, " },
      { x: canvas.width * 0.25, y: canvas.height * 0.8, size: 3.5, color: "rgba(34, 211, 238, " },
    ];

    const drawGlowingStars = (time) => {
      glowingStars.forEach((star, index) => {
        const pulse = (Math.sin(time * 0.001 + index) + 1) / 2;
        const opacity = 0.4 + pulse * 0.4;

        // Outer glow
        const outerGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 8);
        outerGlow.addColorStop(0, star.color + opacity * 0.8 + ")");
        outerGlow.addColorStop(0.2, star.color + opacity * 0.4 + ")");
        outerGlow.addColorStop(0.5, star.color + opacity * 0.2 + ")");
        outerGlow.addColorStop(1, star.color + "0)");

        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 8, 0, Math.PI * 2);
        ctx.fill();

        // Middle glow
        const middleGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
        middleGlow.addColorStop(0, star.color + opacity + ")");
        middleGlow.addColorStop(0.5, star.color + opacity * 0.6 + ")");
        middleGlow.addColorStop(1, star.color + "0)");

        ctx.fillStyle = middleGlow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = star.color + opacity + ")";
        ctx.shadowBlur = 20;
        ctx.shadowColor = star.color + opacity + ")";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    // Animation loop
    let animationFrameId;
    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw aurora
      drawAurora(time);

      // Draw stars
      drawStars(time);

      // Draw glowing stars
      drawGlowingStars(time);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.unobserve(document.body);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {/* Radial gradient overlay for vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 14, 0.4) 70%, rgba(10, 10, 14, 0.8) 100%)",
        }}
      />
    </>
  );
}