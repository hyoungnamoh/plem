import { checkNotifications } from 'react-native-permissions';

type NotificationSettings = {
  // properties only available on iOS
  // unavailable settings will not be included in the response object
  alert?: boolean;
  badge?: boolean;
  sound?: boolean;
  carPlay?: boolean;
  criticalAlert?: boolean;
  provisional?: boolean;
  providesAppSettings?: boolean;
  lockScreen?: boolean;
  notificationCenter?: boolean;
};

// export const checkNotifications = (): Promise<{
//   status: PermissionStatus;
//   settings: NotificationSettings;
// }> => {};
checkNotifications().then(({ status, settings }) => {});
