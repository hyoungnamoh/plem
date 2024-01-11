import { createNavigationContainerRef, NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import AppInner from './AppInner';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MAIN_COLOR } from './src/constants/colors';
import { Alert } from 'react-native';

const errorHandler = (error: any) => {
  if (error.response?.data?.data) {
    Alert.alert(error.response.data.data);
  } else {
    Alert.alert('알 수 없는 에러가 발생했습니다.');
  }
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { suspense: true, onError: errorHandler },
    mutations: { onError: errorHandler },
  },
});

const App = () => {
  const navigationRef = createNavigationContainerRef();
  const [routeName, setRouteName] = useState('');
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
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
              const currentRoute = navigationRef.getCurrentRoute();
              if (currentRoute) {
                const currentRouteName = currentRoute.name;
                setRouteName(currentRouteName);
              }
            }}>
            <AppInner routeName={routeName} />
          </NavigationContainer>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
