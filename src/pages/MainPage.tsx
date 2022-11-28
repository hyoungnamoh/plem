import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, Text, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { LoggedInStackParamList } from '../../AppInner';
import MainSVGFrame from '../components/MainSVGFrame';
import { loggedInState } from '../states/loggedInState';

type MainPageProps = NativeStackScreenProps<LoggedInStackParamList, 'MainPage'>;

const MainPage = ({ navigation }: MainPageProps) => {
  const queryClient = useQueryClient();
  const setLoggedIn = useSetRecoilState(loggedInState);

  const removeJwt = async () => {
    try {
      await EncryptedStorage.removeItem('accessToken');
      queryClient.setQueryData('loginUser', { data: {} });
      setLoggedIn(false);
    } catch (error) {
      console.info(error);
    }
    Alert.alert('remove token');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F1E8' }}>
      <View style={{ alignItems: 'center' }}>
        <MainSVGFrame />
      </View>
      <Pressable style={{ width: 200, height: 100, backgroundColor: 'aqua' }} onPress={removeJwt} />
    </View>
  );
};

export default MainPage;
