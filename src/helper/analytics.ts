import analytics, { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';

export const logEvent = (
  name: string,
  params?: { [key: string]: any },
  options?: FirebaseAnalyticsTypes.AnalyticsCallOptions
) => {
  if (__DEV__) {
    return;
  }
  analytics().logEvent(name, params, options);
};

export const logScreenView = (params: FirebaseAnalyticsTypes.ScreenViewParameters) => {
  if (__DEV__) {
    return;
  }
  analytics().logScreenView(params);
};
