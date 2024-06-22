import LoginPage from './src/pages/LoginPage';
import PasswordSettingPage from './src/pages/PasswordSettingPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, AppState, AppStateStatus, Keyboard, Linking, SafeAreaView, View } from 'react-native';
import IntroPage from './src/pages/IntroPage';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { bottomSafeAreaState } from './src/states/bottomSafeAreaState';
import NicknameSettingPage from './src/pages/NicknameSettingPage';
import EmailVerifyIntroPage from './src/pages/EmailVerifyIntroPage';
import EmailVerifyPage from './src/pages/EmailVerifyPage';
import NotReceivedMailPage from './src/pages/NotReceivedMailPage';
import { useIsFetching, useIsMutating } from 'react-query';
import SignUpSuccessPage from './src/pages/SignUpSuccessPage';
import FindPasswordPage from './src/pages/FindPasswordPage';
import { useEffect, useRef } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import BottomTabBar from './src/components/BottomTabBar';
import MainTab from './src/tabs/MainTab';
import CalendarTab from './src/tabs/CalendarTab';
import PlanChartListTab from './src/tabs/PlanChartListTab';
import SettingTab from './src/tabs/SettingTab';
import { MAIN_COLOR } from './src/constants/colors';
import Loading from './src/components/Loading';
import jwt_decode from 'jwt-decode';
import { loggedInUserState } from './src/states/loggedInUserState';
import { LoggedInUser } from './src/types/user';
import { disableLoadingState } from './src/states/disableLoadingState';
import { LoggedInTabParamList, LoggedOutStackParamList } from './src/types/appInner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_CATEGORY_LIST, categoryListState } from './src/states/categoryListState';
import { lastAccessDateState } from './src/states/lastAccessDateState';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { configureNotification } from './src/utils/configureNotification';
import { appInfoState } from 'states/appInfoState';
import { getAppVersion } from 'helper/getAppVersion';
import SplashScreen from 'react-native-splash-screen';
import { checkNotifications } from 'react-native-permissions';
import { notificationInfoState } from 'states/notificationInfoState';
import { useCodePush } from 'hooks/useCodePush';
import CodePushUpdating from 'components/CodePushUpdating';
import Toast from '@hyoungnamoh/react-native-easy-toast';
import PlemToast from 'components/PlemToast';
import { globalToastState } from 'states/globalToastState';
import { useScheduleConfirmDate } from 'hooks/useScheduleConfirmDate';
import { keyboardHeightState } from 'states/keyboardHeightState';
import { bottomNochHeightState } from 'states/bottomNochHeightState';
import { checkNeedUpdate } from 'helper/checkNeedUpdate';
import { getStorageNotificationInfo } from 'utils/getStorageNotificationInfo';
import { currentTimeDegreeState } from 'states/currentTimeDegreeState';
import dayjs from 'dayjs';
import { DAY_TO_MS } from 'constants/times';
import GuidePage from 'pages/GuidePage/GuidePage';
import SharedDefaults from 'widgets/SharedDefaults';

configureNotification();

const Tab = createBottomTabNavigator<LoggedInTabParamList>();
const Stack = createNativeStackNavigator<LoggedOutStackParamList>();

function AppInner({ routeName }: { routeName: string }) {
  const {
    checkCodePush,
    needAppVersionUpdate,
    setNeedAppVersionUpdate,
    isCodePushUpdating,
    syncDownloadProgress,
    syncStateMessage,
  } = useCodePush();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const navigation = useNavigation<NavigationProp<LoggedOutStackParamList>>();

  const [lastAccessDate, setLastAccessDate] = useRecoilState(lastAccessDateState);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const setKeyboardHeight = useSetRecoilState(keyboardHeightState);
  const setBottomNochHeight = useSetRecoilState(bottomNochHeightState);
  const setNotificationInfo = useSetRecoilState(notificationInfoState);
  const [appInfo, setAppInfo] = useRecoilState(appInfoState);
  const [globalToast, setGlobalToast] = useRecoilState(globalToastState);
  const setCurrentTimeDegree = useSetRecoilState(currentTimeDegreeState);
  const setCategoryList = useSetRecoilState(categoryListState);
  const bottomSafeArea = useRecoilValue(bottomSafeAreaState);
  const disableLoading = useRecoilValue(disableLoadingState);

  const { initSchedulConfirmDate } = useScheduleConfirmDate();

  const appState = useRef(AppState.currentState);
  const globalToastRef = useRef<Toast>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });

    splashScreenHandler([
      setLastAccessDateFromStorage(),
      loginCheck(),
      setScheduleCategoryList(),
      getNotificationInfo(),
      initSchedulConfirmDate(),
    ]);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (globalToast) {
      globalToastRef.current?.show(globalToast.text, globalToast.duration, globalToast.callback);
    }
  }, [globalToast]);

  useEffect(() => {
    const appStateChange = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      appStateChange.remove();
    };
  }, [needAppVersionUpdate, appInfo.storeUrl]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // 포어그라운드 진입
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      setCurrentTimeDegree((dayjs().diff(dayjs().startOf('date')) / DAY_TO_MS) * 360);
    }
    // 백그라운드로 이동
    if (
      needAppVersionUpdate &&
      appInfo.storeUrl &&
      appState.current.match(/inactive|active/) &&
      nextAppState === 'background' &&
      !__DEV__
    ) {
      showUpdateAlert(appInfo.storeUrl);
    }
    appState.current = nextAppState;
  };

  const showUpdateAlert = (storeUrl: string) => {
    Alert.alert('업데이트 알림', '새로운 버전이 있습니다. 업데이트를 진행해주세요.', [
      {
        text: '업데이트',
        onPress: () => {
          Linking.openURL(storeUrl);
        },
      },
    ]);
  };

  const splashScreenHandler = async (preCheckList: Promise<void>[]) => {
    const startTime = Date.now();
    await Promise.all(preCheckList);
    const info = await getAppInfo();
    const endTime = Date.now();
    const delayTime = 1000 - (endTime - startTime);
    if (delayTime > 0) {
      setTimeout(() => {
        SplashScreen.hide();
      }, delayTime);
    } else {
      SplashScreen.hide();
    }

    if (!__DEV__) {
      const updateInfo = await checkNeedUpdate(info);
      if (updateInfo?.isNeeded) {
        setNeedAppVersionUpdate(true);
        showUpdateAlert(info.storeUrl);
      } else {
        setNeedAppVersionUpdate(false);
        checkCodePush();
      }
    }
  };

  const getNotificationInfo = async () => {
    const { status, settings } = await checkNotifications();
    const storageNotifiactionInfo = await getStorageNotificationInfo();
    if (status === 'granted') {
      if (storageNotifiactionInfo) {
        setNotificationInfo({ notice: storageNotifiactionInfo.notice, plan: storageNotifiactionInfo.plan });
      } else {
        setNotificationInfo({ notice: true, plan: true });
      }
    } else {
      setNotificationInfo({ notice: false, plan: false });
    }
  };

  const getAppInfo = async () => {
    if (__DEV__) {
      const storeUrl = 'https://apps.apple.com/kr/app/plem/id6476144783';
      setAppInfo({ currentVersion: '1.0.29', latestVersion: '', storeUrl });
      return { currentVersion: '1.0.29', latestVersion: '', storeUrl };
    }
    const appVersion = await getAppVersion();
    const storeUrl = 'https://apps.apple.com/kr/app/plem/id6476144783';

    const info = { ...appVersion, storeUrl };
    setAppInfo(info);

    return info;
  };

  const loginCheck = async () => {
    // await EncryptedStorage.removeItem('accessToken');
    const token = await EncryptedStorage.getItem('accessToken');
    console.info('jwt', token);

    if (!token) {
      setLoggedInUser(null);
      SharedDefaults.setTokenBridge(null);
      SharedDefaults.updateDoItNowBridge();
      return;
    }

    const user = jwt_decode<LoggedInUser>(token);
    SharedDefaults.setTokenBridge(token);
    SharedDefaults.updateDoItNowBridge();
    setLoggedInUser(user);
  };

  const setScheduleCategoryList = async () => {
    const storageCategoryList = await AsyncStorage.getItem('storageCategoryList');
    // await AsyncStorage.removeItem('storageCategoryList');
    if (storageCategoryList) {
      setCategoryList(JSON.parse(storageCategoryList));
    } else {
      await AsyncStorage.setItem('storageCategoryList', JSON.stringify(DEFAULT_CATEGORY_LIST));
    }
  };

  const setLastAccessDateFromStorage = async () => {
    const lastAccess = await AsyncStorage.getItem('lastAccess');

    if (lastAccess) {
      setLastAccessDate(lastAccess);
      navigation.reset({ index: 0, routes: [{ name: 'IntroPage' }] });
    }
  };

  const bottomTabVisibleList = ['MainPage', 'CalendarPage', 'PlanChartListPage', 'SettingPage'];
  const apiLoading = (isFetching || isMutating) && !disableLoading;
  console.info('isFetching, isMutating, !disableLoading', isFetching, isMutating, !disableLoading);

  return (
    <>
      {isCodePushUpdating && <CodePushUpdating progress={syncDownloadProgress} syncStateMessage={syncStateMessage} />}
      {apiLoading && !isCodePushUpdating ? <Loading /> : null}
      <PlemToast ref={globalToastRef} />
      <SafeAreaView style={{ flex: 0, backgroundColor: MAIN_COLOR }} />
      <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
        {loggedInUser?.id ? (
          <Tab.Navigator
            tabBar={bottomTabVisibleList.includes(routeName) ? (props) => <BottomTabBar {...props} /> : () => <></>}>
            <Tab.Screen
              name="MainTab"
              component={MainTab}
              options={{
                headerShown: false,
              }}
            />
            <Tab.Screen
              name="CalendarTab"
              component={CalendarTab}
              options={{
                headerShown: false,
              }}
            />
            <Tab.Screen
              name="PlanChartListTab"
              component={PlanChartListTab}
              options={{
                headerShown: false,
                // unmountOnBlur: true,
              }}
            />
            <Tab.Screen
              name="SettingTab"
              component={SettingTab}
              options={{
                headerShown: false,
              }}
            />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator
            initialRouteName={lastAccessDate ? 'IntroPage' : 'GuidePage'}
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="GuidePage" component={GuidePage} />
            <Stack.Screen name="IntroPage" component={IntroPage} />
            <Stack.Screen name="LoginPage" component={LoginPage} />
            <Stack.Screen name="PasswordSettingPage" component={PasswordSettingPage} />
            <Stack.Screen name="NicknameSettingPage" component={NicknameSettingPage} />
            <Stack.Screen name="EmailVerifyIntroPage" component={EmailVerifyIntroPage} />
            <Stack.Screen name="EmailVerifyPage" component={EmailVerifyPage} />
            <Stack.Screen name="NotReceivedMailPage" component={NotReceivedMailPage} />
            <Stack.Screen name="SignUpSuccessPage" component={SignUpSuccessPage} />
            <Stack.Screen name="FindPasswordPage" component={FindPasswordPage} />
          </Stack.Navigator>
        )}
      </View>
      <SafeAreaView
        onLayout={(e) => setBottomNochHeight(e.nativeEvent.layout.height)}
        style={{ flex: 0, backgroundColor: bottomSafeArea }}
      />
    </>
  );
}

export default AppInner;
