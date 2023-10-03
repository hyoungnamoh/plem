import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useQuery, useQueryClient } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { LoggedInTabParamList } from '../../AppInner';
import PlemText from '../components/Atoms/PlemText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ApiResponse } from '../../types/axios';
import { getPlanChart } from '../api/charts/getPlanChartApi';
import { MainTabStackParamList } from '../tabs/MainTab';
import { PlanChart } from '../../types/chart';
import { MAIN_COLOR } from '../constants/colors';
import MainSVGFrame from '../components/MainSVGFrame';
import { loggedInUserState } from '../states/loggedInUserState';
import { useFocusEffect } from '@react-navigation/native';
import { bottomSafeAreaState } from '../states/bottomSafeAreaState';

type MainPageProps = NativeStackScreenProps<MainTabStackParamList, 'MainPage'>;

const underlineImage = require('../assets/images/underline.png');
const checkedImage = require('../assets/images/checked_black.png');
const uncheckedImage = require('../assets/images/unchecked_black.png');
const notificationOnImage = require('../assets/images/notification_on.png');
const notificationOffImage = require('../assets/images/notification_off.png');
const yellowLineImage = require('../assets/images/yellow_line.png');
const mainTitleLogoImage = require('../assets/images/main_title_logo.png');
const addChartImage = require('../assets/images/plus.png');

const MainPage = ({ navigation }: MainPageProps) => {
  const queryClient = useQueryClient();
  const setLoggedInUser = useSetRecoilState(loggedInUserState);
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);

  const [checkedList, setCheckedList] = useState<number[]>([]);

  useEffect(() => {
    setAsyncStorageData();
  }, []);

  useFocusEffect(() => {
    if (bottomSafeArea === MAIN_COLOR) {
      return;
    }
    setBottomSafeArea(MAIN_COLOR);
  });

  const removeJwt = async () => {
    try {
      setLoggedInUser(null);
      await EncryptedStorage.removeItem('accessToken');
      queryClient.setQueryData('loginUser', { data: {} });
    } catch (error) {
      console.info(error);
    }
    Alert.alert('remove token');
  };

  const setAsyncStorageData = async () => {
    const item = await AsyncStorage.getItem('plan_checked_list');
    const checkedList = item ? JSON.parse(item) : [];
    setCheckedList(checkedList);
  };

  const onPressSubPlanRow = async (id: number) => {
    const asyncStorageItem = await AsyncStorage.getItem('plan_checked_list');
    const checkedList: number[] = asyncStorageItem ? JSON.parse(asyncStorageItem) : [];
    const idIndex = checkedList.findIndex((e) => e === id);
    // const isChecked = checkedList.includes(id);

    if (idIndex < 0) {
      checkedList.push(id);
    } else {
      checkedList.splice(idIndex, 1);
    }

    setCheckedList(checkedList);
    await AsyncStorage.setItem('plan_checked_list', JSON.stringify(checkedList));
  };

  const onPressAddChart = () => {
    navigation.navigate('AddChartPage');
  };

  const {
    isLoading,
    data: planChartData,
    isError,
  } = useQuery<ApiResponse<PlanChart>>('getPlanChart', () => getPlanChart({ id: 285 }));
  return (
    <View style={styles.page}>
      <View style={styles.mainHeader}>
        <Pressable>
          <Image source={mainTitleLogoImage} />
        </Pressable>
        <Pressable onPress={onPressAddChart}>
          <Image source={addChartImage} />
        </Pressable>
      </View>
      <View style={styles.chartWrap}>
        <MainSVGFrame />
      </View>
      {/* <Pressable style={{ width: 200, height: 100, backgroundColor: 'aqua' }} onPress={removeJwt} /> */}
      <View>
        <View style={styles.doItNowHeader}>
          <PlemText style={{ fontSize: 20 }}>Do it now</PlemText>
          <PlemText style={styles.currentTimesText}>10:00 - 12:00</PlemText>
        </View>
        <Image source={underlineImage} style={styles.doItNowUnderline} />
        <KeyboardAwareScrollView contentContainerStyle={styles.doItNowContent} contentInset={{ bottom: 80 }}>
          {/* {planChartData?.data.plans.map((plan) => { */}
          {planChartData?.data.plans?.map((plan) => {
            return (
              <View key={`plan${plan.id}`}>
                <View style={styles.planWrap}>
                  <View style={styles.yellowLineText}>
                    <PlemText>{plan.name}</PlemText>
                    <Image source={yellowLineImage} style={styles.yellowLine} />
                  </View>
                  <Image source={plan.notification ? notificationOnImage : notificationOffImage} />
                </View>
                {plan.subPlans.map((sub) => {
                  const isChecked = checkedList.includes(sub.id);
                  return (
                    <Pressable
                      key={`subPlan${sub.id}`}
                      style={styles.subPlan}
                      onPress={() => onPressSubPlanRow(sub.id)}>
                      <Image source={isChecked ? checkedImage : uncheckedImage} />
                      <PlemText style={{ marginLeft: 4 }}>{sub.name}</PlemText>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
    paddingHorizontal: 15,
  },
  chartWrap: {
    alignItems: 'center',
  },
  doItNowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doItNowUnderline: { width: '100%', marginTop: 8 },
  currentTimesText: {
    fontSize: 16,
  },
  doItNowContent: {},
  planWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yellowLineText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yellowLine: {
    width: '100%',
    position: 'absolute',
    zIndex: -1,
  },
  subPlan: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  mainHeader: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default MainPage;
