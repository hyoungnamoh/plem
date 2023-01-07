import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddChartPage from '../pages/AddChartPage';
import MainPage from '../pages/MainPage';
import RepeatSettingPage from '../pages/RepeatSettingPage';

export type MainTabStackParamList = {
  MainPage: undefined;
  AddChartPage: undefined;
  RepeatSettingPage: undefined;
  // PasswordSettingPage: { email: string };
};

const Stack = createNativeStackNavigator<MainTabStackParamList>();

const MainTab = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainPage"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MainPage" component={MainPage} />
      <Stack.Screen name="AddChartPage" component={AddChartPage} />
      <Stack.Screen name="RepeatSettingPage" component={RepeatSettingPage} />
    </Stack.Navigator>
  );
};

export default MainTab;
