import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import Header from 'components/Header';
import SwitchInputRow from 'components/SwitchInputRow';
import { MAIN_COLOR } from 'constants/colors';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import { useRecoilState } from 'recoil';
import { NotificationInfo, notificationInfoState } from 'states/notificationInfoState';
import { checkNotifications } from 'react-native-permissions';
import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUpdatePlanNotification } from 'hooks/mutations/useUpdatePlanNotification';

type NotificationSettingPageProps = NativeStackScreenProps<SettingTabStackParamList, 'NotificationSettingPage'>;

const NotificationSettingPage = ({ navigation }: NotificationSettingPageProps) => {
  const [deviceNotification, setDeviceNotification] = useState(false);
  const [notificationInfo, setNotificationInfo] = useRecoilState(notificationInfoState);
  const { mutate: updatePlanNotification } = useUpdatePlanNotification({});

  useFocusEffect(() => {
    checkNotifications().then(({ status }) => {
      if (status === 'granted') {
        setDeviceNotification(true);
      } else {
        setDeviceNotification(false);
      }
    });
  });

  const handlePlanNotification = async (value: boolean) => {
    if (!deviceNotification) {
      Linking.openURL('app-settings:');
      return;
    }
    const originNoficiationInfo = { ...notificationInfo, plan: !value };
    const newNotificationInfo = { ...notificationInfo, plan: value };
    try {
      updatePlanNotification({ planNotification: value });
      setNotificationInfo(newNotificationInfo);
      setStorageNotificationInfo(newNotificationInfo);
    } catch (error) {
      setNotificationInfo(originNoficiationInfo);
      setStorageNotificationInfo(originNoficiationInfo);
      updatePlanNotification({ planNotification: !value });
      Alert.alert('알림 설정에 실패했습니다. 다시 시도해주세요.');
      console.info(error);
    }
  };

  const handleNoticeNotification = async (value: boolean) => {
    if (!deviceNotification) {
      Linking.openURL('app-settings:');
      return;
    }
    const originNoficiationInfo = { ...notificationInfo };
    const newNotificationInfo = { ...notificationInfo, notice: value };
    setNotificationInfo(newNotificationInfo);

    if (value) {
      messaging()
        .subscribeToTopic('notice')
        .then(() => {
          setStorageNotificationInfo(newNotificationInfo);
        })
        .catch((error) => {
          setNotificationInfo(originNoficiationInfo);
          setStorageNotificationInfo(originNoficiationInfo);
          Alert.alert('알림 설정에 실패했습니다. 다시 시도해주세요.');
          console.info(error);
        });
    } else {
      messaging()
        .unsubscribeFromTopic('notice')
        .then(() => {
          setStorageNotificationInfo(newNotificationInfo);
        })
        .catch((error) => {
          setNotificationInfo(originNoficiationInfo);
          setStorageNotificationInfo(originNoficiationInfo);
          Alert.alert('알림 설정에 실패했습니다. 다시 시도해주세요.');
          console.info(error);
        });
    }
  };

  const setStorageNotificationInfo = async (info: NotificationInfo) => {
    await AsyncStorage.setItem('notification_info', JSON.stringify(info));
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <Pressable />
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
