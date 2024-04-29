import { useState } from 'react';
import { Alert, Keyboard, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import { loginApi, LoginResponse } from 'api/auth/loginApi';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ApiResponse } from 'types/axios';
import PlemText from 'components/Atoms/PlemText';
import Header from 'components/Header';
import BlackButton from 'components/BlackButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import UnderlineButton from 'components/UnderlineButton';
import { useSetRecoilState } from 'recoil';
import { AxiosError } from 'axios';
import UnderlineTextInput from 'components/UnderlineTextInput';
import { MAIN_COLOR } from 'constants/colors';
import { loggedInUserState } from 'states/loggedInUserState';
import { LoggedInUser } from 'types/user';
import jwt_decode from 'jwt-decode';
import { LoggedOutStackParamList } from 'types/appInner';
import messaging from '@react-native-firebase/messaging';
import { phoneTokenState } from 'states/phoneTokenState';
import { useRegisterPhoneToken } from 'hooks/mutations/useRegisterPhoneToken';
import { removeWhitespace } from 'helper/removeWhitespace';
import { notificationInfoState } from 'states/notificationInfoState';
import { checkNotifications } from 'react-native-permissions';
import { getStorageNotificationInfo } from 'utils/getStorageNotificationInfo';
import { useUpdatePlanNotification } from 'hooks/mutations/useUpdatePlanNotification';
import { useUpdateNoticeNotification } from 'hooks/mutations/useUpdateNoticeNotification';

type LoginMutationParams = {
  email: string;
  password: string;
};

type LoginPageProps = NativeStackScreenProps<LoggedOutStackParamList, 'LoginPage'>;

const LoginPage = ({ navigation, route }: LoginPageProps) => {
  const queryClient = useQueryClient();
  const setLoggedInUser = useSetRecoilState(loggedInUserState);
  const setPhoneToken = useSetRecoilState(phoneTokenState);
  const setNotificationInfo = useSetRecoilState(notificationInfoState);
  const { mutate: registerPhoneToken } = useRegisterPhoneToken({});
  const { mutate: updatePlanNotification } = useUpdatePlanNotification({});
  const { mutate: updateNoticeNotification } = useUpdateNoticeNotification({});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const fromSuccessPage = route.params?.from === 'SignUpSuccessPage';

  const onChangeEmail = (value: string) => {
    if (isLoginFailed) {
      setIsLoginFailed(false);
      setIsInvalidPassword(false);
    }
    if (isInvalidEmail) {
      setIsInvalidEmail(false);
    }
    setEmail(removeWhitespace(value));
  };

  const onChangePassword = (value: string) => {
    if (isLoginFailed) {
      setIsLoginFailed(false);
      setIsInvalidEmail(false);
    }
    if (isInvalidPassword) {
      setIsInvalidPassword(false);
    }
    setPassword(value);
  };

  const onPressLoginButton = async () => {
    if (loginMutation.isLoading) {
      return;
    }
    if (!email) {
      setIsInvalidEmail(true);
    }
    if (!password) {
      setIsInvalidPassword(true);
    }

    if (!email || !password) {
      return;
    }

    loginMutation.mutate({ email, password });
  };

  const loginMutation = useMutation<ApiResponse<LoginResponse>, AxiosError, LoginMutationParams>('loginApi', loginApi, {
    onSuccess: async (responseData, variables, context) => {
      const { status, settings } = await checkNotifications();
      const storageNotifiactionInfo = await getStorageNotificationInfo();
      queryClient.invalidateQueries('loginUser');
      const user = jwt_decode<LoggedInUser>(responseData.data.accessToken);
      await EncryptedStorage.setItem('accessToken', responseData.data.accessToken);
      await EncryptedStorage.setItem('refreshToken', responseData.data.refreshToken);
      await getPhoneToken();
      setLoggedInUser(user);
      if (status === 'granted') {
        if (storageNotifiactionInfo) {
          setNotificationInfo({ notice: storageNotifiactionInfo.notice, plan: storageNotifiactionInfo.plan });
        } else {
          setNotificationInfo({ notice: true, plan: true });
          updatePlanNotification({ planNotification: true });
          updateNoticeNotification({ noticeNotification: true });
        }
      } else {
        setNotificationInfo({ plan: false, notice: false });
      }
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        setIsLoginFailed(true);
        setIsInvalidEmail(true);
        setIsInvalidPassword(true);
      }
    },
  });

  const getPhoneToken = async () => {
    try {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
      const phoneToken = await messaging().getToken();

      setPhoneToken(phoneToken);
      registerPhoneToken({ phoneToken });
    } catch (error) {
      Alert.alert('토큰 등록에 실패했습니다. 지속될 경우 앱 재설치 또는 플렘에 문의해주세요.');
    }
  };

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
    return <PlemText style={styles.titleText}>{'돌아오셨군요!\n다시 만나 반가워요.'}</PlemText>;
  };

  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
      <View style={styles.page}>
        <Header close={fromSuccessPage} />
        <View style={styles.content}>
          <View>{getTitle()}</View>
          <View style={{ marginTop: 40 }}>
            <PlemText style={{ color: isInvalidEmail ? '#E40C0C' : '#000' }}>이메일</PlemText>
            <UnderlineTextInput
              wrapperProps={{ style: { marginTop: 12 } }}
              value={email}
              onChangeText={onChangeEmail}
              placeholder={'이메일을 입력해 주세요.'}
              keyboardType="email-address"
              isInvalidValue={isInvalidEmail}
            />
            <View style={{ marginTop: 32 }}>
              <PlemText style={{ color: isInvalidPassword ? '#E40C0C' : '#000' }}>비밀번호</PlemText>
              <UnderlineTextInput
                wrapperProps={{ style: { marginTop: 12 } }}
                value={password}
                onChangeText={onChangePassword}
                placeholder={'영문, 숫자 포함 8-20자리'}
                secureTextEntry
                isInvalidValue={isInvalidPassword}
              />
              {isLoginFailed && (
                <PlemText style={styles.errorText}>가입되지 않은 계정이거나 이메일 또는 비밀번호가 틀렸어요.</PlemText>
              )}
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
      </View>
    </TouchableNativeFeedback>
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
    paddingHorizontal: 16,
    marginTop: 12,
  },
  titleText: {
    fontSize: 28,
    lineHeight: 1.12,
  },
  errorText: {
    fontSize: 14,
    color: '#E40C0C',
    marginTop: 5,
  },
});

export default LoginPage;
