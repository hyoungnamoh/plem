import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddChartPage from 'pages/AddChartPage/AddChartPage';
import PlanChartListPage from 'pages/PlanChartListPage';
import { PlanChart } from 'types/chart';
import RepeatSettingPage from 'pages/RepeatSettingPage';
import SelectRepeatDatePage from 'pages/SelectRepeatDatePage';
import AddPlanPage from 'pages/AddPlanPage';
import PlanNotiSettingPage from 'pages/PlanNotiSettingPage';

export type PlanChartListTabStackParamList = {
  PlanChartListPage: undefined;
  AddChartPage?: { chart: PlanChart };
  RepeatSettingPage: undefined;
  SelectRepeatDatePage: undefined;
  AddPlanPage?: { planIndex?: number };
  PlanNotiSettingPage: undefined;
};

const Stack = createNativeStackNavigator<PlanChartListTabStackParamList>();

const PlanChartListTab = () => {
  return (
    <Stack.Navigator
      initialRouteName="PlanChartListPage"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="PlanChartListPage" component={PlanChartListPage} />
      <Stack.Screen name="AddChartPage" component={AddChartPage} />
      <Stack.Screen name="RepeatSettingPage" component={RepeatSettingPage} />
      <Stack.Screen name="SelectRepeatDatePage" component={SelectRepeatDatePage} />
      <Stack.Screen name="AddPlanPage" component={AddPlanPage} />
      <Stack.Screen name="PlanNotiSettingPage" component={PlanNotiSettingPage} />
    </Stack.Navigator>
  );
};

export default PlanChartListTab;
