import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddChartPage from '../pages/AddChartPage';
import SettingPage from '../pages/SettingPage';

export type SettingTabStackParamList = {
  SettingPage: undefined;
};

const Stack = createNativeStackNavigator<SettingTabStackParamList>();

const SettingTab = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingPage"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SettingPage" component={SettingPage} />
    </Stack.Navigator>
  );
};

export default SettingTab;
