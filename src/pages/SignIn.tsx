import React, { useCallback, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import apiRequest from '../api';

const SignIn = () => {
  const [email, setEmail] = useState('login2@naver.com');
  const [password, setPassword] = useState('123123qq');
  const [loading, setLoading] = useState(false);

  const onChangeEmail = (value: string) => {
    setEmail(value);
  };

  const onChangePassword = (value: string) => {
    setPassword(value);
  };

  const onPressLoginButton = async () => {
    if (loading) {
      return;
    }
    try {
      const response = await apiRequest.post('/users/login', { email, password });
      const responseData = response.data;

      if (response.status === 200) {
        Alert.alert('login success');
        return;
      } else if (responseData.error) {
        Alert.alert(responseData.message);
      } else {
        Alert.alert('아이디와 비밀번호를 입력해주세요.');
      }
    } catch (error: any | AxiosError) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        Alert.alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={onChangeEmail} style={{ borderWidth: 1 }} />
      <TextInput value={password} onChangeText={onChangePassword} style={{ borderWidth: 1 }} />
      <Pressable onPress={onPressLoginButton}>
        <Text>로그인</Text>
      </Pressable>
    </View>
  );
};

export default SignIn;
