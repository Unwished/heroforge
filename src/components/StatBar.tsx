import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface Props {
  label: string;
  value: number;
  max: number;
  color: string;
  rightText?: string;
}

// Componente puramente visual y reutilizable: no conoce Redux.
export default function StatBar({ label, value, max, color, rightText }: Props) {
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const anim = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 300, useNativeDriver: false }).start();
  }, [pct, anim]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {rightText ? <Text style={styles.right}>{rightText}</Text> : null}
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  label: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
  right: { color: '#94a3b8', fontSize: 12 },
  track: { height: 10, borderRadius: 5, backgroundColor: '#1e293b', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
});
