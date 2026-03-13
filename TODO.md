# FedFortress Next.js Migration TODO
*Status: 0/14 complete (0%)*

## Approved Migration Plan ✅
**Next.js 15 App Router** in `FedFortress/frontend-next/`  
**Preserve ALL backend APIs** (`/api/*`, n8n webhook unchanged)

### Phase 1: Project Setup (0/2)
- [ ] 1. Create Next.js 15 project + Tailwind + TypeScript
- [ ] 2. Install deps: Three.js, Chart.js, Zustand, Framer Motion

### Phase 2: Core Components (0/7)
- [ ] 3. Navbar.tsx (mobile drawer, status pill, diagnostics link)
- [ ] 4. Hero3D.tsx (Three.js immersive shield + parallax)
- [ ] 5. Network3D.tsx (interactive topology viz)
- [ ] 6. TrainingCharts.tsx (Chart.js accuracy/loss + demo charts)
- [ ] 7. ConfigPanel.tsx (sliders, toggles, aggregation buttons)
- [ ] 8. ClientCards.tsx + SecurityGauge
- [ ] 9. ChatbotModal.tsx (medical AI + n8n webhook)

### Phase 3: Pages (0/2)
- [ ] 10. app/page.tsx (main landing page layout)
- [ ] 11. app/diagnostic/page.tsx (client analyzer)

### Phase 4: Integration + Testing (0/3)
- [ ] 12. API utils + Zustand store (backend connectivity)
- [ ] 13. Full testing: All charts, 3D, APIs, responsive, chatbot
- [ ] 14. Production: Build + Vercel config + deploy

## Commands to Run
```
cd FedFortress/frontend-next
npm run dev          # http://localhost:3000
npm run build        # Production build
vercel deploy        # Deploy
```

**Next Step:** `✅ Phase 1.1` — Create Next.js project structure
