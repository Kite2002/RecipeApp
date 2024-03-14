import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLOR} from '../utils/Theme';
import {hp, wp} from '../utils/Helper';
import {Icon} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

type RecipeListItemType = {
  item: {
    strMeal: string;
    strMealThumb: string;
    idMeal: number;
  };
  index: number;
};

const RecipeListItem = ({item, index}: RecipeListItemType) => {
  const [isSaved, setIsSaved] = useState(false);

  const checkSaved = async () => {
    const existingMeals = await AsyncStorage.getItem('savedMeals');
    if (existingMeals) {
      const parsedMeals = JSON.parse(existingMeals);
      if (parsedMeals[item?.idMeal]) {
        setIsSaved(true);
      }
    }
  };

  useEffect(() => {
    checkSaved();
  }, []);

  const removeSavedMealFromLocal = async (mealId : number) => {
    try {
      // Retrieve existing meals from local storage
      const existingMeals = await AsyncStorage.getItem('savedMeals');

      if (existingMeals) {
        // Parse the existing meals from JSON
        let updatedMeals = JSON.parse(existingMeals);

        // Check if the meal to remove exists in the updated meals object
        if (updatedMeals[mealId]) {
          // Remove the meal from the updated meals object
          delete updatedMeals[mealId];

          // Save the updated meals object back to local storage
          await AsyncStorage.setItem(
            'savedMeals',
            JSON.stringify(updatedMeals),
          );

          console.log(updatedMeals);
          Alert.alert('Meal removed successfully!');
          setIsSaved(false)
        } else {
          Alert.alert('Meal not found!');
        }
      } else {
        Alert.alert('No saved meals found!');
      }
    } catch (error) {
      console.error('Error removing meal:', error);
    }
  };

  const toggleSaveMeal = async () => {
    try {
      // Retrieve existing meals from local storage
      const existingMeals = await AsyncStorage.getItem('savedMeals');
      let updatedMeals : any = {};

      if (existingMeals) {
        // If existing meals are found, parse them from JSON
        updatedMeals = JSON.parse(existingMeals);
      }

      // Check if the meal is already saved
      if (updatedMeals[item.idMeal]) {
        // If the meal is already saved, remove it
        await removeSavedMealFromLocal(item.idMeal);
      } else {
        // If the meal is not saved, add it to the updated meals object with its ID as key
        updatedMeals[item.idMeal] = item;

        // Save the updated meals object back to local storage
        await AsyncStorage.setItem('savedMeals', JSON.stringify(updatedMeals));
        console.log(updatedMeals);
        setIsSaved(true)
        Alert.alert('Meal saved successfully!');
      }
    } catch (error) {
      console.error('Error toggling meal:', error);
    }
  };

  return (
    <View
      style={{
        position: 'relative',
        flex: 1,
        maxWidth: '48%',
        borderRadius: 12,
        elevation: 1,
        backgroundColor: APP_COLOR?.White,
      }}>
      <TouchableOpacity
        style={{overflow: 'hidden', borderRadius: 12}}
        key={index}>
        <Image
          resizeMode="contain"
          resizeMethod="resize"
          loadingIndicatorSource={require('../../assets/placeholder.jpg')}
          style={{
            width: '100%',
            height: hp('20%'),
          }}
          source={{
            uri: item?.strMealThumb,
          }}
        />
        <View style={{padding: wp(4)}}>
          <Text
            numberOfLines={1}
            style={{
              color: APP_COLOR?.['Slate-900'],
              maxWidth: '100%',
              fontWeight: '600',
              fontSize: wp(3),
            }}>
            {item?.strMeal}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={toggleSaveMeal}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          backgroundColor: APP_COLOR?.White,
          borderRadius: 200,
          padding: wp(0.8),
          elevation: 2,
        }}>
        <Icon
          size={wp(6)}
          color={APP_COLOR?.['Pizazz-500']}
          name={isSaved ? 'bookmark' : 'bookmark-outline'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default RecipeListItem;
