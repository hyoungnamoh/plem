import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddSchedulePage from '../pages/AddSchedulePage';
import CalendarPage from '../pages/CalendarPage';
import ScheduleRepeatSettingPage from '../pages/ScheduleRepeatSettingPage';
import ScheduleNotiSettingPage from '../pages/ScheduleNotiSettingPage';
import RepeatCustomSettingPage from '../pages/RepeatCustomSettingPage';
import { Schedule } from '../../types/calendar';

export type CalendarTabStackParamList = {
  CalendarPage: undefined;
  AddSchedulePage?: { schedule?: Schedule };
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
