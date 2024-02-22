import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlanChart } from 'types/chart';
import AddChartPage from 'pages/AddChartPage/AddChartPage';
import AddPlanPage from 'pages/AddPlanPage';
import MainPage from 'pages/MainPage';
import RepeatSettingPage from 'pages/RepeatSettingPage';
import SelectRepeatDatePage from 'pages/SelectRepeatDatePage';
import PlanNotiSettingPage from 'pages/PlanNotiSettingPage';
import PlanChartListPage from 'pages/PlanChartListPage';

export type MainTabStackParamList = {
  MainPage: undefined;
  AddChartPage?: { chart: PlanChart | null };
  RepeatSettingPage: undefined;
  SelectRepeatDatePage: undefined;
  AddPlanPage?: { planIndex?: number };
  PlanNotiSettingPage: undefined;
  PlanChartListPage: undefined;
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
      <Stack.Screen name="PlanNotiSettingPage" component={PlanNotiSettingPage} />
      <Stack.Screen name="PlanChartListPage" component={PlanChartListPage} />
    </Stack.Navigator>
  );
};

export default MainTab;
