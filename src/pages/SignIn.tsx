import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import { loginApi, LoginApiResponseData } from '../api/auth/login';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ErrorResponse, SuccessResponse } from '../../types/axios';

type LoginMutationParams = {
  email: string;
  password: string;
};

const SignIn = () => {
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('login2@naver.com');
  const [password, setPassword] = useState('123123qq');

  const removeJwt = async () => {
    try {
      await EncryptedStorage.removeItem('accessToken');
    } catch (error) {
      console.info(error);
    }

    Alert.alert('remove token');
  };

  const onChangeEmail = (value: string) => {
    setEmail(value);
  };

  const onChangePassword = (value: string) => {
    setPassword(value);
  };

  const onPressLoginButton = async () => {
    if (loginMutation.isLoading) {
      return;
    }
    loginMutation.mutate({ email, password });
  };

  const loginMutation = useMutation<SuccessResponse<LoginApiResponseData> & ErrorResponse, Error, LoginMutationParams>(
    'login',
    ({ email, password }) => loginApi({ email, password }),
    {
      onError: (error, variable, context) => {},
      onSuccess: async (responseData, variables, context) => {
        if (responseData.status === 200) {
          Alert.alert('login success');
          queryClient.invalidateQueries('loginUser');
          await EncryptedStorage.setItem('accessToken', responseData.data.accessToken);
        } else if (responseData.data.error) {
          const message =
            Array.isArray(responseData.data.message) && responseData.data.message.length > 0
              ? responseData.data.message[0]
              : (responseData.data.message as string);
          Alert.alert(message);
        } else {
          Alert.alert('이메일과 비밀번호를 입력해주세요.');
        }
      },
    }
  );

  return (
    <View>
      <TextInput value={email} onChangeText={onChangeEmail} style={{ borderWidth: 1 }} />
      <TextInput value={password} onChangeText={onChangePassword} style={{ borderWidth: 1 }} />
      <Pressable onPress={onPressLoginButton}>
        <Text>로그인</Text>
      </Pressable>
      <Pressable onPress={removeJwt}>
        <Text>토큰삭제</Text>
      </Pressable>
    </View>
  );
};

export default SignIn;
