import LoginPage from './src/pages/LoginPage';
import PasswordSettingPage from './src/pages/PasswordSettingPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';
import IntroPage from './src/pages/IntroPage';
import { loggedInState } from './src/states/loggedInState';
import { useRecoilState } from 'recoil';
import { bottomSafeAreaState } from './src/states/bottomSafeAreaState';
import NicknameSettingPage from './src/pages/NicknameSettingPage';
import EmailVerifyIntroPage from './src/pages/EmailVerifyIntroPage';
import EmailVerifyPage from './src/pages/EmailVerifyPage';
import NotReceivedMailPage from './src/pages/NotReceivedMailPage';
import { UseMutationResult, useIsFetching, useIsMutating } from 'react-query';
import { ApiResponse } from './types/axios';
import { PostVerificationEmailParams, PostVerificationEmailResponse } from './src/api/auth/postVerificationEmailApi';
import { AxiosError } from 'axios';
import SignUpSuccessPage from './src/pages/SignUpSuccessPage';
import FindPasswordPage from './src/pages/FindPasswordPage';
import { useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import BottomTabBar from './src/components/BottomTabBar';
import MainTab from './src/tabs/MainTab';
import CalendarTab from './src/tabs/CalendarTab';
import PlanChartListTab from './src/tabs/PlanChartListTab';
import SettingTab from './src/tabs/SettingTab';
import { MAIN_COLOR } from './src/constants/color';
import Loading from './src/components/Loading';

export type LoggedInTabParamList = {
  MainTab: undefined;
  CalendarTab: undefined;
  PlanChartListTab: undefined;
  SettingTab: undefined;
};

export type LoggedOutStackParamList = {
  LoginPage: { from?: string } | undefined;
  PasswordSettingPage: { email: string };
  IntroPage: undefined;
  NicknameSettingPage: { email: string; password: string };
  EmailVerifyIntroPage: { email: string; password: string; nickname: string };
  EmailVerifyPage: undefined;
  // MainPage: undefined;
  NotReceivedMailPage: {
    usePostVerificationEmail: UseMutationResult<
      ApiResponse<PostVerificationEmailResponse>,
      AxiosError<unknown, any>,
      PostVerificationEmailParams,
      unknown
    >;
    email: string;
  };
  SignUpSuccessPage: {
    nickname: string;
  };
  FindPasswordPage: undefined;
};

const Tab = createBottomTabNavigator<LoggedInTabParamList>();
const Stack = createNativeStackNavigator<LoggedOutStackParamList>();

function AppInner({ routeName }: { routeName: string }) {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const [loggedIn, setLoggedIn] = useRecoilState(loggedInState);
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);

  useEffect(() => {
    loginCheck();
  }, []);

  const loginCheck = async () => {
    const token = await EncryptedStorage.getItem('accessToken');
    setLoggedIn(!!token);
  };

  const bottomTabVisibleList = ['MainPage', 'CalendarPage', 'PlanChartListPage', 'SettingPage'];

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: MAIN_COLOR }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: bottomSafeArea }}>
        {isFetching || isMutating ? <Loading /> : null}
        {loggedIn ? (
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
            initialRouteName="IntroPage"
            screenOptions={{
              headerShown: false,
            }}>
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
