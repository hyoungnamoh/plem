import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { MAIN_COLOR } from 'constants/colors';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { useSetRecoilState } from 'recoil';
import { bottomSafeAreaState } from 'states/bottomSafeAreaState';

const NavigationWrapper = ({
  children,
  setRouteName,
}: {
  children: ReactNode;
  setRouteName: Dispatch<SetStateAction<string>>;
}) => {
  const navigationRef = createNavigationContainerRef();
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);

  return (
    <NavigationContainer
      theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: MAIN_COLOR } }}
      ref={navigationRef}
      onReady={() => {
        const currentRoute = navigationRef.getCurrentRoute();
        if (currentRoute) {
          setRouteName(currentRoute.name);
        }
      }}
      onStateChange={async () => {
        setBottomSafeArea(MAIN_COLOR);
        const currentRoute = navigationRef.getCurrentRoute();
        if (currentRoute) {
          const currentRouteName = currentRoute.name;
          setRouteName(currentRouteName);
        }
      }}>
      {children}
    </NavigationContainer>
  );
};

export default NavigationWrapper;
