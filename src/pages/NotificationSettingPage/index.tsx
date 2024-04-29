import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import Header from 'components/Header';
import SwitchInputRow from 'components/SwitchInputRow';
import { MAIN_COLOR } from 'constants/colors';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { NotificationInfo, notificationInfoState } from 'states/notificationInfoState';
import { checkNotifications } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUpdatePlanNotification } from 'hooks/mutations/useUpdatePlanNotification';
import { disableLoadingState } from 'states/disableLoadingState';
import { useUpdateNoticeNotification } from 'hooks/mutations/useUpdateNoticeNotification';

type NotificationSettingPageProps = NativeStackScreenProps<SettingTabStackParamList, 'NotificationSettingPage'>;

const NotificationSettingPage = ({ navigation }: NotificationSettingPageProps) => {
  const [notificationInfo, setNotificationInfo] = useRecoilState(notificationInfoState);
  const setDisableLoading = useSetRecoilState(disableLoadingState);
  const { mutate: updatePlanNotification } = useUpdatePlanNotification({});
  const { mutate: updateNoticeNotification } = useUpdateNoticeNotification({});

  const handlePlanNotification = async (value: boolean) => {
    const { status } = await checkNotifications();

    if (status !== 'granted' && !notificationInfo.plan) {
      confirmSetNoficiation();
      return;
    }

    const originNoficiationInfo = { ...notificationInfo, plan: !value };
    const newNotificationInfo = { ...notificationInfo, plan: value };
    setDisableLoading(true);
    setNotificationInfo(newNotificationInfo);
    setStorageNotificationInfo(newNotificationInfo);
    updatePlanNotification(
      { planNotification: value },
      {
        onError: () => {
          setNotificationInfo(originNoficiationInfo);
          setStorageNotificationInfo(originNoficiationInfo);
          setDisableLoading(false);
        },
        onSuccess: () => {
          setDisableLoading(false);
        },
      }
    );
  };

  const handleNoticeNotification = async (value: boolean) => {
    const { status } = await checkNotifications();

    if (status !== 'granted' && !notificationInfo.notice) {
      confirmSetNoficiation();
      return;
    }

    const originNoficiationInfo = { ...notificationInfo, notice: !value };
    const newNotificationInfo = { ...notificationInfo, notice: value };
    setDisableLoading(true);
    setNotificationInfo(newNotificationInfo);
    setStorageNotificationInfo(newNotificationInfo);
    updateNoticeNotification(
      { noticeNotification: value },
      {
        onError: () => {
          setNotificationInfo(originNoficiationInfo);
          setStorageNotificationInfo(originNoficiationInfo);
          setDisableLoading(false);
        },
        onSuccess: () => {
          setDisableLoading(false);
        },
      }
    );
  };

  const confirmSetNoficiation = async () => {
    Alert.alert('앱 알림 비활성 상태입니다.\n설정을 변경하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
        onPress: () => {
          return;
        },
      },
      {
        text: '설정 변경',
        onPress: () => {
          Linking.openSettings();
        },
      },
    ]);
  };

  const setStorageNotificationInfo = async (info: NotificationInfo) => {
    await AsyncStorage.setItem('notificationInfo', JSON.stringify(info));
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <Header title="알림" />
      <View style={styles.content}>
        <View style={{ marginTop: 20 }}>
          <SwitchInputRow
            label={'일정'}
            value={notificationInfo.plan}
            onPress={() => handlePlanNotification(!notificationInfo.plan)}
          />
        </View>
        <View style={{ marginTop: 32 }}>
          <SwitchInputRow
            label={'공지사항 알림'}
            value={notificationInfo.notice}
            onPress={() => handleNoticeNotification(!notificationInfo.notice)}
          />
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
