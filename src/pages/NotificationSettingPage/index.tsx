import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../../components/Header';
import SwitchInputRow from '../../components/SwitchInputRow';
import { MAIN_COLOR } from '../../constants/colors';
import { SettingTabStackParamList } from '../../tabs/SettingTab';

type NotificationSettingPageProps = NativeStackScreenProps<SettingTabStackParamList, 'NotificationSettingPage'>;

const NotificationSettingPage = ({ navigation }: NotificationSettingPageProps) => {
  const [scheduleNoti, setScheduleNoti] = useState(false);
  const [noticeNoti, setNoticeNoti] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <Header title="알림" />
      <View style={styles.content}>
        <View style={{ marginTop: 20 }}>
          <SwitchInputRow label={'하루 종일'} value={scheduleNoti} onPress={() => setScheduleNoti(!scheduleNoti)} />
        </View>
        <View style={{ marginTop: 32 }}>
          <SwitchInputRow label={'공지사항 알림'} value={noticeNoti} onPress={() => setNoticeNoti(!noticeNoti)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
  },
  content: {
    paddingHorizontal: 15,
  },
});

export default NotificationSettingPage;
