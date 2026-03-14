'use client';

import { useEffect, useRef } from 'react';

/**
 * PageBackground — Premium full-page animated background with:
 * 1. Dense twinkling starfield with vivid glow halos
 * 2. Large glowing orbs that drift elegantly across the screen
 * 3. Occasional shooting streaks with bright heads
 * 4. Subtle mouse-follow glow
 *
 * Mount once at page level — renders behind all sections via position:fixed
 */
export default function PageBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let width = window.innerWidth;
        let height = document.documentElement.scrollHeight;
        const dpr = Math.min(window.devicePixelRatio, 2);

        const resize = () => {
            width = window.innerWidth;
            height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(document.documentElement);
        window.addEventListener('resize', resize);

        // ═══════════════════════════════════════════════
        // 1. PARTICLES — Dense tiny glowing dots
        // ═══════════════════════════════════════════════
        interface Particle {
            x: number; y: number; radius: number;
            baseOpacity: number; twinkleSpeed: number; twinkleOffset: number;
            color: string;
            drift: number; // gentle horizontal sway
        }

        const particleColors = [
            '6, 182, 212',    // cyan
            '59, 130, 246',   // blue
            '139, 92, 246',   // purple
            '16, 185, 129',   // emerald
            '34, 211, 238',   // light cyan
            '167, 139, 250',  // light purple
            '255, 255, 255',  // white
            '96, 165, 250',   // light blue
        ];

        const particleCount = Math.floor((width * height) / 8000);
        const particles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 0.2 + Math.random() * 0.7,
                baseOpacity: 0.05 + Math.random() * 0.2,
                twinkleSpeed: 0.3 + Math.random() * 2.5,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: particleColors[Math.floor(Math.random() * particleColors.length)],
                drift: (Math.random() - 0.5) * 0.04,
            });
        }

        // ═══════════════════════════════════════════════
        // 2. SHOOTING STREAKS — Occasional fast light trails
        // ═══════════════════════════════════════════════
        interface Streak {
            x: number; y: number; length: number;
            speed: number; angle: number;
            opacity: number; active: boolean; timer: number;
            color: string;
        }
        const streakColors = [
            '6, 182, 212',
            '59, 130, 246',
            '139, 92, 246',
        ];
        const streaks: Streak[] = [];
        for (let i = 0; i < 4; i++) {
            streaks.push({
                x: 0, y: 0, length: 100 + Math.random() * 150,
                speed: 5 + Math.random() * 8,
                angle: 0.3 + Math.random() * 0.4,
                opacity: 0, active: false,
                timer: 150 + Math.random() * 500,
                color: streakColors[Math.floor(Math.random() * streakColors.length)],
            });
        }

        // ═══════════════════════════════════════════════
        // 4. FLOATING MICRO-SPARKLES — Tiny bright dots that drift upward
        // ═══════════════════════════════════════════════
        interface Sparkle {
            x: number; y: number;
            vy: number; vx: number;
            life: number; maxLife: number;
            radius: number;
            color: string;
        }
        const sparkles: Sparkle[] = [];
        const maxSparkles = 40;
        let sparkleTimer = 0;

        // ═══════════════════════════════════════════════
        // 5. MOUSE GLOW
        // ═══════════════════════════════════════════════
        const mouse = { x: -500, y: -500 };
        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY + window.scrollY;
        };
        window.addEventListener('mousemove', onMouseMove);

        // Scroll tracking
        let scrollY = 0;
        const onScroll = () => { scrollY = window.scrollY; };
        window.addEventListener('scroll', onScroll, { passive: true });

        // ═══════════════════════════════════════════════
        // ANIMATION LOOP
        // ═══════════════════════════════════════════════
        let time = 0;

        const animate = () => {
            animId = requestAnimationFrame(animate);
            time += 0.016;

            const viewTop = scrollY - 300;
            const viewBottom = scrollY + window.innerHeight + 300;

            ctx.clearRect(0, Math.max(0, viewTop), width, viewBottom - viewTop + 600);

            // ── Draw particles ──
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (p.y < viewTop - 10 || p.y > viewBottom + 10) continue;

                // Gentle drift
                p.x += p.drift;
                if (p.x < -5) p.x = width + 5;
                if (p.x > width + 5) p.x = -5;

                const twinkle = Math.sin(time * p.twinkleSpeed + p.twinkleOffset);
                const opacity = p.baseOpacity + twinkle * 0.3;
                if (opacity <= 0.03) continue;

                // Glow halo
                const glowR = p.radius * 2;
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
                gradient.addColorStop(0, `rgba(${p.color}, ${Math.min(0.25, opacity * 0.8)})`);
                gradient.addColorStop(0.6, `rgba(${p.color}, ${opacity * 0.08})`);
                gradient.addColorStop(1, `rgba(${p.color}, 0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
                ctx.fill();

                // Bright core
                ctx.fillStyle = `rgba(${p.color}, ${Math.min(0.6, opacity + 0.15)})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // ── Shooting streaks ──
            for (let i = 0; i < streaks.length; i++) {
                const streak = streaks[i];
                if (!streak.active) {
                    streak.timer--;
                    if (streak.timer <= 0) {
                        streak.active = true;
                        streak.x = Math.random() * width * 0.7;
                        streak.y = viewTop + Math.random() * (viewBottom - viewTop);
                        streak.opacity = 0.5 + Math.random() * 0.4;
                        streak.angle = 0.15 + Math.random() * 0.5;
                        streak.speed = 6 + Math.random() * 10;
                    }
                    continue;
                }

                streak.x += Math.cos(streak.angle) * streak.speed;
                streak.y += Math.sin(streak.angle) * streak.speed;
                streak.opacity -= 0.003;

                if (streak.opacity <= 0 || streak.x > width + 150 || streak.y > viewBottom + 150) {
                    streak.active = false;
                    streak.timer = 250 + Math.random() * 700;
                    continue;
                }

                const endX = streak.x - Math.cos(streak.angle) * streak.length;
                const endY = streak.y - Math.sin(streak.angle) * streak.length;

                // Streak trail
                const grad = ctx.createLinearGradient(streak.x, streak.y, endX, endY);
                grad.addColorStop(0, `rgba(${streak.color}, ${streak.opacity})`);
                grad.addColorStop(0.3, `rgba(${streak.color}, ${streak.opacity * 0.5})`);
                grad.addColorStop(1, `rgba(${streak.color}, 0)`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(streak.x, streak.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                // Bright head glow
                const headGrad = ctx.createRadialGradient(
                    streak.x, streak.y, 0,
                    streak.x, streak.y, 8
                );
                headGrad.addColorStop(0, `rgba(255, 255, 255, ${streak.opacity * 0.8})`);
                headGrad.addColorStop(0.3, `rgba(${streak.color}, ${streak.opacity * 0.6})`);
                headGrad.addColorStop(1, `rgba(${streak.color}, 0)`);
                ctx.fillStyle = headGrad;
                ctx.beginPath();
                ctx.arc(streak.x, streak.y, 8, 0, Math.PI * 2);
                ctx.fill();
            }

            // ── Floating micro-sparkles ──
            sparkleTimer += 0.016;
            if (sparkleTimer > 0.3 && sparkles.length < maxSparkles) {
                sparkleTimer = 0;
                const spColor = particleColors[Math.floor(Math.random() * 4)];
                sparkles.push({
                    x: Math.random() * width,
                    y: viewBottom + 10,
                    vy: -(0.3 + Math.random() * 0.6),
                    vx: (Math.random() - 0.5) * 0.3,
                    life: 0,
                    maxLife: 200 + Math.random() * 300,
                    radius: 0.8 + Math.random() * 1.2,
                    color: spColor,
                });
            }
            for (let i = sparkles.length - 1; i >= 0; i--) {
                const sp = sparkles[i];
                sp.x += sp.vx;
                sp.y += sp.vy;
                sp.life++;

                if (sp.life > sp.maxLife || sp.y < viewTop - 20) {
                    sparkles.splice(i, 1);
                    continue;
                }

                const lifeRatio = sp.life / sp.maxLife;
                const fadeIn = Math.min(1, lifeRatio * 5);
                const fadeOut = Math.max(0, 1 - (lifeRatio - 0.7) / 0.3);
                const spOpacity = fadeIn * (lifeRatio > 0.7 ? fadeOut : 1) * 0.7;

                if (spOpacity < 0.02) continue;

                const spGrad = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sp.radius * 5);
                spGrad.addColorStop(0, `rgba(${sp.color}, ${spOpacity})`);
                spGrad.addColorStop(0.5, `rgba(${sp.color}, ${spOpacity * 0.3})`);
                spGrad.addColorStop(1, `rgba(${sp.color}, 0)`);
                ctx.fillStyle = spGrad;
                ctx.beginPath();
                ctx.arc(sp.x, sp.y, sp.radius * 5, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `rgba(255, 255, 255, ${spOpacity * 0.9})`;
                ctx.beginPath();
                ctx.arc(sp.x, sp.y, sp.radius * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // ── Mouse glow ──
            if (mouse.x > 0 && mouse.y > viewTop && mouse.y < viewBottom) {
                const mGrad = ctx.createRadialGradient(
                    mouse.x, mouse.y, 0,
                    mouse.x, mouse.y, 200
                );
                mGrad.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
                mGrad.addColorStop(0.3, 'rgba(6, 182, 212, 0.025)');
                mGrad.addColorStop(0.6, 'rgba(139, 92, 246, 0.01)');
                mGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
                ctx.fillStyle = mGrad;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 200, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', resize);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
        />
    );
}
