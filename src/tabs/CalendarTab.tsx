import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddCalendarPage from '../pages/AddCalendarPage';
import AddChartPage from '../pages/AddChartPage';
import CalendarPage from '../pages/CalendarPage';
import MainPage from '../pages/MainPage';

export type CalendarTabStackParamList = {
  CalendarPage: undefined;
  AddCalendarPage: undefined;
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
      <Stack.Screen name="AddCalendarPage" component={AddCalendarPage} />
    </Stack.Navigator>
  );
};

export default CalendarTab;
