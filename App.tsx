import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { Suspense, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import AppInner from './AppInner';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient({ defaultOptions: { queries: { suspense: true } } });

const App = () => {
  const navigationRef = createNavigationContainerRef();
  const [routeName, setRouteName] = useState('');
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer
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
