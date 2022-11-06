import { useRoute } from '@react-navigation/native';
import { Alert, Pressable, Text, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useQueryClient } from 'react-query';

const MainPage = () => {
  const queryClient = useQueryClient();
  const removeJwt = async () => {
    try {
      await EncryptedStorage.removeItem('accessToken');
      queryClient.setQueryData('loginUser', { data: {} });
    } catch (error) {
      console.info(error);
    }

    Alert.alert('remove token');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F1E8' }}>
      <Text>하위 로그인 하셨네요</Text>
      <Pressable onPress={removeJwt}>
        <Text>토큰삭제</Text>
      </Pressable>
    </View>
  );
};

export default MainPage;
