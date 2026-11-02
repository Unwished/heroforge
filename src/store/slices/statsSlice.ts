import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StatKey = 'str' | 'agi' | 'int';
export type BuildPreset = 'WARRIOR' | 'MAGE' | 'ROGUE';

export const MAX_HP = 100;
export const MIN_STAT = 1;
export const INITIAL_POINTS = 15;

export interface StatsState {
  availablePoints: number;
  str: number;
  agi: number;
  int: number;
  currentHp: number;
}

const initialState: StatsState = {
  availablePoints: INITIAL_POINTS,
  str: 5,
  agi: 5,
  int: 5,
  currentHp: MAX_HP,
};

// Cada preset reparte los 15 puntos extra (5+5+5 base + 15 = 30 en total).
const PRESETS: Record<BuildPreset, { str: number; agi: number; int: number }> = {
  WARRIOR: { str: 16, agi: 7, int: 7 },
  MAGE: { str: 5, agi: 7, int: 18 },
  ROGUE: { str: 7, agi: 18, int: 5 },
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    incrementStat(state, action: PayloadAction<StatKey>) {
      if (state.availablePoints <= 0) return;
      state.availablePoints -= 1;
      state[action.payload] += 1;
    },
    decrementStat(state, action: PayloadAction<StatKey>) {
      if (state[action.payload] <= MIN_STAT) return;
      state.availablePoints += 1;
      state[action.payload] -= 1;
    },
    takeDamage(state, action: PayloadAction<number>) {
      state.currentHp = Math.max(0, state.currentHp - action.payload);
    },
    healHero(state) {
      state.currentHp = MAX_HP;
    },
    applyBuildPreset(state, action: PayloadAction<BuildPreset>) {
      const preset = PRESETS[action.payload];
      state.str = preset.str;
      state.agi = preset.agi;
      state.int = preset.int;
      state.availablePoints = 0;
    },
    resetStats(state) {
      state.availablePoints = INITIAL_POINTS;
      state.str = 5;
      state.agi = 5;
      state.int = 5;
    },
  },
});

export const {
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  applyBuildPreset,
  resetStats,
} = statsSlice.actions;

export default statsSlice.reducer;
