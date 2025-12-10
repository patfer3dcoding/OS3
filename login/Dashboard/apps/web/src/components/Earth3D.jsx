"use client";

import { useEffect, useRef } from "react";

export default function Earth3D() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const size = 600;
        canvas.width = size;
        canvas.height = size;

        // Earth parameters
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = 200;
        let rotation = 0;

        // Create Earth texture (simplified)
        const drawEarth = () => {
            // Clear canvas
            ctx.clearRect(0, 0, size, size);

            // Outer glow
            const glowGradient = ctx.createRadialGradient(
                centerX,
                centerY,
                radius,
                centerX,
                centerY,
                radius + 50
            );
            glowGradient.addColorStop(0, "rgba(100, 200, 255, 0.3)");
            glowGradient.addColorStop(0.5, "rgba(100, 200, 255, 0.1)");
            glowGradient.addColorStop(1, "rgba(100, 200, 255, 0)");
            ctx.fillStyle = glowGradient;
            ctx.fillRect(0, 0, size, size);

            // Draw the main sphere with gradient
            const gradient = ctx.createRadialGradient(
                centerX - radius * 0.3,
                centerY - radius * 0.3,
                radius * 0.1,
                centerX,
                centerY,
                radius
            );
            gradient.addColorStop(0, "#6dd5ed");
            gradient.addColorStop(0.3, "#2193b0");
            gradient.addColorStop(0.7, "#1a5f7a");
            gradient.addColorStop(1, "#0d2d3d");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Draw continents with rotation effect
            ctx.save();
            ctx.translate(centerX, centerY);

            // Create clipping region for sphere
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.clip();

            // Draw simplified rotating land masses
            drawContinents(ctx, rotation, radius);

            ctx.restore();

            // Add atmospheric effect
            const atmosphereGradient = ctx.createRadialGradient(
                centerX - radius * 0.3,
                centerY - radius * 0.3,
                radius * 0.5,
                centerX,
                centerY,
                radius
            );
            atmosphereGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
            atmosphereGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
            atmosphereGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.fillStyle = atmosphereGradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Increment rotation
            rotation += 0.002;
        };

        // Draw simplified continents
        const drawContinents = (ctx, rotation, radius) => {
            ctx.fillStyle = "rgba(76, 153, 76, 0.6)";

            // Draw multiple continent-like shapes that rotate
            const continents = [
                // Africa-like shape
                { x: 0, y: 0, width: 80, height: 120, offsetX: 200 },
                // Americas-like shape
                { x: -150, y: -50, width: 100, height: 150, offsetX: 0 },
                // Asia-like shape
                { x: 100, y: -80, width: 140, height: 100, offsetX: 400 },
                // Europe-like shape
                { x: 50, y: -100, width: 60, height: 50, offsetX: 300 },
            ];

            continents.forEach((continent) => {
                const wrappedX =
                    ((continent.x + continent.offsetX + rotation * 3000) %
                        (radius * 4)) -
                    radius * 2;
                const depth = Math.cos((wrappedX / radius) * Math.PI * 0.5);

                if (depth > 0) {
                    ctx.save();
                    ctx.globalAlpha = depth * 0.7;
                    ctx.scale(depth, 1);

                    ctx.beginPath();
                    ctx.ellipse(
                        wrappedX / depth,
                        continent.y,
                        continent.width,
                        continent.height,
                        0,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                    ctx.restore();
                }
            });
        };

        // Animation loop
        const animate = () => {
            drawEarth();
            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="relative w-[600px] h-[600px] opacity-40">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full drop-shadow-[0_0_80px_rgba(6,182,212,0.4)]"
                    style={{
                        filter: 'brightness(1.1) contrast(1.1)',
                    }}
                />
                {/* Glow effect around Earth */}
                <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl" />
            </div>
        </div>
    );
}
