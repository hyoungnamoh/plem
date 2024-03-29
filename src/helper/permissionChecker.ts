import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const permissionChecker = () => {
  check(PERMISSIONS.IOS.REMINDERS)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.info('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.info('The permission has not been requested / is denied but requestable');
          break;
        case RESULTS.LIMITED:
          console.info('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.info('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          console.info('The permission is denied and not requestable anymore');
          break;
      }
    })
    .catch((error) => {
      // …
    });
};
