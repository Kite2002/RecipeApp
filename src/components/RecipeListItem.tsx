import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {APP_COLOR} from '../utils/Theme';
import {hp, wp} from '../utils/Helper';
import {Icon} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {Meal, MealContext} from '../context/MealContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigation';

type RecipeListItemType = {
  item: Meal;
  index: number;
};

const RecipeListItem = ({item, index}: RecipeListItemType) => {
  const {meals, addMeal, removeMealById, mealExists} = useContext(MealContext)!;
  const checkMealExists = (mealId: string) => {
    return mealExists(mealId);
  };
  const [isSaved, setIsSaved] = useState(checkMealExists(item?.idMeal));

  const handleAddMeal = (meal: Meal) => {
    addMeal(meal);
    setIsSaved(true);
  };

  const handleRemoveMeal = (mealId: string) => {
    removeMealById(mealId);
  };

  useEffect(() => {
    setIsSaved(checkMealExists(item?.idMeal));
  }, [meals]);

  const toggleSaveMeal = () => {
    if (isSaved) {
      handleRemoveMeal(item?.idMeal);
    } else {
      handleAddMeal(item);
    }
  };

  type DetailsScreenProps = StackNavigationProp<RootStackParamList, 'Details'>;
  const navigation = useNavigation<DetailsScreenProps>();

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
        onPress={() => {
          navigation.navigate('Details', {
            id: item?.idMeal,
          });
        }}
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
