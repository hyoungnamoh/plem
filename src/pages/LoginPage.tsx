import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import { loginApi, LoginResponse } from '../api/auth/loginApi';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ApiResponse } from '../../types/axios';
import PlemText from '../components/Atoms/PlemText';
import Header from '../components/Header';
import BlackButton from '../components/BlackButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import UnderlineButton from '../components/UnderlineButton';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Loading from '../components/Loading';
import { AxiosError } from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { bottomSafeAreaState } from '../states/bottomSafeAreaState';
import UnderlineTextInput from '../components/UnderlineTextInput';
import { MAIN_COLOR } from '../constants/colors';
import { loggedInUserState } from '../states/loggedInUserState';
import { LoggedInUser } from '../../types/user';
import jwt_decode from 'jwt-decode';
import { LoggedOutStackParamList } from '../../types/appInner';

type LoginMutationParams = {
  email: string;
  password: string;
};

type LoginPageProps = NativeStackScreenProps<LoggedOutStackParamList, 'LoginPage'>;

const LoginPage = ({ navigation, route }: LoginPageProps) => {
  const queryClient = useQueryClient();
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useFocusEffect(() => {
    setBottomSafeArea(MAIN_COLOR);
  });

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

  const loginMutation = useMutation<ApiResponse<LoginResponse>, AxiosError, LoginMutationParams>(
    'loginApi',
    ({ email, password }) => loginApi({ email, password }),
    {
      onSuccess: async (responseData, variables, context) => {
        if (responseData.status === 200) {
          queryClient.invalidateQueries('loginUser');
          const user = jwt_decode<LoggedInUser>(responseData.data.accessToken);
          await EncryptedStorage.setItem('accessToken', responseData.data.accessToken);
          await EncryptedStorage.setItem('refreshToken', responseData.data.refreshToken);
          setLoggedInUser(user);
        } else if (responseData.data) {
          Alert.alert(responseData.data);
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
    navigation.navigate('FindPasswordPage');
  };

  const getTitle = () => {
    if (route.params?.from === 'SignUpSuccessPage') {
      return (
        <>
          <PlemText style={styles.titleText}>작심천일의 시작</PlemText>
          <PlemText style={styles.titleText}>플렘에 오신 걸 환영합니다.</PlemText>
        </>
      );
    }
    return (
      <>
        <PlemText style={styles.titleText}>돌아오셨군요!</PlemText>
        <PlemText style={styles.titleText}>다시 만나 반가워요.</PlemText>
      </>
    );
  };

  return (
    <View style={styles.page}>
      <Header />
      <View style={styles.content}>
        <View>{getTitle()}</View>
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
          <UnderlineButton style={styles.findAccount} onPress={onPressFindAccount}>
            비밀번호가 생각나지 않으시나요?
          </UnderlineButton>
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
    backgroundColor: MAIN_COLOR,
  },
  content: {
    paddingHorizontal: 15,
    marginTop: 12,
  },
  titleText: {
    fontSize: 28,
  },
});

export default LoginPage;
