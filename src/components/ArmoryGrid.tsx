import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { clearEquipment, toggleEquipItem } from '../store/slices/inventorySlice';
import { selectIsOverencumbered } from '../store/selectors';

// Zona C: despacha acciones a inventorySlice (el log se alimenta solo vía addMatcher).
export default function ArmoryGrid() {
  const dispatch = useAppDispatch();
  const catalog = useAppSelector((s) => s.inventory.catalog);
  const equippedIds = useAppSelector((s) => s.inventory.equippedIds);
  const overloaded = useAppSelector(selectIsOverencumbered);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Armería & Mochila</Text>
        <Pressable style={styles.clear} onPress={() => dispatch(clearEquipment())}>
          <Text style={styles.clearText}>Desequipar todo</Text>
        </Pressable>
      </View>

      {overloaded && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>⚠️ ¡SOBRECARGADO! (-50% Velocidad)</Text>
        </View>
      )}

      <View style={styles.grid}>
        {catalog.map((item) => {
          const equipped = equippedIds.includes(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => dispatch(toggleEquipItem(item.id))}
              style={[styles.item, equipped && styles.itemEquipped]}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <View style={styles.bonuses}>
                {item.bonusStr > 0 && <Text style={styles.bonus}>+{item.bonusStr} Ataque</Text>}
                {item.bonusAgi > 0 && <Text style={styles.bonus}>+{item.bonusAgi} Agilidad</Text>}
                {item.bonusInt > 0 && <Text style={styles.bonus}>+{item.bonusInt} Magia</Text>}
              </View>
              <Text style={styles.weight}>⚖️ {item.weight} Kg</Text>
              {equipped && <Text style={styles.tag}>EQUIPADO</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0f172a', borderRadius: 16, padding: 14, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { color: '#f1f5f9', fontSize: 18, fontWeight: '700' },
  clear: { backgroundColor: '#475569', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  clearText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  alert: { backgroundColor: '#7f1d1d', borderRadius: 10, padding: 8, marginBottom: 8, borderWidth: 1, borderColor: '#ef4444' },
  alertText: { color: '#fecaca', fontWeight: '700', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  item: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  itemEquipped: {
    borderColor: '#facc15',
    shadowColor: '#facc15',
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  icon: { fontSize: 32 },
  name: { color: '#f1f5f9', fontWeight: '600', marginTop: 4 },
  bonuses: { marginTop: 4, alignItems: 'center', minHeight: 32 },
  bonus: { color: '#86efac', fontSize: 11 },
  weight: { color: '#fbbf24', fontSize: 12, marginTop: 2 },
  tag: { color: '#facc15', fontSize: 10, fontWeight: '800', marginTop: 4 },
});
