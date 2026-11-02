import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { healHero, takeDamage } from '../store/slices/statsSlice';
import { selectCombatPower, selectIsDefeated, selectLastActions } from '../store/selectors';
import StatBar from './StatBar';

const BOSS_MAX_HP = 300;

// Zona D: arena de combate + consola visual de Redux en vivo.
export default function ReduxLiveInspector() {
  const dispatch = useAppDispatch();
  const power = useAppSelector(selectCombatPower);
  const defeated = useAppSelector(selectIsDefeated);
  const lastActions = useAppSelector(selectLastActions);

  // Estado puramente local de esta zona (el HP del jefe no lo necesita nadie más).
  const [bossHp, setBossHp] = useState(BOSS_MAX_HP);
  const bossDead = bossHp <= 0;

  const attack = () => {
    setBossHp((hp) => Math.max(0, hp - power));
    // El jefe contraataca: el daño sí es estado global (afecta al avatar).
    const counter = 8 + Math.floor(Math.random() * 11);
    dispatch(takeDamage(counter));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Arena de Simulación</Text>

      <Text style={styles.boss}>{bossDead ? '☠️ Jefe derrotado' : '🐉 Dragón Ancestral'}</Text>
      <StatBar label="HP del Jefe" value={bossHp} max={BOSS_MAX_HP} color="#a855f7" rightText={`${bossHp}/${BOSS_MAX_HP}`} />

      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, { backgroundColor: '#b91c1c' }, (defeated || bossDead) && styles.disabled]}
          disabled={defeated || bossDead}
          onPress={attack}
        >
          <Text style={styles.btnText}>⚔️ Atacar ({power})</Text>
        </Pressable>
        <Pressable style={[styles.btn, { backgroundColor: '#15803d' }]} onPress={() => dispatch(healHero())}>
          <Text style={styles.btnText}>💖 Curar</Text>
        </Pressable>
        <Pressable style={[styles.btn, { backgroundColor: '#475569' }]} onPress={() => setBossHp(BOSS_MAX_HP)}>
          <Text style={styles.btnText}>🔄 Jefe</Text>
        </Pressable>
      </View>

      <View style={styles.console}>
        <Text style={styles.consoleTitle}>▌ REDUX LIVE — últimas 5 acciones</Text>
        {lastActions.length === 0 && <Text style={styles.empty}>(sin acciones todavía)</Text>}
        {lastActions.map((entry) => (
          <Text key={entry.id} style={styles.line} numberOfLines={1}>
            <Text style={styles.num}>#{entry.id} </Text>
            <Text style={styles.type}>[{entry.type}]</Text>
            <Text style={styles.payload}> → {entry.payload}</Text>
          </Text>
        ))}
      </View>
    </View>
  );
}

const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

const styles = StyleSheet.create({
  card: { backgroundColor: '#0f172a', borderRadius: 16, padding: 14, marginBottom: 24 },
  title: { color: '#f1f5f9', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  boss: { color: '#e9d5ff', fontWeight: '600', marginBottom: 2 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  disabled: { opacity: 0.4 },
  console: { marginTop: 14, backgroundColor: '#020617', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#14532d' },
  consoleTitle: { color: '#4ade80', fontFamily: mono, fontSize: 11, marginBottom: 6 },
  empty: { color: '#475569', fontFamily: mono, fontSize: 12 },
  line: { fontFamily: mono, fontSize: 12, marginVertical: 1 },
  num: { color: '#64748b' },
  type: { color: '#38bdf8' },
  payload: { color: '#fde68a' },
});
