import React, { useEffect, useRef, useState } from "react";

const ScrollParallax = ({
    className,
    delay,
    initiallyVisible,
    style,
    children,
}) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(Boolean(initiallyVisible));

    useEffect(() => {
        if (isVisible || !ref.current || typeof IntersectionObserver === "undefined") {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [isVisible]);

    const baseStyle = {
        transition: "opacity 420ms ease, transform 420ms ease",
        transitionDelay: delay ? `${delay}ms` : "0ms",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(18px)",
        willChange: "transform, opacity",
        ...style,
    };

    return (
        <div ref={ref} className={className} style={baseStyle}>
            {children}
        </div>
    );
};

export default ScrollParallax;
