import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppInner from './AppInner';

export type RootStackParamList = {
  LoginPage: undefined;
  SignUp: undefined;
  FindPassword: undefined;
};

export type LogggedInParamList = {
  MainPage: undefined;
  AddPlanChart: undefined;
  EditPlanChart: undefined;
  PlanChartList: undefined;
  AddPlan: undefined;
  EditPlan: undefined;
  SetLotation: undefined;
  SetNotification: undefined;
  Calendar: undefined;
  Settings: undefined;
  SetProfile: undefined;
};

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const navigationRef = createNavigationContainerRef();
  const [routeName, setRouteName] = useState('');
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
