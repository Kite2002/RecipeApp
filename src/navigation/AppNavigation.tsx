import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Homescreen from '../screens/Homescreen';
import DetailsScreen from '../screens/DetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: {
    id: string;
    setIsSaved : any,
    isSaved : boolean
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Homescreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
