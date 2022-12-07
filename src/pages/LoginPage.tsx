import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import { loginApi, LoginApiResponse } from '../api/auth/login';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ApiResponse } from '../../types/axios';
import PlemText from '../components/Atoms/PlemText';
import UnderlineTextInput from '../components/UnderlineTextInput';
import Header from '../components/Header';
import BlackButton from '../components/BlackButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoggedOutStackParamList } from '../../AppInner';
import UnderlineText from '../components/UnderlineText';
import { useRecoilState } from 'recoil';
import { loggedInState } from '../states/loggedInState';
import Loading from '../components/Loading';
import { AxiosError } from 'axios';

type LoginMutationParams = {
  email: string;
  password: string;
};

type LoginPageProps = NativeStackScreenProps<LoggedOutStackParamList, 'LoginPage'>;

const LoginPage = ({ navigation }: LoginPageProps) => {
  const queryClient = useQueryClient();

  const [loggedIn, setLoggedIn] = useRecoilState(loggedInState);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const loginMutation = useMutation<ApiResponse<LoginApiResponse>, AxiosError, LoginMutationParams>(
    'login',
    ({ email, password }) => loginApi({ email, password }),
    {
      onSuccess: async (responseData, variables, context) => {
        if (responseData.status === 200) {
          queryClient.invalidateQueries('loginUser');
          setLoggedIn(true);
          await EncryptedStorage.setItem('accessToken', responseData.data.accessToken);
          navigation.navigate('MainPage');
        } else if (responseData.data.error) {
          Alert.alert(responseData.data.message);
        } else {
          Alert.alert('이메일과 비밀번호를 입력해주세요.');
        }
      },
      onError: (error, variable, context) => {
        Alert.alert('알 수 없는 오류가 발생했어요 ;ㅂ;');
        console.info(error.name + ': ', error.message);
      },
    }
  );

  const onPressFindAccount = () => {
    Alert.alert('비밀번호 찾기 버튼');
  };

  return (
    <View style={styles.page}>
      <Header />
      <View style={styles.content}>
        <View>
          <PlemText style={{ fontSize: 28 }}>돌아오셨군요!</PlemText>
          <PlemText style={{ fontSize: 28 }}>다시 만나 반가워요.</PlemText>
        </View>
        <View style={{ marginTop: 40 }}>
          <PlemText>이메일</PlemText>
          <UnderlineTextInput
            wrapperProps={{ style: { marginTop: 12 } }}
            value={email}
            onChangeText={onChangeEmail}
            placeholder={'이메일을 입력해 주세요.'}
          />
          <View style={{ marginTop: 32 }}>
            <PlemText>비밀번호</PlemText>
            <UnderlineTextInput
              wrapperProps={{ style: { marginTop: 12 } }}
              value={password}
              onChangeText={onChangePassword}
              placeholder={'영문, 숫자, 특수문자 포함 8-20자'}
              secureTextEntry
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <BlackButton onPress={onPressLoginButton} style={{ marginTop: 40 }}>
            <PlemText style={{ color: '#fff' }}>로그인</PlemText>
          </BlackButton>
          <UnderlineText style={styles.findAccount} onPress={onPressFindAccount}>
            아이디 비밀번호 찾기
          </UnderlineText>
        </View>
      </View>
      {loginMutation.isLoading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  findAccount: {
    marginTop: 32,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  page: {
    flex: 1,
    backgroundColor: '#F4F1E8',
  },
  content: {
    paddingHorizontal: 15,
    marginTop: 12,
  },
});

export default LoginPage;
