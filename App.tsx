import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StatusBar, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigation from './src/navigation/AppNavigation';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
          <AppNavigation />
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
