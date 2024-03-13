import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Homescreen from '../screens/Homescreen';
import DetailsScreen from '../screens/DetailsScreen';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{
        headerShown : false
    }}>
      <Stack.Screen name="Home" component={Homescreen} />
      <Stack.Screen name="Notifications" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
