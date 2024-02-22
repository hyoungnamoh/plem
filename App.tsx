import { useState } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import AppInner from './AppInner';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { errorHandler } from './src/utils/errorHandler';
import CodePush from 'react-native-code-push';
import { codePushOptions } from './src/utils/configCodepush';
import NavigationWrapper from 'components/NavigationWrapper';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: errorHandler,
  }),
  defaultOptions: {
    mutations: { onError: errorHandler },
  },
});

// if (__DEV__) {
//   import('react-query-native-devtools').then(({ addPlugin }) => {
//     addPlugin({ queryClient });
//   });
// }

const App = () => {
  const [routeName, setRouteName] = useState('');

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationWrapper setRouteName={setRouteName}>
            <AppInner routeName={routeName} />
          </NavigationWrapper>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default CodePush(codePushOptions)(App);
