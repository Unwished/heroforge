import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import {
  StatKey,
  applyBuildPreset,
  decrementStat,
  incrementStat,
  resetStats,
} from '../store/slices/statsSlice';
import { selectTotalStats } from '../store/selectors';
import StatBar from './StatBar';

const ROWS: { key: StatKey; label: string; color: string }[] = [
  { key: 'str', label: '💪 Fuerza (STR)', color: '#ef4444' },
  { key: 'agi', label: '🏃 Agilidad (AGI)', color: '#10b981' },
  { key: 'int', label: '🧠 Inteligencia (INT)', color: '#3b82f6' },
];

// Zona B: despacha acciones a statsSlice.
export default function StatsControlPanel() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((s) => s.stats);
  const totals = useAppSelector(selectTotalStats);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Entrenamiento</Text>
        <View style={styles.points}>
          <Text style={styles.pointsText}>✨ {stats.availablePoints} pts</Text>
        </View>
      </View>

      {ROWS.map(({ key, label, color }) => {
        const bonus = totals[key] - stats[key];
        return (
          <View key={key} style={styles.row}>
            <Pressable
              style={[styles.btn, stats[key] <= 1 && styles.btnDisabled]}
              onPress={() => dispatch(decrementStat(key))}
            >
              <Text style={styles.btnText}>−</Text>
            </Pressable>
            <View style={styles.barBox}>
              <StatBar
                label={label}
                value={stats[key]}
                max={25}
                color={color}
                rightText={bonus > 0 ? `${stats[key]} (+${bonus})` : `${stats[key]}`}
              />
            </View>
            <Pressable
              style={[styles.btn, stats.availablePoints <= 0 && styles.btnDisabled]}
              onPress={() => dispatch(incrementStat(key))}
            >
              <Text style={styles.btnText}>+</Text>
            </Pressable>
          </View>
        );
      })}

      <View style={styles.presets}>
        <Pressable style={[styles.preset, { backgroundColor: '#7f1d1d' }]} onPress={() => dispatch(applyBuildPreset('WARRIOR'))}>
          <Text style={styles.presetText}>🛡️ Tanque</Text>
        </Pressable>
        <Pressable style={[styles.preset, { backgroundColor: '#1e3a8a' }]} onPress={() => dispatch(applyBuildPreset('MAGE'))}>
          <Text style={styles.presetText}>🧙 Mago</Text>
        </Pressable>
        <Pressable style={[styles.preset, { backgroundColor: '#064e3b' }]} onPress={() => dispatch(applyBuildPreset('ROGUE'))}>
          <Text style={styles.presetText}>🥷 Pícaro</Text>
        </Pressable>
      </View>

      <Pressable style={styles.reset} onPress={() => dispatch(resetStats())}>
        <Text style={styles.resetText}>🧪 Poción de Reseteo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0f172a', borderRadius: 16, padding: 14, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { color: '#f1f5f9', fontSize: 18, fontWeight: '700' },
  points: { backgroundColor: '#854d0e', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  pointsText: { color: '#fef08a', fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  barBox: { flex: 1, marginHorizontal: 10 },
  btn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.35 },
  btnText: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: -2 },
  presets: { flexDirection: 'row', gap: 8, marginTop: 10 },
  preset: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  presetText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  reset: { marginTop: 10, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: '#475569' },
  resetText: { color: '#fff', fontWeight: '600' },
});
