import {Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {SetStateAction, useEffect, useState} from 'react';
import {Skeleton} from '@rneui/themed';
import {APP_COLOR} from '../utils/Theme';
import {hp, wp} from '../utils/Helper';
import {Image} from 'react-native';
import axios from 'axios';
import {Icon} from '@rneui/base';

type CatagoryListType = {
  setSelectedCat: SetStateAction<any>;
  selectedCat: string;
};

const CatagoryList = ({setSelectedCat, selectedCat}: CatagoryListType) => {
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

  type catItemType = {
    isSelectedCat: boolean;
    item: {
      strCategoryThumb: string;
      strCategory: string;
    };
    index: number;
  };

  const CatItem = ({isSelectedCat, item, index}: catItemType) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedCat(item?.strCategory)}
        key={index}
        style={{
          backgroundColor: isSelectedCat
            ? APP_COLOR['Pizazz-500']
            : APP_COLOR['Gray-100'],
          paddingHorizontal: wp(2),
          paddingVertical: hp(0.8),
          width: wp(20),
          borderRadius: 8,
          rowGap: hp(0.8),
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        {item?.strCategory == 'Saved' ? (
          <Icon
          size={hp(4)}
            color={isSelectedCat ? APP_COLOR['Pizazz-50'] : APP_COLOR['Gray-400']}
            name="bookmark"
          />
        ) : (
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
        )}

        <Text
          numberOfLines={1}
          style={{
            color: isSelectedCat ? APP_COLOR.White : APP_COLOR['Gray-400'],
            fontSize: wp(3),
            fontWeight: '600',
          }}>
          {item?.strCategory}
        </Text>
      </TouchableOpacity>
    );
  };

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
          <CatItem
            key={-1}
            isSelectedCat={selectedCat == 'Saved'}
            item={{strCategory: 'Saved', strCategoryThumb: ''}}
            index={-1}
          />
          {cat.map((item: any, index: number) => {
            const isSelectedCat = item?.strCategory == selectedCat;
            return (
              <CatItem
                key={index}
                isSelectedCat={isSelectedCat}
                item={item}
                index={index}
              />
            );
          })}
        </>
      )}
    </ScrollView>
  );
};

export default CatagoryList;
