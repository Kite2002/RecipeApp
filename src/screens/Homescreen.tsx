import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APP_COLOR} from '../utils/Theme';
import {hp, wp} from '../utils/Helper';
import {Icon} from '@rneui/base';
import {Skeleton} from '@rneui/themed';
import axios from 'axios';
import CatagoryList from '../components/CatagoryList';
import {FlatList} from 'react-native';

const Homescreen = () => {
  const [selectedCat, setSelectedCat] = useState('Beef');
  const [recipes, setRecipes] = useState([]);

  const fetchByCatagory = async (cat: string) => {
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`,
      );
      setRecipes(res?.data?.meals);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchByCatagory(selectedCat);
  }, [selectedCat]);

  return (
    <View style={styles.container}>
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
        <CatagoryList />
      </View>
      <FlatList
        numColumns={2}
        columnWrapperStyle={{
          columnGap: wp(4),
        }}
        contentContainerStyle={{
          paddingBottom: hp(2),
          display: 'flex',
          justifyContent: 'space-between',
          rowGap: hp(2),
        }}
        data={recipes}
        renderItem={({item, index}: any) => {
          return (
            <TouchableOpacity
              style={{
                flex: 1,
                borderRadius: 12,
                overflow: 'hidden',
                elevation: 1,
                backgroundColor: APP_COLOR?.White,
              }}
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
              <View style ={{padding : wp(4)}}>
                <Text
                  numberOfLines={1}
                  style={{color: APP_COLOR?.['Slate-900'], maxWidth: '100%' , fontWeight : '600' , fontSize : wp(3)}}>
                  {item?.strMeal}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
