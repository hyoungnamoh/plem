import LoginPage from './src/pages/LoginPage';
import PasswordSettingPage from './src/pages/PasswordSettingPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPage from './src/pages/MainPage';
import { SafeAreaView } from 'react-native';
import IntroPage from './src/pages/IntroPage';
import { loggedInState } from './src/states/loggedInState';
import { useRecoilState } from 'recoil';
import { bottomSafeAreaState } from './src/states/bottomSafeAreaState';
import NicknameSettingPage from './src/pages/NicknameSettingPage';
import EmailVerifyIntroPage from './src/pages/EmailVerifyIntroPage';
import EmailVerifyPage from './src/pages/EmailVerifyPage';
import NotReceivedMailPage from './src/pages/NotReceivedMailPage';
import { UseMutationResult } from 'react-query';
import { ApiResponse } from './types/axios';
import { PostVerificationEmailParams, PostVerificationEmailResponse } from './src/api/auth/postVerificationEmail';
import { AxiosError } from 'axios';

export type LoggedInStackParamList = {
  MainPage: undefined;
};

export type LoggedOutStackParamList = {
  LoginPage: undefined;
  PasswordSettingPage: { email: string };
  IntroPage: undefined;
  NicknameSettingPage: { email: string; password: string };
  EmailVerifyIntroPage: { email: string; password: string; nickname: string };
  EmailVerifyPage: undefined;
  MainPage: undefined;
  NotReceivedMailPage: {
    usePostVerificationEmail: UseMutationResult<
      ApiResponse<PostVerificationEmailResponse>,
      AxiosError<unknown, any>,
      PostVerificationEmailParams,
      unknown
    >;
    email: string;
  };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<LoggedOutStackParamList>();

function AppInner({ routeName }: { routeName: string }) {
  // const { isLoading, data, isError } = useQuery<SuccessResponse<LoginUser>>('loginUser', getLoginUserApi);
  const [loggedIn, setLoggedIn] = useRecoilState(loggedInState);
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#F4F1E8' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: bottomSafeArea }}>
        {loggedIn ? (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="MainPage" component={MainPage} />
          </Stack.Navigator>
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
          </Stack.Navigator>
        )}
      </SafeAreaView>
    </>
  );
}

export default AppInner;
