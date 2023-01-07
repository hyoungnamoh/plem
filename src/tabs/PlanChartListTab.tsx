import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddChartPage from '../pages/AddChartPage';
import PlanChartListPage from '../pages/PlanChartListPage';

export type PlanChartListTabStackParamList = {
  PlanChartListPage: undefined;
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
    </Stack.Navigator>
  );
};

export default PlanChartListTab;
