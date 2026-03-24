import { useEffect, useRef } from "react";
import { Shield } from "lucide-react";

export function LumenCard3D() {
    const cardRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const container = containerRef.current;
        if (!card || !container) return;

        // Auto-rotation animation
        let autoRotateX = 0;
        let autoRotateY = 0;
        let isHovering = false;
        let animationFrame;

        const animate = () => {
            if (!isHovering && card) {
                autoRotateY += 0.3;
                autoRotateX = Math.sin(autoRotateY * 0.01) * 5;
                card.style.transform = `perspective(1200px) rotateX(${autoRotateX}deg) rotateY(${autoRotateY * 0.2}deg) translateZ(40px)`;
            }
            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e) => {
            isHovering = true;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`;
        };

        const handleMouseLeave = () => {
            isHovering = false;
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center"
            style={{ perspective: "1200px" }}
        >
            {/* Outer glow ring */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className="absolute w-[540px] h-[370px] rounded-3xl"
                    style={{
                        background: "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.3) 0%, rgba(168, 85, 247, 0.2) 40%, transparent 70%)",
                        filter: "blur(40px)",
                        animation: "pulse 4s ease-in-out infinite"
                    }}
                />
            </div>

            <div
                ref={cardRef}
                className="relative w-[456px] h-[288px] transition-transform duration-500 ease-out"
                style={{
                    transformStyle: "preserve-3d",
                    transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(40px)",
                }}
            >
                {/* Card Base - Glassmorphic with enhanced 3D depth */}
                <div
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                    style={{
                        transform: "translateZ(0px)",
                        transformStyle: "preserve-3d"
                    }}
                >
                    {/* Background gradient with stronger glow */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/30"
                        style={{
                            transform: "translateZ(-5px)",
                            filter: "blur(1px)"
                        }}
                    />

                    {/* Glass effect with depth */}
                    <div
                        className="absolute inset-0 backdrop-blur-3xl border-2 border-white/20"
                        style={{
                            borderRadius: "1rem",
                            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                            boxShadow: `
                0 0 80px rgba(6, 182, 212, 0.4),
                0 0 120px rgba(168, 85, 247, 0.3),
                0 0 160px rgba(236, 72, 153, 0.2),
                inset 0 0 100px rgba(255, 255, 255, 0.08),
                inset 0 -20px 60px rgba(6, 182, 212, 0.15),
                inset 0 20px 60px rgba(236, 72, 153, 0.15)
              `
                        }}
                    />

                    {/* Animated light reflection */}
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            background: "linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.3) 45%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.3) 55%, transparent 100%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 8s infinite linear",
                            borderRadius: "1rem"
                        }}
                    />

                    {/* Constellation lines overlay with glow */}
                    <svg
                        className="absolute inset-0 w-full h-full"
                        style={{
                            mixBlendMode: "screen",
                            filter: "drop-shadow(0 0 4px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))"
                        }}
                    >
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
                                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
                            </linearGradient>

                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Virgo Constellation pattern - Flowing diagonal arrangement */}
                        {/* Upper left branch */}
                        <line x1="140" y1="50" x2="170" y2="75" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" opacity="0.9" />
                        <line x1="170" y1="75" x2="190" y2="95" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" opacity="0.9" />

                        {/* Main diagonal spine */}
                        <line x1="190" y1="95" x2="220" y2="125" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" opacity="0.9" />
                        <line x1="220" y1="125" x2="245" y2="155" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" opacity="0.9" />

                        {/* To Spica */}
                        <line x1="245" y1="155" x2="265" y2="185" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" opacity="0.9" />
                        <line x1="265" y1="185" x2="280" y2="215" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" opacity="0.9" />

                        {/* Right branch from middle */}
                        <line x1="245" y1="155" x2="285" y2="140" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" opacity="0.9" />
                        <line x1="285" y1="140" x2="320" y2="130" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)" opacity="0.9" />

                        {/* Virgo Constellation nodes (glowing stars) */}
                        {/* Upper branch stars */}
                        <circle cx="140" cy="50" r="4" fill="#a855f7" filter="url(#glow)">
                            <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
                        </circle>

                        <circle cx="170" cy="75" r="3" fill="#ec4899" filter="url(#glow)">
                            <animate attributeName="r" values="2;4;2" dur="2.8s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" repeatCount="indefinite" />
                        </circle>

                        {/* Main spine stars */}
                        <circle cx="190" cy="95" r="4" fill="#06b6d4" filter="url(#glow)">
                            <animate attributeName="r" values="3;5;3" dur="2.3s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.3s" repeatCount="indefinite" />
                        </circle>

                        {/* Vindemiatrix */}
                        <circle cx="220" cy="125" r="5" fill="#ec4899" filter="url(#glow)">
                            <animate attributeName="r" values="4;6;4" dur="2.2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite" />
                        </circle>

                        {/* Porrima */}
                        <circle cx="245" cy="155" r="5" fill="#a855f7" filter="url(#glow)">
                            <animate attributeName="r" values="4;6;4" dur="2.4s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
                        </circle>

                        {/* Heze */}
                        <circle cx="265" cy="185" r="4" fill="#06b6d4" filter="url(#glow)">
                            <animate attributeName="r" values="3;5;3" dur="2.6s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" repeatCount="indefinite" />
                        </circle>

                        {/* Spica - the brightest star (bottom) */}
                        <circle cx="280" cy="215" r="7" fill="#06b6d4" filter="url(#glow)">
                            <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                        </circle>

                        {/* Right branch stars */}
                        <circle cx="285" cy="140" r="3" fill="#ec4899" filter="url(#glow)">
                            <animate attributeName="r" values="2;4;2" dur="2.7s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.7s" repeatCount="indefinite" />
                        </circle>

                        <circle cx="320" cy="130" r="4" fill="#a855f7" filter="url(#glow)">
                            <animate attributeName="r" values="3;5;3" dur="2.9s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.9s" repeatCount="indefinite" />
                        </circle>
                    </svg>

                    {/* Card Content */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 flex items-center justify-center"
                                    style={{
                                        boxShadow: "0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)"
                                    }}
                                >
                                    <Shield className="w-6 h-6 text-white drop-shadow-lg" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Digital Credential</p>
                                    <p
                                        className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                                        style={{
                                            filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))"
                                        }}
                                    >
                                        LumenID
                                    </p>
                                </div>
                            </div>
                            <div
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/40 to-purple-500/40 border-2 border-white/30"
                                style={{
                                    boxShadow: "0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)"
                                }}
                            />
                        </div>

                        {/* Middle - Chip simulation */}
                        <div className="flex items-center gap-4">
                            <div
                                className="w-14 h-11 rounded-md bg-gradient-to-br from-amber-400/40 to-yellow-500/40 border-2 border-amber-400/60 relative overflow-hidden"
                                style={{
                                    boxShadow: "0 0 20px rgba(251, 191, 36, 0.5), inset 0 0 20px rgba(251, 191, 36, 0.2)"
                                }}
                            >
                                <div className="absolute inset-0" style={{
                                    background: "repeating-linear-gradient(90deg, rgba(251, 191, 36, 0.2) 0px, rgba(251, 191, 36, 0.2) 2px, transparent 2px, transparent 4px)"
                                }} />
                            </div>
                            <div className="flex-1">
                                <div className="h-2 w-24 bg-white/20 rounded-full mb-2 shadow-sm" style={{ boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }} />
                                <div className="h-2 w-32 bg-white/20 rounded-full shadow-sm" style={{ boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }} />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Verified in Polkadot</p>
                                <p
                                    className="text-sm font-mono text-cyan-400 font-semibold"
                                    style={{
                                        textShadow: "0 0 10px rgba(6, 182, 212, 0.8)"
                                    }}
                                >
                                    0x7a9f...3e2d
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-1">
                                    <div
                                        className="w-2 h-2 rounded-full bg-cyan-400"
                                        style={{
                                            boxShadow: "0 0 10px rgba(6, 182, 212, 0.8)",
                                            animation: "pulse 2s ease-in-out infinite"
                                        }}
                                    />
                                    <div
                                        className="w-2 h-2 rounded-full bg-purple-400"
                                        style={{
                                            boxShadow: "0 0 10px rgba(168, 85, 247, 0.8)",
                                            animation: "pulse 2s ease-in-out infinite 0.2s"
                                        }}
                                    />
                                    <div
                                        className="w-2 h-2 rounded-full bg-pink-400"
                                        style={{
                                            boxShadow: "0 0 10px rgba(236, 72, 153, 0.8)",
                                            animation: "pulse 2s ease-in-out infinite 0.4s"
                                        }}
                                    />
                                </div>
                                <p
                                    className="text-sm font-semibold text-white/80"
                                    style={{
                                        textShadow: "0 0 8px rgba(255, 255, 255, 0.5)"
                                    }}
                                >
                                    2026
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Edge glow effect - Enhanced */}
                    <div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                            boxShadow: `
                0 0 40px rgba(6, 182, 212, 0.5),
                0 0 80px rgba(168, 85, 247, 0.4),
                0 0 120px rgba(236, 72, 153, 0.3),
                inset 0 0 40px rgba(255, 255, 255, 0.1)
              `,
                            animation: "glow-pulse 3s ease-in-out infinite"
                        }}
                    />
                </div>

                {/* Floating particles around card - Enhanced with glow */}
                <div className="absolute -inset-8 pointer-events-none">
                    <div
                        className="absolute top-0 left-1/4 w-2 h-2 bg-cyan-400 rounded-full"
                        style={{
                            boxShadow: "0 0 20px rgba(6, 182, 212, 1)",
                            animation: "float-particle 3s ease-in-out infinite"
                        }}
                    />
                    <div
                        className="absolute top-1/4 right-0 w-2 h-2 bg-purple-400 rounded-full"
                        style={{
                            boxShadow: "0 0 20px rgba(168, 85, 247, 1)",
                            animation: "float-particle 3.5s ease-in-out infinite 0.5s"
                        }}
                    />
                    <div
                        className="absolute bottom-1/4 left-0 w-2 h-2 bg-pink-400 rounded-full"
                        style={{
                            boxShadow: "0 0 20px rgba(236, 72, 153, 1)",
                            animation: "float-particle 4s ease-in-out infinite 1s"
                        }}
                    />
                    <div
                        className="absolute bottom-0 right-1/3 w-2 h-2 bg-cyan-400 rounded-full"
                        style={{
                            boxShadow: "0 0 20px rgba(6, 182, 212, 1)",
                            animation: "float-particle 3.2s ease-in-out infinite 1.5s"
                        }}
                    />
                </div>

                {/* 3D depth layers */}
                <div
                    className="absolute inset-0 rounded-2xl border border-cyan-500/30"
                    style={{
                        transform: "translateZ(-10px)",
                        filter: "blur(2px)",
                        opacity: 0.5
                    }}
                />
                <div
                    className="absolute inset-0 rounded-2xl border border-purple-500/20"
                    style={{
                        transform: "translateZ(-20px)",
                        filter: "blur(4px)",
                        opacity: 0.3
                    }}
                />
            </div>

            <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.7;
          }
        }
        
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}