import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {APP_COLOR} from '../utils/Theme';
import {hp, wp} from '../utils/Helper';
import {Icon} from '@rneui/base';
import {Skeleton} from '@rneui/themed';
import axios from 'axios';
import CatagoryList from '../components/CatagoryList';
import {FlatList} from 'react-native';
import RecipeListItem from '../components/RecipeListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Meal, MealContext} from '../context/MealContext';
import LottieView from 'lottie-react-native';

const Homescreen = () => {
  const [selectedCat, setSelectedCat] = useState('Beef');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const {meals} = useContext(MealContext)!;

  const fetchByCatagory = async (cat: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`,
      );
      setRecipes(res?.data?.meals);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchByCatagory(selectedCat);
  }, [selectedCat]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            (StatusBar?.currentHeight ? StatusBar.currentHeight : hp(2)) +
            hp(2),
        },
      ]}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <View
        style={{
          flexDirection: 'column',
          rowGap: hp(2),
        }}>
        <View style={styles.searchbox}>
          <TextInput
            style={styles.searchinput}
            placeholderTextColor={APP_COLOR['Gray-400']}
            placeholder="Search for recipes"
          />
          <Icon size={wp(6)} name="search" color={APP_COLOR?.['Gray-400']} />
        </View>
        <Text
          style={{
            color: APP_COLOR.Black,
            fontWeight: '700',
            fontSize: wp(4.5),
          }}>
          Catagories
        </Text>
        <CatagoryList
          selectedCat={selectedCat}
          setSelectedCat={setSelectedCat}
        />
      </View>

      {selectedCat == 'Saved' ? (
        <FlatList
          numColumns={2}
          columnWrapperStyle={{
            columnGap: wp(4),
          }}
          contentContainerStyle={{
            paddingVertical: hp(1),
            display: 'flex',
            justifyContent: 'space-between',
            rowGap: hp(2),
          }}
          ListEmptyComponent={() => {
            const ref = useRef<LottieView>(null);
            useEffect(() => {
              setTimeout(() => {
                ref?.current?.play();
              }, 300);
            }, []);
            return (
              <LottieView
                ref={ref}
                style={{height: hp(40), width: wp(100)}}
                autoPlay={false}
                source={require('../../assets/empty.json')}
                loop
              />
            );
          }}
          data={meals}
          renderItem={({item, index}: any) => {
            return <RecipeListItem item={item} index={index} />;
          }}
        />
      ) : (
        <>
          {loading ? (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                columnGap: wp(4),
                rowGap: hp(2),
              }}>
              {Array.from({length: 8}).map((_, index) => (
                <Skeleton
                  key={index}
                  height={hp(25)}
                  width={wp(43)}
                  animation="pulse"
                  skeletonStyle={{
                    backgroundColor: APP_COLOR['Gray-100'],
                  }}
                />
              ))}
            </View>
          ) : (
            <FlatList
              numColumns={2}
              columnWrapperStyle={{
                columnGap: wp(4),
              }}
              contentContainerStyle={{
                paddingVertical: hp(1),
                display: 'flex',
                justifyContent: 'space-between',
                rowGap: hp(2),
              }}
              data={recipes}
              renderItem={({item, index}: any) => {
                return <RecipeListItem item={item} index={index} />;
              }}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    flex: 1,
    backgroundColor: '#fff',
    rowGap: hp(4),
  },
  searchbox: {
    backgroundColor: APP_COLOR['Gray-100'],
    borderRadius: 8,
    paddingHorizontal: wp(3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchinput: {
    paddingVertical: hp(1.3),
    fontSize: wp(3.3),
    flex: 1,
  },
});

export default Homescreen;
