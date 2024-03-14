import {Text, ScrollView, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@rneui/themed';
import { APP_COLOR } from '../utils/Theme';
import { hp, wp } from '../utils/Helper';
import { Image } from 'react-native';
import axios from 'axios';

const CatagoryList = () => {
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
    <ScrollView contentContainerStyle={{columnGap: wp(1.5)}} horizontal>
      {loadingCat ? (
        Array.from({length: 5}).map((_, index) => (
          <Skeleton
            key={index}
            height={hp(9.2)}
            width={wp(20)}
            animation="pulse"
            skeletonStyle={{
              backgroundColor: APP_COLOR['Gray-100'],
            }}
          />
        ))
      ) : (
        <>
          {cat.map((item: any, index: number) => {
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
  );
};

export default CatagoryList;
