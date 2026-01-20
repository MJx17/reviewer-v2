import { useRef, useEffect } from "react";

export default function SwipeContainer({ children, onNext, onPrev }) {
    const containerRef = useRef(null);
    const startX = useRef(0);
    const deltaX = useRef(0);

    useEffect(() => {
        const container = containerRef.current;

        const handleTouchStart = (e) => {
            startX.current = e.touches[0].clientX;
        };

        const handleTouchMove = (e) => {
            deltaX.current = e.touches[0].clientX - startX.current;
        };

        const handleTouchEnd = () => {
            if (deltaX.current > 50) onPrev?.();
            else if (deltaX.current < -50) onNext?.();
            deltaX.current = 0;
        };

        const handleMouseDown = (e) => {
            startX.current = e.clientX;
            const move = (eMove) => {
                deltaX.current = eMove.clientX - startX.current;
            };
            const up = () => {
                if (deltaX.current > 50) onPrev?.();
                else if (deltaX.current < -50) onNext?.();
                deltaX.current = 0;
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
            };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
        };

        container.addEventListener("touchstart", handleTouchStart);
        container.addEventListener("touchmove", handleTouchMove);
        container.addEventListener("touchend", handleTouchEnd);
        container.addEventListener("mousedown", handleMouseDown);

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
            container.removeEventListener("mousedown", handleMouseDown);
        };
    }, [onNext, onPrev]);

    return (
        <div
            ref={containerRef}
            style={{
                touchAction: "pan-y",
                userSelect: "none",
            }}
        >
            {children}
        </div>
    );
}
