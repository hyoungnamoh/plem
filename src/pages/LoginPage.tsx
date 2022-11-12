import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import { loginApi, LoginApiResponseData } from '../api/auth/login';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ErrorResponse, SuccessResponse } from '../../types/axios';
import UnderlineSvg from '../assets/images/Vector 671.svg';
import { useRoute } from '@react-navigation/native';
import MainSVGFrame from '../components/MainSVGFrame';

type LoginMutationParams = {
  email: string;
  password: string;
};

const LoginPage = () => {
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

  const onPressFindPassword = () => {
    Alert.alert('비밀번호 찾기 버튼');
  };
  const route = useRoute();
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: '#F4F1E8', flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'yellow' }}>
          <View style={{ alignItems: 'center' }}>
            <MainSVGFrame />
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <View>
              <Text>이메일</Text>
              <TextInput
                value={email}
                onChangeText={onChangeEmail}
                style={{ marginTop: 10 }}
                placeholder={'plam@plam.com'}
              />
              <View style={{ marginTop: 6 }}>
                <UnderlineSvg />
              </View>
            </View>
            <View style={{ marginTop: 40 }}>
              <Text>비밀번호</Text>
              <TextInput
                value={password}
                onChangeText={onChangePassword}
                style={{ marginTop: 10 }}
                placeholder={'영문, 숫자, 특수문자 포함 8-20자'}
                secureTextEntry
              />
              <View style={{ marginTop: 6 }}>
                <UnderlineSvg />
              </View>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', marginTop: 30 }}>
            <Pressable onPress={onPressLoginButton}>
              <Text>비밀번호 찾기</Text>
            </Pressable>
          </View>
        </View>
        {/* <Pressable onPress={removeJwt}>
        <Text>토큰삭제</Text>
      </Pressable> */}
      </ScrollView>
      <Pressable
        style={{ height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}
        onPress={onPressLoginButton}>
        <Text style={{ color: '#fff' }}>로그인</Text>
      </Pressable>
    </View>
  );
};

export default LoginPage;
