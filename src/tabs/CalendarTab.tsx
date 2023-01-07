import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddChartPage from '../pages/AddChartPage';
import CalendarPage from '../pages/CalendarPage';
import MainPage from '../pages/MainPage';

export type CalendarTabStackParamList = {
  CalendarPage: undefined;
  // PasswordSettingPage: { email: string };
};

const Stack = createNativeStackNavigator<CalendarTabStackParamList>();

const CalendarTab = () => {
  return (
    <Stack.Navigator
      initialRouteName="CalendarPage"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CalendarPage" component={CalendarPage} />
    </Stack.Navigator>
  );
};

export default CalendarTab;
