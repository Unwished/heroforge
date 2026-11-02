import React from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import HeroAvatarHUD from './src/components/HeroAvatarHUD';
import StatsControlPanel from './src/components/StatsControlPanel';
import ArmoryGrid from './src/components/ArmoryGrid';
import ReduxLiveInspector from './src/components/ReduxLiveInspector';

// Las 4 zonas son hermanas: NO reciben props. Todas leen/escriben en el Store.
export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.root}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.content}>
          <HeroAvatarHUD />
          <StatsControlPanel />
          <ArmoryGrid />
          <ReduxLiveInspector />
        </ScrollView>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 54,
  },
  content: { padding: 12 },
});
