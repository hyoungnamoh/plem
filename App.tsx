import * as React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TextInput, TouchableHighlight, View } from 'react-native';
import { useCallback, useState } from 'react';
import TestSvg from './src/assets/images/Vector 671.svg';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  FindPassword: undefined;
};

export type LogggedInParamList = {
  Main: undefined;
  AddPlanChart: undefined;
  EditPlanChart: undefined;
  PlanChartList: undefined;
  AddPlan: undefined;
  EditPlan: undefined;
  SetLotation: undefined;
  SetNotification: undefined;
  Calendar: undefined;
  Settings: undefined;
  SetProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const App = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen name="SignIn" component={SignIn} options={{ title: '로그인' }} />
          <Tab.Screen name="SignUp" component={SignUp} options={{ title: '회원가입' }} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignIn} options={{ title: '로그인' }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ title: '회원가입' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
