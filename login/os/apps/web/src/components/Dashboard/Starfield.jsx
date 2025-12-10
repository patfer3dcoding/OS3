"use client";

import { useEffect, useRef } from "react";

export function Starfield() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const stars = [];
        const numStars = 2000;
        const speed = 0.5;

        // Initialize stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * width, // depth
                size: Math.random() * 1.5,
            });
        }

        const animate = () => {
            if (!ctx) return;

            // Clear screen with opacity for trail effect (optional, here just clear)
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "white";

            // Update and draw stars
            for (let i = 0; i < numStars; i++) {
                const star = stars[i];

                // Move star
                star.z -= speed;
                if (star.z <= 0) {
                    star.z = width;
                    star.x = Math.random() * width;
                    star.y = Math.random() * height;
                }

                // Project star
                const k = 128.0 / star.z;
                const px = (star.x - width / 2) * k + width / 2;
                const py = (star.y - height / 2) * k + height / 2;

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    const size = (1 - star.z / width) * 2; // Size based on depth
                    ctx.globalAlpha = 1 - star.z / width; // Opacity based on depth
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const animationId = requestAnimationFrame(animate);
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 -z-10 bg-black"
        />
    );
}
