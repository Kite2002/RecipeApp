import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {StatusBar, TouchableOpacity, View} from 'react-native';
import {Text, Image, ScrollView, StyleSheet} from 'react-native';
import {APP_COLOR} from '../utils/Theme';
import {hp, wp} from '../utils/Helper';
import {Icon} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {Meal, MealContext} from '../context/MealContext';

const MealDetailsScreen = ({route}: any) => {
  const {id: mealId} = route.params;
  const [ingredients, setIngredients] = useState<any>([]);
  const [measures, setMeasures] = useState<any>([]);
  const [meal, setMeal] = useState<any>(null);
  const {meals, addMeal, removeMealById, mealExists} = useContext(MealContext)!;

  const checkMealExists = (mealId: string) => {
    return mealExists(mealId);
  };

  const [savedMeal, setIsSavedMeal] = useState(checkMealExists(mealId));

  useEffect(() => {
    setIsSavedMeal(checkMealExists(mealId));
  }, [meals]);

  const handleAddMeal = (meal: Meal) => {
    addMeal(meal);
    setIsSavedMeal(true);
  };

  const handleRemoveMeal = (mealId: string) => {
    removeMealById(mealId);
    setIsSavedMeal(false);
  };

  const toggleSaveMeal = () => {
    if (savedMeal) {
      handleRemoveMeal(meal?.idMeal);
    } else {
      handleAddMeal({
        idMeal: mealId,
        strMeal: meal?.strMeal,
        strMealThumb: meal?.strMealThumb,
      });
    }
  };

  const getMeal = async () => {
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
      );
      setMeal(res.data.meals[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMeal();
  }, []);

  useEffect(() => {
    if (meal) {
      const newIn = [];
      const newMe = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && measure) {
          newIn.push(ingredient);
          newMe.push(measure);
        }
        setMeasures(newMe);
        setIngredients(newIn);
      }
    }
  }, [meal]);
  const navigation = useNavigation();
  return (
    <>
      <StatusBar translucent backgroundColor={'transparent'} />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            zIndex: 2,
            left: wp(6),
            top: hp(5),
          }}>
          <Icon
            style={{
              backgroundColor: APP_COLOR?.White,
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              padding: wp(1),
              borderRadius: 200,
            }}
            color={APP_COLOR['Pizazz-500']}
            name="arrow-back"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleSaveMeal}
          style={{
            position: 'absolute',
            right: wp(6),
            top: hp(5),
            zIndex: 10,
            backgroundColor: APP_COLOR?.White,
            borderRadius: 200,
            padding: wp(0.8),
            elevation: 2,
          }}>
          <Icon
            size={wp(8)}
            color={APP_COLOR?.['Pizazz-500']}
            name={savedMeal ? 'bookmark' : 'bookmark-outline'}
          />
        </TouchableOpacity>
        {meal && (
          <>
            <Image source={{uri: meal.strMealThumb}} style={styles.image} />
            <View style={{paddingHorizontal: wp(5), paddingBottom: hp(2)}}>
              <Text style={styles.name}>{meal.strMeal}</Text>
              <Text style={styles.origin}>Origin : {meal.strArea}</Text>
              <Text style={styles.instructions}>{meal.strInstructions}</Text>
              <Text style={styles.ingredientsTitle}>Ingredients:</Text>
            </View>
          </>
        )}

        <View style={styles.ingredientsContainer}>
          {ingredients.map((ingredient: string, index: string) => (
            <Text style={styles.ingred} key={index}>
              - {measures[index]} {ingredient}
            </Text>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: APP_COLOR.White,
    // alignItems: 'center',
  },
  image: {
    width: '100%',
    height: hp(45),
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    resizeMode: 'cover',
  },
  name: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: APP_COLOR['Slate-900'],
    marginTop: 10,
  },
  origin: {
    fontSize: wp(3),
    fontWeight: '400',
    color: APP_COLOR['Slate-500'],
  },
  instructions: {
    fontSize: wp(3),
    marginTop: 20,
    color: APP_COLOR['Slate-500'],
    flexDirection: 'column',
  },
  ingredientsTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: APP_COLOR['Slate-900'],
    marginTop: 20,
  },
  ingredientsContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(4),
  },
  ingred: {
    fontSize: wp(3),
    fontWeight: 'bold',
    color: APP_COLOR['Slate-500'],
  },
});

export default MealDetailsScreen;
