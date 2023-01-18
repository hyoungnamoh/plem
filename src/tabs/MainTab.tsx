import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddPlan } from '../../types/chart';
import AddChartPage from '../pages/AddChartPage';
import AddPlanPage from '../pages/AddPlanPage';
import MainPage from '../pages/MainPage';
import RepeatSettingPage from '../pages/RepeatSettingPage';
import SelectRepeatDatePage from '../pages/SelectRepeatDatePage';
import SetPlanNotificationPage from '../pages/SetPlanNotificationPage';

export type MainTabStackParamList = {
  MainPage: undefined;
  AddChartPage: undefined;
  RepeatSettingPage: undefined;
  SelectRepeatDatePage: undefined;
  AddPlanPage: { planIndex?: number } | undefined;
  SetPlanNotificationPage: undefined;
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
      <Stack.Screen name="SelectRepeatDatePage" component={SelectRepeatDatePage} />
      <Stack.Screen name="AddPlanPage" component={AddPlanPage} />
      <Stack.Screen name="SetPlanNotificationPage" component={SetPlanNotificationPage} />
    </Stack.Navigator>
  );
};

export default MainTab;
