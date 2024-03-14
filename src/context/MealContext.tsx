import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useState,
  useContext,
  FC,
  ReactNode,
  useEffect,
} from 'react';

export interface Meal {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

interface MealContextType {
  meals: Meal[];
  addMeal: (meal: Meal) => void; 
  removeMealById: (mealId: string) => void; 
  mealExists: (mealId: string) => boolean; 
}

export const MealContext = createContext<MealContextType | undefined>(
  undefined,
);

interface MealProviderProps {
  children: ReactNode; 
}

export const MealProvider: FC<MealProviderProps> = ({children}) => {
  const [meals, setMeals] = useState<Meal[]>([]);

  const addMeal = (meal: Meal) => {
    setMeals([...meals, meal]);
  };

  const removeMealById = (mealId: string) => {
    setMeals(meals.filter(meal => meal.idMeal !== mealId));
  };

  const mealExists = (mealId: string) => {
    return meals.some(meal => meal.idMeal === mealId);
  };

  useEffect(() => {
    const getFromStorge = async () => {
      const storedMeals = await AsyncStorage.getItem('meals');
      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      }
    };
    getFromStorge();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('meals', JSON.stringify(meals));
  }, [meals]);

  const mealContextValue: MealContextType = {
    meals,
    addMeal,
    removeMealById,
    mealExists,
  };

  return (
    <MealContext.Provider value={mealContextValue}>
      {children}
    </MealContext.Provider>
  );
};
