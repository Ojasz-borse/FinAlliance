'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import SectionParticles from './SectionParticles';

function NetworkGlobe() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const container = mountRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5.5);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // ── 1. Main wireframe sphere (VISIBLE) ──
        const sphereGeo = new THREE.IcosahedronGeometry(2.0, 2);
        const sphereMat = new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        globeGroup.add(sphere);

        // ── 2. Second wireframe layer (creates depth) ──
        const sphere2Geo = new THREE.IcosahedronGeometry(2.05, 3);
        const sphere2Mat = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            wireframe: true,
            transparent: true,
            opacity: 0.06,
        });
        const sphere2 = new THREE.Mesh(sphere2Geo, sphere2Mat);
        sphere2.rotation.set(0.5, 0.3, 0);
        globeGroup.add(sphere2);

        // ── 3. Inner glow sphere ──
        const innerGlowGeo = new THREE.SphereGeometry(1.9, 32, 32);
        const innerGlowMat = new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.05,
            side: THREE.BackSide,
        });
        globeGroup.add(new THREE.Mesh(innerGlowGeo, innerGlowMat));

        // ── 4. Orbital rings (bright, tilted) ──
        const ringConfigs = [
            { color: 0x06b6d4, radius: 2.5, tilt: { x: 0.4, y: 0, z: 0.2 }, opacity: 0.25 },
            { color: 0x3b82f6, radius: 2.65, tilt: { x: -0.6, y: 0.4, z: -0.3 }, opacity: 0.2 },
            { color: 0x8b5cf6, radius: 2.8, tilt: { x: 0.2, y: -0.5, z: 0.6 }, opacity: 0.18 },
        ];
        const rings: THREE.Line[] = [];
        ringConfigs.forEach((cfg) => {
            const curve = new THREE.EllipseCurve(0, 0, cfg.radius, cfg.radius, 0, Math.PI * 2, false, 0);
            const pts = curve.getPoints(120).map(p => new THREE.Vector3(p.x, p.y, 0));
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const mat = new THREE.LineBasicMaterial({ color: cfg.color, transparent: true, opacity: cfg.opacity });
            const ring = new THREE.Line(geo, mat);
            ring.rotation.set(cfg.tilt.x, cfg.tilt.y, cfg.tilt.z);
            globeGroup.add(ring);
            rings.push(ring);
        });

        // ── 5. Network nodes (bigger, more visible, with halos) ──
        const nodeCount = 14;
        const nodes: THREE.Mesh[] = [];
        const nodeHalos: THREE.Mesh[] = [];
        const nodeBasePos: THREE.Vector3[] = [];
        const nodeColors = [0x06b6d4, 0x3b82f6, 0x8b5cf6, 0x10b981, 0x22d3ee, 0x60a5fa];

        for (let i = 0; i < nodeCount; i++) {
            const y = 1 - (i / (nodeCount - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            const pos = new THREE.Vector3(x * 2.05, y * 2.05, z * 2.05);
            const color = nodeColors[i % nodeColors.length];

            // Main node (bright dot)
            const nGeo = new THREE.SphereGeometry(0.05, 12, 12);
            const nMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1.0 });
            const node = new THREE.Mesh(nGeo, nMat);
            node.position.copy(pos);
            globeGroup.add(node);
            nodes.push(node);
            nodeBasePos.push(pos.clone());

            // Glow halo
            const hGeo = new THREE.SphereGeometry(0.12, 12, 12);
            const hMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.25 });
            const halo = new THREE.Mesh(hGeo, hMat);
            halo.position.copy(pos);
            globeGroup.add(halo);
            nodeHalos.push(halo);
        }

        // ── 6. Connections (curved bright lines) ──
        for (let i = 0; i < nodeBasePos.length; i++) {
            for (let j = i + 1; j < nodeBasePos.length; j++) {
                if (nodeBasePos[i].distanceTo(nodeBasePos[j]) < 2.8) {
                    const mid = nodeBasePos[i].clone().add(nodeBasePos[j]).multiplyScalar(0.5);
                    mid.normalize().multiplyScalar(2.3);
                    const curve = new THREE.QuadraticBezierCurve3(nodeBasePos[i], mid, nodeBasePos[j]);
                    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
                    const mat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.15 });
                    globeGroup.add(new THREE.Line(geo, mat));
                }
            }
        }

        // ── 7. Flowing data particles on orbital rings ──
        interface OrbParticle { mesh: THREE.Mesh; trail: THREE.Mesh; ringIdx: number; angle: number; speed: number; radius: number; }
        const orbParticles: OrbParticle[] = [];
        for (let i = 0; i < 24; i++) {
            const ri = i % 3;
            const color = ringConfigs[ri].color;
            // Main particle
            const pGeo = new THREE.SphereGeometry(0.025, 8, 8);
            const pMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
            const pMesh = new THREE.Mesh(pGeo, pMat);
            globeGroup.add(pMesh);
            // Trail glow
            const tGeo = new THREE.SphereGeometry(0.06, 8, 8);
            const tMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2 });
            const tMesh = new THREE.Mesh(tGeo, tMat);
            globeGroup.add(tMesh);

            orbParticles.push({
                mesh: pMesh, trail: tMesh, ringIdx: ri,
                angle: (Math.PI * 2 * i) / 24 + Math.random(),
                speed: 0.005 + Math.random() * 0.008,
                radius: ringConfigs[ri].radius,
            });
        }

        // ── 8. Data pulse beams (node to node) ──
        interface PulseBeam { mesh: THREE.Mesh; startIdx: number; endIdx: number; progress: number; speed: number; active: boolean; timer: number; }
        const pulseBeams: PulseBeam[] = [];
        for (let i = 0; i < 6; i++) {
            const bGeo = new THREE.SphereGeometry(0.035, 8, 8);
            const bMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.0 });
            const bMesh = new THREE.Mesh(bGeo, bMat);
            globeGroup.add(bMesh);
            pulseBeams.push({ mesh: bMesh, startIdx: 0, endIdx: 1, progress: 0, speed: 0.015 + Math.random() * 0.01, active: false, timer: i * 60 + Math.random() * 120 });
        }

        // ── 9. Ambient particles (stars/sparkle) ──
        const starCount = 120;
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            starPos[i * 3] = (Math.random() - 0.5) * 14;
            starPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            starPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ color: 0x06b6d4, size: 0.02, transparent: true, opacity: 0.5, sizeAttenuation: true });
        scene.add(new THREE.Points(starGeo, starMat));

        // ── Mouse tracking ──
        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
        const onMouse = (e: MouseEvent) => {
            mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouse);

        // ── Animation ──
        let frameId: number;
        const clock = new THREE.Clock();
        let frameCount = 0;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            frameCount++;

            mouse.x += (mouse.tx - mouse.x) * 0.04;
            mouse.y += (mouse.ty - mouse.y) * 0.04;

            // Globe rotation
            globeGroup.rotation.y = t * 0.12;
            globeGroup.rotation.x = Math.sin(t * 0.06) * 0.12;
            globeGroup.rotation.z = mouse.x * 0.08;

            // Second wireframe counter-rotate
            sphere2.rotation.y = -t * 0.05;

            // Pulse wireframe opacity
            sphereMat.opacity = 0.12 + Math.sin(t * 0.4) * 0.04;

            // Pulse rings
            rings.forEach((ring, i) => {
                (ring.material as THREE.LineBasicMaterial).opacity = 
                    ringConfigs[i].opacity + Math.sin(t * 0.5 + i * 2) * 0.06;
            });

            // Node pulse
            nodes.forEach((node, i) => {
                const s = 1 + Math.sin(t * 2.5 + i * 0.8) * 0.4;
                node.scale.setScalar(s);
                nodeHalos[i].scale.setScalar(s * 1.2);
                (nodeHalos[i].material as THREE.MeshBasicMaterial).opacity = 
                    0.15 + Math.sin(t * 2 + i) * 0.1;
            });

            // Orbital particles
            orbParticles.forEach((p) => {
                p.angle += p.speed;
                const x = Math.cos(p.angle) * p.radius;
                const y = Math.sin(p.angle) * p.radius;
                const pos = new THREE.Vector3(x, y, 0);
                const tilt = ringConfigs[p.ringIdx].tilt;
                pos.applyEuler(new THREE.Euler(tilt.x, tilt.y, tilt.z));
                p.mesh.position.copy(pos);
                // Trail follows slightly behind
                const tx = Math.cos(p.angle - 0.15) * p.radius;
                const ty = Math.sin(p.angle - 0.15) * p.radius;
                const tpos = new THREE.Vector3(tx, ty, 0);
                tpos.applyEuler(new THREE.Euler(tilt.x, tilt.y, tilt.z));
                p.trail.position.copy(tpos);
                const op = 0.5 + Math.sin(p.angle * 3 + t) * 0.4;
                (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0.2, op);
                (p.trail.material as THREE.MeshBasicMaterial).opacity = Math.max(0.05, op * 0.3);
            });

            // Pulse beams (data transfer animation)
            pulseBeams.forEach((beam) => {
                if (!beam.active) {
                    beam.timer--;
                    if (beam.timer <= 0) {
                        beam.active = true;
                        beam.progress = 0;
                        beam.startIdx = Math.floor(Math.random() * nodeCount);
                        beam.endIdx = (beam.startIdx + 1 + Math.floor(Math.random() * (nodeCount - 1))) % nodeCount;
                    }
                    return;
                }
                beam.progress += beam.speed;
                if (beam.progress > 1) {
                    beam.active = false;
                    beam.timer = 60 + Math.random() * 180;
                    (beam.mesh.material as THREE.MeshBasicMaterial).opacity = 0;
                    return;
                }
                const start = nodes[beam.startIdx].position;
                const end = nodes[beam.endIdx].position;
                beam.mesh.position.lerpVectors(start, end, beam.progress);
                const op = Math.sin(beam.progress * Math.PI) * 0.9;
                (beam.mesh.material as THREE.MeshBasicMaterial).opacity = op;
                beam.mesh.scale.setScalar(1 + op * 0.5);
            });

            // Star twinkle
            const positions = starGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < starCount; i++) {
                positions[i * 3 + 1] += Math.sin(t * 0.3 + i * 0.5) * 0.0003;
            }
            starGeo.attributes.position.needsUpdate = true;

            // Camera parallax
            camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.025;
            camera.position.y += (-mouse.y * 0.3 - camera.position.y) * 0.025;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('mousemove', onMouse);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 z-0" />;
}

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Deep background */}
            <div className="absolute inset-0 bg-navy-950" />

            {/* Dynamic canvas particles */}
            <SectionParticles
                colors={['6, 182, 212', '59, 130, 246', '139, 92, 246', '34, 211, 238']}
                count={55}
                speed={0.5}
                glowIntensity={1}
            />

            {/* 3D Globe */}
            <NetworkGlobe />

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
                        <span className="text-white drop-shadow-lg">Detect Cross-Bank</span>
                        <br />
                        <span className="gradient-text">Fraud Networks</span>
                        <br />
                        <span className="text-white drop-shadow-lg">Without Sharing</span>{' '}
                        <span className="gradient-text">Sensitive Data</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed"
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
                            href="/dashboard"
                            className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan to-blue text-white font-semibold hover:shadow-xl hover:shadow-cyan/25 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                            Open Dashboard
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                        <a
                            href="/fraud-check"
                            className="px-8 py-3.5 rounded-xl glass border border-cyan/20 text-slate-200 font-semibold hover:text-white hover:border-cyan/40 hover:shadow-lg hover:shadow-cyan/10 transition-all duration-300 hover:scale-105"
                        >
                            Try Fraud Check
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
                        className="w-6 h-10 rounded-full border-2 border-slate-500 flex justify-center pt-2"
                    >
                        <div className="w-1.5 h-3 rounded-full bg-cyan" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
