'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function FloatingNodes() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        interface Node {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            color: string;
            pulseOffset: number;
        }

        const nodes: Node[] = Array.from({ length: 25 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 3 + 1.5,
            color: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981'][Math.floor(Math.random() * 4)],
            pulseOffset: Math.random() * Math.PI * 2,
        }));

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            const time = Date.now() * 0.001;

            // Draw connections
            nodes.forEach((a, i) => {
                nodes.slice(i + 1).forEach((b) => {
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 * (1 - dist / 200)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            // Draw & update nodes
            nodes.forEach((node) => {
                const pulse = Math.sin(time * 2 + node.pulseOffset) * 0.3 + 0.7;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.globalAlpha = 0.6;
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * pulse * 3, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * pulse * 3);
                gradient.addColorStop(0, node.color + '30');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.globalAlpha = 0.4;
                ctx.fill();
                ctx.globalAlpha = 1;

                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background layers */}
            <div className="absolute inset-0 bg-navy-950" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple/5 via-transparent to-blue/5" />

            {/* Animated orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '0.75s' }} />

            {/* Network nodes canvas */}
            <FloatingNodes />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid opacity-30" />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full glass border border-cyan/20"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                        <span className="text-sm text-cyan-light font-medium">Federated Learning Powered</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
                    >
                        <span className="text-white">Detect Cross-Bank</span>
                        <br />
                        <span className="gradient-text">Fraud Networks</span>
                        <br />
                        <span className="text-white">Without Sharing</span>{' '}
                        <span className="gradient-text">Sensitive Data</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        FinAlliance enables financial institutions to collaboratively detect fraud
                        using federated learning while preserving customer privacy and regulatory compliance.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <a
                            href="#architecture"
                            className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan to-blue text-white font-semibold hover:shadow-xl hover:shadow-cyan/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                            View Architecture
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                        <a
                            href="#ai-models"
                            className="px-8 py-3.5 rounded-xl glass border border-cyan/20 text-slate-300 font-semibold hover:text-white hover:border-cyan/40 transition-all duration-300 hover:scale-105"
                        >
                            See AI Models
                        </a>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2"
                    >
                        <div className="w-1.5 h-3 rounded-full bg-cyan" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
