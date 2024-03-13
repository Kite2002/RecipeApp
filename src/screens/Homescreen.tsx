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

const Homescreen = () => {
  const [cat, setCat] = useState([]);
  const [loadingCat, setLoadingCat] = useState(false);
  const getCatagories = async () => {
    try {
      setLoadingCat(true);
      const {data} = await axios?.get(
        'https://www.themealdb.com/api/json/v1/1/categories.php',
      );
      setCat(data.categories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCat(false);
    }
  };
  useEffect(() => {
    getCatagories();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
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
        <ScrollView contentContainerStyle={{columnGap: wp(1.5)}} horizontal>
          {loadingCat ? (
            Array.from({length: 5}).map((_, index) => (
              <Skeleton
                key={index}
                height={hp(8)}
                width={wp(20)}
                animation="pulse"
                skeletonStyle={{
                  backgroundColor: APP_COLOR['Gray-100'],
                }}
              />
            ))
          ) : (
            <>
              {cat.map((item: any, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      backgroundColor: APP_COLOR['Gray-100'],
                      paddingHorizontal: wp(2),
                      paddingVertical: hp(0.8),
                      width: wp(20),
                      borderRadius: 8,
                      rowGap: hp(0.8),
                      justifyContent: 'center',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    <Image
                      resizeMode="contain"
                      resizeMethod="resize"
                      loadingIndicatorSource={require('../../assets/placeholder.jpg')}
                      style={{
                        width: '100%',
                        height: hp(4.5),
                      }}
                      source={{
                        uri: item?.strCategoryThumb,
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        color: APP_COLOR['Gray-400'],
                        fontSize: wp(3),
                        fontWeight: '600',
                      }}>
                      {item?.strCategory}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
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
