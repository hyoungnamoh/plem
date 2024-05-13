import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { MAIN_COLOR } from 'constants/colors';
import { Dispatch, ReactNode, SetStateAction, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { bottomSafeAreaState } from 'states/bottomSafeAreaState';
import { Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { logScreenView } from 'helper/analytics';

const NAVIGATION_IDS = ['home', 'post', 'noticeListPage'];

const NavigationWrapper = ({
  children,
  setRouteName,
}: {
  children: ReactNode;
  setRouteName: Dispatch<SetStateAction<string>>;
}) => {
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);
  const navigationRef = createNavigationContainerRef();
  const routeNameRef = useRef<string>();

  function buildDeepLinkFromNotificationData(data: any): string | null {
    if (!data) {
      return null;
    }

    const navigationId = data.navigationId;
    if (!NAVIGATION_IDS.includes(navigationId)) {
      console.warn('Unverified navigationId', navigationId);
      return null;
    }
    if (navigationId === 'home') {
      return 'plem://home';
    }
    if (navigationId === 'noticeListPage') {
      return 'plem://noticeListPage';
    }
    const postId = data.postId;
    if (typeof postId === 'string') {
      return `plem://post/${postId}`;
    }
    return null;
  }

  const linking = {
    prefixes: ['plem://'],
    config: {
      screens: {
        Home: 'home',
        Post: 'post/:id',
        SettingTab: {
          screens: {
            SettingPage: 'settingPage',
            NoticeListPage: 'noticeListPage',
          },
        },
      },
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();

      if (typeof url === 'string') {
        return url;
      }
      //getInitialNotification: When the application is opened from a quit state.
      const message = await messaging().getInitialNotification();
      const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);

      if (typeof deeplinkURL === 'string') {
        return deeplinkURL;
      }
    },
    subscribe(listener: (url: string) => void) {
      const onReceiveURL = ({ url }: { url: string }) => {
        listener(url);
      };
      // Listen to incoming links from deep linking
      const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

      // 앱 꺼져있을 때, 백그라운드에 있을 때 노티온 거 눌렀을 때 실행
      const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
        const url = buildDeepLinkFromNotificationData(remoteMessage.data);

        if (typeof url === 'string') {
          listener(url);
        }
      });

      return () => {
        linkingSubscription.remove();
        unsubscribe();
      };
    },
  };

  return (
    <NavigationContainer
      theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: MAIN_COLOR } }}
      ref={navigationRef}
      onReady={() => {
        const currentRoute = navigationRef.getCurrentRoute();
        if (currentRoute) {
          setRouteName(currentRoute.name);
          routeNameRef.current = currentRoute.name;
        }
      }}
      onStateChange={async () => {
        setBottomSafeArea(MAIN_COLOR);
        const currentRoute = navigationRef.getCurrentRoute();
        const previousRouteName = routeNameRef.current;

        if (currentRoute) {
          const currentRouteName = currentRoute.name;
          setRouteName(currentRouteName);

          if (previousRouteName !== currentRouteName) {
            logScreenView({
              screen_class: currentRouteName,
              screen_name: currentRouteName,
            });
          }
        }
      }}
      linking={linking}>
      {children}
    </NavigationContainer>
  );
};

export default NavigationWrapper;
