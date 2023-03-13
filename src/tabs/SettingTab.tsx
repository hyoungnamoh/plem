import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountSettingPage from '../pages/AccountSettingPage';
import AddChartPage from '../pages/AddChartPage';
import CustommerSupportPage from '../pages/CustommerSupportPage';
import ModifyEmailPage from '../pages/ModifyEmailPage';
import ModifyNickNamePage from '../pages/ModifyNickNamePage';
import ModifyPasswordPage from '../pages/ModifyPasswordPage';
import NoticeListPage from '../pages/NoticeListPage';
import NotificationSettingPage from '../pages/NotificationSettingPage';
import SettingPage from '../pages/SettingPage';

export type SettingTabStackParamList = {
  SettingPage: undefined;
  AccountSettingPage: undefined;
  NotificationSettingPage: undefined;
  NoticeListPage: undefined;
  CustommerSupportPage: undefined;
  ModifyNickNamePage: undefined;
  ModifyEmailPage: undefined;
  ModifyPasswordPage: undefined;
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
      <Stack.Screen name="AccountSettingPage" component={AccountSettingPage} />
      <Stack.Screen name="NotificationSettingPage" component={NotificationSettingPage} />
      <Stack.Screen name="NoticeListPage" component={NoticeListPage} />
      <Stack.Screen name="CustommerSupportPage" component={CustommerSupportPage} />
      <Stack.Screen name="ModifyNickNamePage" component={ModifyNickNamePage} />
      <Stack.Screen name="ModifyEmailPage" component={ModifyEmailPage} />
      <Stack.Screen name="ModifyPasswordPage" component={ModifyPasswordPage} />
    </Stack.Navigator>
  );
};

export default SettingTab;
