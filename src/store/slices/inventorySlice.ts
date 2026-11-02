import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ItemCategory = 'weapon' | 'armor' | 'accessory';

export interface Item {
  id: string;
  name: string;
  icon: string;
  category: ItemCategory;
  bonusStr: number;
  bonusAgi: number;
  bonusInt: number;
  weight: number; // Kg
}

export interface InventoryState {
  catalog: Item[];
  equippedIds: string[];
}

const catalog: Item[] = [
  { id: 'fire-sword', name: 'Espada de Fuego', icon: '🔥', category: 'weapon', bonusStr: 4, bonusAgi: 0, bonusInt: 1, weight: 8 },
  { id: 'titan-shield', name: 'Escudo de Titanio', icon: '🛡️', category: 'armor', bonusStr: 2, bonusAgi: 0, bonusInt: 0, weight: 15 },
  { id: 'arcane-staff', name: 'Báculo Arcano', icon: '🪄', category: 'weapon', bonusStr: 0, bonusAgi: 0, bonusInt: 6, weight: 4 },
  { id: 'elven-boots', name: 'Botas Élficas', icon: '🥾', category: 'accessory', bonusStr: 0, bonusAgi: 4, bonusInt: 0, weight: 2 },
  { id: 'cursed-armor', name: 'Armadura Maldita', icon: '💀', category: 'armor', bonusStr: 7, bonusAgi: 0, bonusInt: 0, weight: 40 },
  { id: 'shadow-dagger', name: 'Daga Sombría', icon: '🗡️', category: 'weapon', bonusStr: 0, bonusAgi: 5, bonusInt: 0, weight: 1 },
];

const initialState: InventoryState = {
  catalog,
  equippedIds: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    toggleEquipItem(state, action: PayloadAction<string>) {
      const index = state.equippedIds.indexOf(action.payload);
      if (index >= 0) {
        state.equippedIds.splice(index, 1);
      } else {
        state.equippedIds.push(action.payload);
      }
    },
    clearEquipment(state) {
      state.equippedIds = [];
    },
  },
});

export const { toggleEquipItem, clearEquipment } = inventorySlice.actions;

export default inventorySlice.reducer;
