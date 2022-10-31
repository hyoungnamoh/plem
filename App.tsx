import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppInner from './AppInner';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  FindPassword: undefined;
};

export type LogggedInParamList = {
  Main: undefined;
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

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AppInner />
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
