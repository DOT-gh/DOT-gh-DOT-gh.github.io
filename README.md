# Defense Resource Simulation (Educational Game)

Educational, abstract resource allocation game: defend critical assets from waves of generic aerial threats by allocating limited interceptors.  
All "weapon" and "threat" data are abstracted, non-sensitive, non-technical. No actionable real-world instructions.

## Features (MVP)
- Turn-based waves
- Multiple threat classes (speed, durability, value of damage)
- Interceptor allocation with different efficiency & cost
- Simple economy (budget replenishment))
- Outcome summary per wave
- Scoring: cumulative prevented damage vs passed damage

## Roadmap (suggested)
1. Visual polish (charts, animations)
2. Difficulty scaling curves (logistic or piecewise)
3. Persistence (localStorage or backend API)
4. Analytics dashboard (aggregated stats)
5. Sandbox mode (adjust parameters)
6. Internationalization (i18n)
7. Accessibility improvements (WCAG)
8. Multiplayer (simultaneous allocation races)
9. AI advisor (suggest optimal allocation)
10. Progressive Web App packaging

## Tech
- Next.js + TypeScript
- Zustand for state
- TailwindCSS
- Functional core / UI shell pattern (pure logic in `src/engine`)

## Running
```bash
pnpm install   # or npm install / yarn
pnpm dev       # open http://localhost:3000
```

## Disclaimer
This application is an abstract educational simulation. It does not provide real-world operational guidance, and all data are simplified.
