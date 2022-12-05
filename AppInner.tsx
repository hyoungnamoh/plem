import LoginPage from './src/pages/LoginPage';
import SignUpPage from './src/pages/SignUpPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useQuery } from 'react-query';
import { getLoginUserApi, LoginUser } from './src/api/users/getLoginUserApi';
import MainPage from './src/pages/MainPage';
import { SuccessResponse } from './types/axios';
import { Alert, Button, Image, Pressable, SafeAreaView } from 'react-native';
import { NavigationContainerRefWithCurrent, useNavigationState, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import IntroPage from './src/pages/IntroPage';
import { loggedInState } from './src/states/loggedInState';
import { useRecoilState } from 'recoil';
import { bottomSafeAreaState } from './src/states/bottomSafeAreaState';
import NicknameSettingPage from './src/pages/NicknameSettingPage';
import EmailVerifyIntroPage from './src/pages/EmailVerifyIntroPage';
import EmailVerifyPage from './src/pages/EmailVerifyPage';

export type LoggedInStackParamList = {
  MainPage: undefined;
};

export type LoggedOutStackParamList = {
  LoginPage: undefined;
  SignUpPage: undefined;
  IntroPage: undefined;
  NicknameSettingPage: { email: string; password: string };
  EmailVerifyIntroPage: { email: string; password: string; nickname: string };
  EmailVerifyPage: { email: string; password: string; nickname: string };
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
            <Stack.Screen name="SignUpPage" component={SignUpPage} />
            <Stack.Screen name="NicknameSettingPage" component={NicknameSettingPage} />
            <Stack.Screen name="EmailVerifyIntroPage" component={EmailVerifyIntroPage} />
            <Stack.Screen name="EmailVerifyPage" component={EmailVerifyPage} />
          </Stack.Navigator>
        )}
      </SafeAreaView>
    </>
  );
}

export default AppInner;
