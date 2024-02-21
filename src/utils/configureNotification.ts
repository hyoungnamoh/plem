import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

export const configureNotification = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {});

  messaging().onMessage(async (remoteMessage) => {
    if (!remoteMessage.notification) {
      return;
    }
    PushNotification.localNotification({
      message: remoteMessage.notification.body || '',
      title: remoteMessage.notification.title || '',
      category: remoteMessage.category,
      soundName: 'default',
    });
  });

  PushNotification.configure({
    // (optional) 토큰이 생성될 때 실행됨(토큰을 서버에 등록할 때 쓸 수 있음)
    onRegister: function (token: any) {},

    // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
    onNotification: function (notification: any) {
      if (notification.channelId === 'schedule') {
        if (notification.message || notification.data.message) {
        }
      }
      // process the notification

      // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) 등록한 액션을 누렀고 invokeApp이 false 상태일 때 실행됨, true면 onNotification이 실행됨 (Android)
    onAction: function (notification: any) {
      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err: Error) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });
  PushNotification.createChannel(
    {
      channelId: 'schedule', // (required)
      channelName: '일정', // (required)
      channelDescription: '일정 알림 채널', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) => console.info(`createChannel schedule returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
  PushNotification.createChannel(
    {
      channelId: 'plan', // (required)
      channelName: '계획', // (required)
      channelDescription: '계획 알림 채널', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) => console.info(`createChannel plan returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
};
