import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import {useDebounce} from '../hooks/useDebounce';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigation';

const Homescreen = () => {
  const [selectedCat, setSelectedCat] = useState('Beef');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

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
    const loadSymptom = async () => {
      try {
        setLoadingResults(true);
        if (searchText.length > 0) {
          const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
          console.log(url);
          const result = await axios.get(url);
          setSearchResults(result?.data?.meals);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingResults(false);
      }
    };
    loadSymptom();
  }, [debouncedSearch]);

  useEffect(() => {
    fetchByCatagory(selectedCat);
  }, [selectedCat]);

  const textInputRef = useRef<TextInput>(null);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardOpen(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardOpen(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const callbackLottie = useCallback(() => {
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
  }, []);

  type DetailsScreenProps = StackNavigationProp<RootStackParamList, 'Details'>;
  const navigation = useNavigation<DetailsScreenProps>();

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
            ref={textInputRef}
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchinput}
            placeholderTextColor={APP_COLOR['Gray-400']}
            placeholder="Search for recipes"
          />
          <Icon size={wp(6)} name="search" color={APP_COLOR?.['Gray-400']} />
        </View>
        {/* Search Results */}
        {textInputRef?.current?.isFocused() &&
          isKeyboardOpen &&
          searchText?.length > 0 && (
            <>
              {loadingResults ? (
                <ActivityIndicator color={APP_COLOR?.['Pizazz-500']} />
              ) : (
                <FlatList
                  keyboardShouldPersistTaps="always"
                  data={searchResults}
                  fadingEdgeLength={hp(3)}
                  ListEmptyComponent={() => (
                    <Text
                      style={{
                        color: APP_COLOR['Slate-400'],
                        fontSize: wp(4),
                        textAlign: 'center',
                      }}>
                      No Recipe found
                    </Text>
                  )}
                  style={{maxHeight: hp(20)}}
                  renderItem={({item, index}: {item: Meal; index: number}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Details', {
                            id: item?.idMeal,
                          });
                        }}
                        style={{
                          paddingVertical: hp(1),
                          paddingHorizontal: wp(3),
                          backgroundColor: APP_COLOR['Gray-100'],
                          marginBottom: hp(1),
                          borderRadius: 10,
                          flexDirection: 'row',
                          columnGap: wp(2),
                          alignItems: 'center',
                        }}>
                        <Image
                          style={{
                            height: wp(10),
                            width: wp(10),
                            borderRadius: 6,
                          }}
                          source={{uri: item?.strMealThumb}}
                        />
                        <Text
                          style={{
                            color: APP_COLOR['Slate-500'],
                            fontSize: wp(3.5),
                            fontWeight: '500',
                          }}>
                          {item.strMeal}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </>
          )}

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
          ListEmptyComponent={callbackLottie}
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
    color: APP_COLOR?.['Slate-900'],
    paddingVertical: hp(1.3),
    fontSize: wp(3.3),
    flex: 1,
  },
});

export default Homescreen;
