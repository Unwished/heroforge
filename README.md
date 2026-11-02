# HeroForge RPG — Redux Toolkit + React Native (Expo)

Mini-juego para demostrar el flujo unidireccional de Redux con 4 zonas visuales independientes que se sincronizan solo a través del Store (sin prop drilling).

## Instalación

```bash
npx create-expo-app@latest heroforge --template blank-typescript
cd heroforge
npm install @reduxjs/toolkit react-redux
```

Luego copia a la raíz del proyecto:
- `App.tsx` (reemplaza el existente)
- la carpeta `src/`

```bash
npx expo start
```

## Estructura

```
App.tsx                      Provider + las 4 zonas (sin props)
src/
├── store/
│   ├── index.ts             configureStore + hooks tipados
│   ├── selectors.ts         Estado derivado (createSelector)
│   └── slices/
│       ├── statsSlice.ts        atributos + HP
│       ├── inventorySlice.ts    catálogo + equippedIds
│       └── actionLogSlice.ts    log vía extraReducers/addMatcher
└── components/
    ├── HeroAvatarHUD.tsx        Zona A (solo lee)
    ├── StatsControlPanel.tsx    Zona B (dispatch a stats)
    ├── ArmoryGrid.tsx           Zona C (dispatch a inventory)
    ├── ReduxLiveInspector.tsx   Zona D (combate + consola Redux)
    └── StatBar.tsx              Barra animada reutilizable (solo UI)
```

## Decisiones de diseño (útiles para explicar en el video)

- **Estado derivado:** `totalStats`, `totalWeight`, `maxCapacity`, `isOverencumbered`, `combatPower` y `heroVisualClass` NO están en ningún slice; se calculan en `selectors.ts` cruzando `stats` + `inventory`.
- **actionLogSlice:** usa `builder.addMatcher` con un matcher por prefijo (`stats/` e `inventory/`). Los otros slices no saben que el log existe.
- **Immer:** los reducers "mutan" (`state.str += 1`, `equippedIds.push(...)`), pero RTK usa Immer por debajo y produce un estado nuevo inmutable.
- **Estado local vs global:** el HP del jefe vive en `useState` dentro de `ReduxLiveInspector` porque nadie más lo necesita. El HP del héroe es global porque lo lee el avatar.
- **Presets:** `applyBuildPreset` reasigna todo en una sola acción (15 puntos base + 15 extra = 30 repartidos).
- **Sobrecarga:** capacidad = `10 + STR total * 2`; si el peso la supera, -30% al poder de combate. Para provocarla: equipa la Armadura Maldita (40 Kg) con la build inicial.

## Guion sugerido para el video

1. **0:00–1:30** Problema (useState + props) y ciclo: UI → dispatch(action) → reducer → state → selector → re-render.
2. **1:30–3:30** Demo: equipa Armadura Maldita (sobrecarga), aplica preset Mago, ataca al jefe hasta que el héroe caiga; señala el log.
3. **3:30–5:30** Código: `configureStore`, `toggleEquipItem` o `applyBuildPreset` (Immer + payload), y `selectors.ts`.
4. **5:30–6:30** Cuándo `useState` y cuándo Redux Toolkit.
