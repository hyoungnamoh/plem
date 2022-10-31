import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useQuery } from 'react-query';
import { getLoginUserApi, LoginUser } from './src/api/users/getLoginUserApi';
import Main from './src/pages/Main';
import { SuccessResponse } from './types/axios';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: { orderId: string };
};
export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const { isLoading, data, isError } = useQuery<SuccessResponse<LoginUser>>('loginUser', getLoginUserApi);

  return data?.data.email ? (
    <Tab.Navigator>
      <Tab.Screen name="Main" component={Main} options={{ title: '메인페이지' }} />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignIn} options={{ title: '로그인' }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ title: '회원가입' }} />
    </Stack.Navigator>
  );
}

export default AppInner;
