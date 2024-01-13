import LoginPage from './src/pages/LoginPage';
import PasswordSettingPage from './src/pages/PasswordSettingPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';
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
import { useEffect } from 'react';
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
import { LoggedInUser } from './types/user';
import SplashScreen from 'react-native-splash-screen';
import { disableLoadingState } from './src/states/disableLoadingState';
import { LoggedInTabParamList, LoggedOutStackParamList } from './types/appInner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_CATEGORY_LIST, categoryListState } from './src/states/categoryListState';
import GuidePage from './src/pages/GuidePage/GuidePage';
import { lastAccessDateState } from './src/states/lastAccessDateState';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator<LoggedInTabParamList>();
const Stack = createNativeStackNavigator<LoggedOutStackParamList>();

function AppInner({ routeName }: { routeName: string }) {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const navigation = useNavigation<NavigationProp<LoggedOutStackParamList>>();

  const [lastAccessDate, setLastAccessDate] = useRecoilState(lastAccessDateState);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const setCategoryList = useSetRecoilState(categoryListState);
  const bottomSafeArea = useRecoilValue(bottomSafeAreaState);
  const disableLoading = useRecoilValue(disableLoadingState);

  useEffect(() => {
    preCheck();
    setScheduleCategoryList();
  }, []);

  const preCheck = async () => {
    await setLastAccessDateFromStorage();
    await loginCheck();
  };

  const loginCheck = async () => {
    // await EncryptedStorage.removeItem('accessToken');
    const token = await EncryptedStorage.getItem('accessToken');
    if (!token) {
      SplashScreen.hide();
      setLoggedInUser(null);
      return;
    }

    const user = jwt_decode<LoggedInUser>(token);
    setLoggedInUser(user);
    SplashScreen.hide();
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
    const lastAccess = await AsyncStorage.getItem('last_access');
    if (lastAccess) {
      setLastAccessDate(lastAccess);
      navigation.reset({ index: 0, routes: [{ name: 'IntroPage' }] });
    }
    // await AsyncStorage.removeItem('last_access');
  };

  const bottomTabVisibleList = ['MainPage', 'CalendarPage', 'PlanChartListPage', 'SettingPage'];
  console.log('isFetching, isMutating, !disableLoading', isFetching, isMutating, !disableLoading);
  return (
    <>
      {(isFetching || isMutating) && !disableLoading ? <Loading /> : null}
      <SafeAreaView style={{ flex: 0, backgroundColor: MAIN_COLOR }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: bottomSafeArea }}>
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
      </SafeAreaView>
    </>
  );
}

export default AppInner;
