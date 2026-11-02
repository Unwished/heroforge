import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Item } from './slices/inventorySlice';

/**
 * REGLA DE ORO: nada de lo que se calcula aquí se guarda en el state.
 * Todo se deriva de statsSlice + inventorySlice.
 */

// ---------- Selectores de entrada (simples) ----------
const selectBaseStr = (state: RootState) => state.stats.str;
const selectBaseAgi = (state: RootState) => state.stats.agi;
const selectBaseInt = (state: RootState) => state.stats.int;
const selectCatalog = (state: RootState) => state.inventory.catalog;
const selectEquippedIds = (state: RootState) => state.inventory.equippedIds;
const selectLogEntries = (state: RootState) => state.actionLog.entries;

export const selectCurrentHp = (state: RootState) => state.stats.currentHp;
export const selectIsDefeated = (state: RootState) => state.stats.currentHp <= 0;

const sumBy = (items: Item[], key: 'bonusStr' | 'bonusAgi' | 'bonusInt' | 'weight') =>
  items.reduce((acc, item) => acc + item[key], 0);

// ---------- Selectores derivados ----------
export const selectEquippedItems = createSelector(
  [selectCatalog, selectEquippedIds],
  (catalog, equippedIds) => catalog.filter((item) => equippedIds.includes(item.id)),
);

/** Atributos base + bonos de los ítems equipados. */
export const selectTotalStats = createSelector(
  [selectBaseStr, selectBaseAgi, selectBaseInt, selectEquippedItems],
  (str, agi, int, equipped) => ({
    str: str + sumBy(equipped, 'bonusStr'),
    agi: agi + sumBy(equipped, 'bonusAgi'),
    int: int + sumBy(equipped, 'bonusInt'),
  }),
);

export const selectTotalWeight = createSelector([selectEquippedItems], (equipped) =>
  sumBy(equipped, 'weight'),
);

/** Capacidad de carga máxima = 10 + (Fuerza Total * 2) */
export const selectMaxCapacity = createSelector(
  [selectTotalStats],
  (totals) => 10 + totals.str * 2,
);

export const selectIsOverencumbered = createSelector(
  [selectTotalWeight, selectMaxCapacity],
  (weight, capacity) => weight > capacity,
);

/** Poder de combate. Si está sobrecargado, -30%. */
export const selectCombatPower = createSelector(
  [selectTotalStats, selectIsOverencumbered],
  (totals, overloaded) => {
    const raw = totals.str * 3 + totals.agi * 2 + totals.int * 3;
    return overloaded ? Math.round(raw * 0.7) : raw;
  },
);

export interface HeroVisualClass {
  name: string;
  emoji: string;
  auraColor: string;
}

/** Clase visual según la estadística dominante (y el peso, para el Tanque). */
export const selectHeroVisualClass = createSelector(
  [selectTotalStats, selectTotalWeight],
  (totals, weight): HeroVisualClass => {
    const max = Math.max(totals.str, totals.agi, totals.int);

    if (max < 15) return { name: 'Aldeano', emoji: '🧑‍🌾', auraColor: '#94a3b8' };

    if (totals.str === max) {
      return weight > 25
        ? { name: 'Tanque Pesado', emoji: '🛡️', auraColor: '#f59e0b' }
        : { name: 'Guerrero Berserker', emoji: '🧔', auraColor: '#ef4444' };
    }
    if (totals.int === max) return { name: 'Archimago', emoji: '🧙', auraColor: '#3b82f6' };
    return { name: 'Asesino Sombrío', emoji: '🥷', auraColor: '#10b981' };
  },
);

/** Últimas 5 acciones; si el payload es el id de un ítem, muestra su nombre. */
export const selectLastActions = createSelector(
  [selectLogEntries, selectCatalog],
  (entries, catalog) =>
    entries.slice(0, 5).map((entry) => {
      const item = catalog.find((i) => i.id === entry.payload);
      return item ? { ...entry, payload: item.name } : entry;
    }),
);
