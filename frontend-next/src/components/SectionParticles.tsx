'use client';

import { useEffect, useRef } from 'react';

interface SectionParticlesProps {
    colors?: string[];
    count?: number;
    speed?: number;
    maxSize?: number;
    glowIntensity?: number;
}

/**
 * SectionParticles — Lightweight per-section canvas with twinkling,
 * drifting, glowing particles. Pauses when off-screen for performance.
 */
export default function SectionParticles({
    colors = ['6, 182, 212', '59, 130, 246', '139, 92, 246'],
    count = 60,
    speed = 1,
    maxSize = 2.2,
    glowIntensity = 1,
}: SectionParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        let animId: number;
        let visible = true;
        let width = 0;
        let height = 0;
        const dpr = Math.min(window.devicePixelRatio, 2);

        const resize = () => {
            const rect = parent.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        // Intersection observer — pause when not visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
                if (visible) animate();
            },
            { threshold: 0 }
        );
        observer.observe(parent);

        // Particle state
        interface P {
            x: number; y: number;
            vx: number; vy: number;
            radius: number;
            baseOpacity: number;
            twinkleSpeed: number;
            twinkleOffset: number;
            color: string;
        }

        const particles: P[] = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * (width || 800),
                y: Math.random() * (height || 600),
                vx: (Math.random() - 0.5) * 0.3 * speed,
                vy: (Math.random() - 0.5) * 0.2 * speed,
                radius: 0.4 + Math.random() * maxSize,
                baseOpacity: 0.1 + Math.random() * 0.45,
                twinkleSpeed: 0.4 + Math.random() * 2.5,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        let time = 0;

        const animate = () => {
            if (!visible) return;
            animId = requestAnimationFrame(animate);
            time += 0.016;

            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Move
                p.x += p.vx + Math.sin(time * 0.5 + i) * 0.08 * speed;
                p.y += p.vy + Math.cos(time * 0.4 + i * 0.7) * 0.06 * speed;

                // Wrap
                if (p.x < -5) p.x = width + 5;
                if (p.x > width + 5) p.x = -5;
                if (p.y < -5) p.y = height + 5;
                if (p.y > height + 5) p.y = -5;

                // Twinkle
                const twinkle = Math.sin(time * p.twinkleSpeed + p.twinkleOffset);
                const opacity = p.baseOpacity + twinkle * 0.25;
                if (opacity <= 0.02) continue;

                // Glow halo
                const glowR = p.radius * (3.5 * glowIntensity);
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
                gradient.addColorStop(0, `rgba(${p.color}, ${Math.min(0.6, opacity * 1.5)})`);
                gradient.addColorStop(0.4, `rgba(${p.color}, ${opacity * 0.3})`);
                gradient.addColorStop(1, `rgba(${p.color}, 0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
                ctx.fill();

                // Bright core
                ctx.fillStyle = `rgba(${p.color}, ${Math.min(1, opacity + 0.35)})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        animate();

        const onResize = () => resize();
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animId);
            observer.disconnect();
            window.removeEventListener('resize', onResize);
        };
    }, [colors, count, speed, maxSize, glowIntensity]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{ width: '100%', height: '100%' }}
        />
    );
}
