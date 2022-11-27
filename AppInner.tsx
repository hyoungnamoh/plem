import LoginPage from './src/pages/LoginPage';
import SignUpPage from './src/pages/SignUpPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useQuery } from 'react-query';
import { getLoginUserApi, LoginUser } from './src/api/users/getLoginUserApi';
import MainPage from './src/pages/MainPage';
import { SuccessResponse } from './types/axios';
import PageHeader from './src/components/PageHeader';
import { Alert, Button, Image, Pressable, SafeAreaView } from 'react-native';
import { NavigationContainerRefWithCurrent, useNavigationState, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import IntroPage from './src/pages/IntroPage';
import { loggedInState } from './src/states/loggedInState';
import { useRecoilState } from 'recoil';
import { bottomSafeAreaState } from './src/states/bottomSafeAreaState';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: { orderId: string };
};
export type RootStackParamList = {
  IntroPage: undefined;
  LoginPage: undefined;
  SignUpPage: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner({ routeName }: { routeName: string }) {
  const { isLoading, data, isError } = useQuery<SuccessResponse<LoginUser>>('loginUser', getLoginUserApi);
  const [loggedIn, setLoggedIn] = useRecoilState(loggedInState);
  const [bottomSafeArea, setbBottomSafeArea] = useRecoilState(bottomSafeAreaState);
  const isLoginPage = routeName === 'LoginPage';
  return (
    <>
      {bottomSafeArea === '#000' && <SafeAreaView style={{ flex: 0, backgroundColor: '#F4F1E8' }} />}
      <SafeAreaView style={{ flex: 1, backgroundColor: bottomSafeArea }}>
        {data?.data.email ? (
          <Tab.Navigator>
            <Tab.Screen name="MainPage" component={MainPage} />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator
            initialRouteName="IntroPage"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="IntroPage" component={IntroPage} />
            <Stack.Screen name="LoginPage" component={LoginPage} />
            <Stack.Screen name="SignUpPage" component={SignUpPage} />
          </Stack.Navigator>
        )}
      </SafeAreaView>
    </>
  );
}

export default AppInner;
