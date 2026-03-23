import { useState, useEffect, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from './utils';

export function JumpingScroll() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;

        // Determine scroll direction
        // If scrolled past 10px and moving down, hide. Otherwise show.
        if (currentScrollY > lastScrollY && currentScrollY > 10) {
            setIsVisible(false);
        } else if (currentScrollY < lastScrollY || currentScrollY <= 10) {
            setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    useEffect(() => {
        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        // Set initial state
        handleScroll();

        return () => window.removeEventListener('scroll', onScroll);
    }, [handleScroll]);

    const scrollToNextSection = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <div
            className={cn(
                "absolute bottom-8 left-1/2 -translate-x-1/2 z-20",
                "transition-all duration-300 ease-in-out",
                isVisible
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-50 pointer-events-none"
            )}
        >
            <button
                onClick={scrollToNextSection}
                className={cn(
                    "flex flex-col items-center justify-center gap-2",
                    "animate-bounce cursor-pointer",
                    "bg-card/50 backdrop-blur-xl border border-border/50",
                    "px-4 py-4 rounded-full shadow-lg shadow-cyan-500/10",
                    "hover:bg-card/80 hover:shadow-cyan-500/20 hover:scale-105",
                    "transition-all duration-300 ease-in-out"
                )}
                aria-label="Scroll down to next section"
            >
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mt-1">
                    Scroll
                </span>
                <ArrowDown className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            </button>
        </div>
    );
}