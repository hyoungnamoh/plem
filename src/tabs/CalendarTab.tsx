import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddSchedulePage from '../pages/AddSchedulePage';
import AddChartPage from '../pages/AddChartPage';
import CalendarPage from '../pages/CalendarPage';
import MainPage from '../pages/MainPage';
import ScheduleRepeatSettingPage from '../pages/ScheduleRepeatSettingPage';
import ScheduleNotiSettingPage from '../pages/ScheduleNotiSettingPage';
import RepeatCustomSettingPage from '../pages/RepeatCustomSettingPage';

export type CalendarTabStackParamList = {
  CalendarPage: undefined;
  AddSchedulePage: undefined;
  ScheduleNotiSettingPage: undefined;
  ScheduleRepeatSettingPage: undefined;
  RepeatCustomSettingPage: undefined;
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
      <Stack.Screen name="AddSchedulePage" component={AddSchedulePage} />
      <Stack.Screen name="ScheduleNotiSettingPage" component={ScheduleNotiSettingPage} />
      <Stack.Screen name="ScheduleRepeatSettingPage" component={ScheduleRepeatSettingPage} />
      <Stack.Screen name="RepeatCustomSettingPage" component={RepeatCustomSettingPage} />
    </Stack.Navigator>
  );
};

export default CalendarTab;
