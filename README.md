# HeroForge RPG — Redux Toolkit + React Native (Expo)

Mini-juego para demostrar el flujo unidireccional de Redux con 4 zonas visuales independientes que se sincronizan solo a través del Store (sin prop drilling).

## Instalación

```bash
npx create-expo-app@latest heroforge --template blank-typescript
cd heroforge
npm install @reduxjs/toolkit react-redux
```

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

