import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useQuery, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { LoggedInTabParamList } from '../../AppInner';
import PlemText from '../components/Atoms/PlemText';
import { loggedInState } from '../states/loggedInState';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ApiResponse } from '../../types/axios';
import { getPlanChart, PlanChart } from '../api/plans/getPlanChart';

type MainPageProps = NativeStackScreenProps<LoggedInTabParamList, 'MainPage'>;

const underlineImage = require('../assets/images/underline.png');
const checkedImage = require('../assets/images/checked_black.png');
const uncheckedImage = require('../assets/images/unchecked_black.png');
const notificationImage = require('../assets/images/notification.png');

const testData = [
  {
    id: 1,
    startAt: dayjs('2022-12-18 00:00'),
    endAt: dayjs('2022-12-18 12:00'),
    name: '귀염둥이 생일파티',
    subPlans: [
      {
        id: 1,
        startAt: dayjs('2022-12-18 00:00'),
        endAt: dayjs('2022-12-18 06:00'),
        name: '축하댄스',
      },
      {
        id: 2,
        startAt: dayjs('2022-12-18 06:00'),
        endAt: dayjs('2022-12-18 12:00'),
        name: '댄스축하',
      },
    ],
  },
  {
    id: 2,
    startAt: dayjs('2022-12-18 12:00'),
    endAt: dayjs('2022-12-19 00:00'),
    name: '귀염둥이랑 데이트',
    subPlans: [
      {
        id: 3,
        startAt: dayjs('2022-12-18 12:00'),
        endAt: dayjs('2022-12-18 14:00'),
        name: '밥먹기',
      },
      {
        id: 4,
        startAt: dayjs('2022-12-18 14:00'),
        endAt: dayjs('2022-12-19 20:00'),
        name: '산책',
      },
      {
        id: 5,
        startAt: dayjs('2022-12-18 20:00'),
        endAt: dayjs('2022-12-19 00:00'),
        name: '드라이브',
      },
    ],
  },
];

const MainPage = ({ navigation }: MainPageProps) => {
  const queryClient = useQueryClient();
  const setLoggedIn = useSetRecoilState(loggedInState);

  const [checkedList, setCheckedList] = useState<number[]>([]);

  useEffect(() => {
    setAsyncStorageData();
  }, []);

  const removeJwt = async () => {
    try {
      await EncryptedStorage.removeItem('accessToken');
      queryClient.setQueryData('loginUser', { data: {} });
      setLoggedIn(false);
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

  const { isLoading, data, isError } = useQuery<ApiResponse<PlanChart>>('getPlanChart', () =>
    getPlanChart({ id: 284 })
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F1E8', paddingHorizontal: 15 }}>
      <View style={{ alignItems: 'center' }}>{/* <MainSVGFrame /> */}</View>
      <Pressable style={{ width: 200, height: 100, backgroundColor: 'aqua' }} onPress={removeJwt} />
      <View>
        <View style={styles.doItNowHeader}>
          <PlemText style={{ fontSize: 20 }}>Do it now</PlemText>
          <PlemText style={styles.currentTimesText}>10:00 - 12:00</PlemText>
        </View>
        <Image source={underlineImage} style={{ width: '100%', marginTop: 8 }} />
        <KeyboardAwareScrollView contentContainerStyle={styles.doItNowContent} contentInset={{ bottom: 80 }}>
          {testData.map((plan) => {
            return (
              <View key={`plan${plan.id}`}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <PlemText style={{}}>{plan.name}</PlemText>
                    <View style={{ backgroundColor: '#F4F1E8', flex: 1 }} />
                    <Image
                      source={require('../assets/images/yellow_line.png')}
                      style={{ width: '100%', position: 'absolute', zIndex: -1 }}
                    />
                  </View>
                  <Image source={notificationImage} />
                </View>
                {plan.subPlans.map((sub) => {
                  const isChecked = checkedList.includes(sub.id);
                  return (
                    <Pressable
                      key={`subPlan${sub.id}`}
                      style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}
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
  doItNowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentTimesText: {
    fontSize: 16,
  },
  doItNowContent: {},
});

export default MainPage;
