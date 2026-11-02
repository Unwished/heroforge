import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MAX_HP } from '../store/slices/statsSlice';
import { useAppSelector } from '../store';
import {
  selectCombatPower,
  selectCurrentHp,
  selectEquippedItems,
  selectHeroVisualClass,
  selectIsDefeated,
  selectIsOverencumbered,
  selectMaxCapacity,
  selectTotalStats,
  selectTotalWeight,
} from '../store/selectors';
import StatBar from './StatBar';

// Zona A: sin botones, sin props. Solo lee del Store.
export default function HeroAvatarHUD() {
  const heroClass = useAppSelector(selectHeroVisualClass);
  const totals = useAppSelector(selectTotalStats);
  const weight = useAppSelector(selectTotalWeight);
  const capacity = useAppSelector(selectMaxCapacity);
  const overloaded = useAppSelector(selectIsOverencumbered);
  const power = useAppSelector(selectCombatPower);
  const hp = useAppSelector(selectCurrentHp);
  const defeated = useAppSelector(selectIsDefeated);
  const equipped = useAppSelector(selectEquippedItems);

  const weapon = equipped.find((i) => i.category === 'weapon');
  const hurt = hp > 0 && hp < 35;

  const avatar = defeated ? '💀' : heroClass.emoji;
  const mood = defeated ? 'Derrotado' : hurt ? 'Herido 🤕' : 'Sano 💪';
  const aura = defeated ? '#475569' : heroClass.auraColor;

  const weightRatio = capacity > 0 ? weight / capacity : 0;
  const weightColor = overloaded ? '#ef4444' : weightRatio > 0.7 ? '#eab308' : '#22c55e';
  const hpColor = hp > 60 ? '#22c55e' : hp > 30 ? '#eab308' : '#ef4444';

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={[styles.avatar, { borderColor: aura, shadowColor: aura }]}>
          <Text style={styles.avatarEmoji}>{avatar}</Text>
          <Text style={styles.weaponEmoji}>{weapon ? weapon.icon : '✊'}</Text>
        </View>
        <View style={styles.info}>
          <View style={[styles.badge, { backgroundColor: aura }]}>
            <Text style={styles.badgeText}>{defeated ? 'Caído' : heroClass.name}</Text>
          </View>
          <Text style={styles.mood}>{mood}</Text>
          <Text style={styles.power}>⚔️ Poder: {power}{overloaded ? ' (-30%)' : ''}</Text>
          <Text style={styles.stats}>
            STR {totals.str} · AGI {totals.agi} · INT {totals.int}
          </Text>
        </View>
      </View>

      <StatBar label="❤️ Vida (HP)" value={hp} max={MAX_HP} color={hpColor} rightText={`${hp}/${MAX_HP}`} />
      <StatBar label="🔮 Maná" value={totals.int * 5} max={100} color="#3b82f6" rightText={`${totals.int * 5}`} />
      <StatBar
        label="🎒 Carga"
        value={Math.min(weight, capacity)}
        max={capacity}
        color={weightColor}
        rightText={`${weight} / ${capacity} Kg`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0f172a', borderRadius: 16, padding: 14, marginBottom: 12 },
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  avatarEmoji: { fontSize: 46 },
  weaponEmoji: { position: 'absolute', right: -6, bottom: -2, fontSize: 28 },
  info: { flex: 1, marginLeft: 16 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  mood: { color: '#e2e8f0', marginTop: 6, fontSize: 13 },
  power: { color: '#fde68a', marginTop: 2, fontWeight: '600' },
  stats: { color: '#94a3b8', marginTop: 2, fontSize: 12 },
});
