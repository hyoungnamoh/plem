import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Header from 'components/Header';
import { MAIN_COLOR } from 'constants/colors';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import Toast from '@hyoungnamoh/react-native-easy-toast';
import PlemText from 'components/Atoms/PlemText';
import UnderlineTextInput from 'components/UnderlineTextInput';
import UnderlineButton from 'components/UnderlineButton';
import BottomButton from 'components/BottomButton';
import { useMutation } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ApiResponse } from 'types/axios';
import {
  postVerificationEmailApi,
  PostVerificationEmailParams,
  PostVerificationEmailResponse,
} from 'api/auth/postVerificationEmailApi';
import { AxiosError } from 'axios';
import { validator } from 'helper/validator';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';
import { useUpdateEmail } from 'hooks/mutations/useUpdateEmail';
import EncryptedStorage from 'react-native-encrypted-storage';
import { LoggedInUser } from 'types/user';
import { loggedInUserState } from 'states/loggedInUserState';
import jwt_decode from 'jwt-decode';
import { removeWhitespace } from 'helper/removeWhitespace';
import { globalToastState } from 'states/globalToastState';

type ModifyEmailPageProps = NativeStackScreenProps<SettingTabStackParamList, 'ModifyEmailPage'>;

const ModifyEmailPage = ({ navigation }: ModifyEmailPageProps) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const setGlobalToast = useSetRecoilState(globalToastState);

  const [email, setEmail] = useState('');
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [receivedCode, setReceivedCode] = useState('');
  const [isSent, setIsSent] = useState(false);

  const toastRef = useRef<Toast>(null);

  const usePostVerificationEmail = useMutation<
    ApiResponse<PostVerificationEmailResponse>,
    AxiosError,
    PostVerificationEmailParams
  >('verificationCode', (body) => postVerificationEmailApi(body), {
    onSuccess: async (responseData) => {
      if (responseData.status === 200) {
        setReceivedCode(`${responseData.data.verificationCode}`);
        setIsSent(true);
        setGlobalToast({ text: '인증 메일이 전송되었습니다.', duration: 2000 });
        setVerificationCode(''); // 재발송 시 사용
        // test
        console.log(`${responseData.data.verificationCode}`);
      } else if (responseData.data) {
        Alert.alert(responseData.data);
      }
    },
  });

  const { mutate: updateEmail } = useUpdateEmail({
    onSuccess: async (responseData) => {
      if (responseData.status === 200) {
        await EncryptedStorage.setItem('refreshToken', responseData.data.refreshToken);
        await EncryptedStorage.setItem('accessToken', responseData.data.accessToken);
        const user = jwt_decode<LoggedInUser>(responseData.data.accessToken);
        setLoggedInUser(user);
        setGlobalToast({ text: '이메일 변경이 완료되었습니다.', duration: 2000 });
        navigation.goBack();
      } else if (responseData.data) {
        Alert.alert(responseData.data);
      }
    },
  });

  const { isLoading: sendEmailLoading, mutate: sendEmail, data } = usePostVerificationEmail;

  const onPressSend = () => {
    if (sendEmailLoading) {
      return;
    }
    sendEmail({ email });
  };

  const handleNotReceivedPress = () => {
    navigation.navigate('NotReceivedMailPage', { usePostVerificationEmail, email });
  };

  const onChangeEmail = (value: string) => {
    const newEmail = removeWhitespace(value);
    setEmail(newEmail);
    if (!newEmail) {
      setIsInvalidEmail(false);
      return;
    }
    setIsInvalidEmail(!validator({ value: newEmail, type: 'email' }));
  };

  const onPressVerify = () => {
    if (loggedInUser?.email === email) {
      Alert.alert('기존 이메일과 동일합니다.');
      return;
    }
    if (verificationCode !== receivedCode) {
      Alert.alert('인증번호가 일치하지 않습니다.');
    }
    updateEmail({ newEmail: email });
    return;
  };

  return (
    <>
      <CustomScrollView contentContainerStyle={styles.page}>
        <Toast
          ref={toastRef}
          style={styles.toast}
          position="bottom"
          positionValue={200}
          fadeInDuration={300}
          fadeOutDuration={300}
          textStyle={styles.toastText}
        />
        <Header title="이메일 변경" />
        <View style={styles.content}>
          <View style={styles.titleWrap}>
            <PlemText style={styles.title}>변경할 이메일로</PlemText>
            <PlemText style={styles.title}>인증을 진행해 주세요.</PlemText>
          </View>
          <View style={styles.descriptionWrap}>
            <PlemText style={styles.description}>이메일 정보는 계정 찾기에만 사용되며,</PlemText>
            <PlemText style={styles.description}>다른 용도로 사용되지 않습니다.</PlemText>
          </View>
          <View style={styles.emailWrap}>
            <PlemText style={[styles.label, { color: isInvalidEmail ? '#E40C0C' : '#000' }]}>이메일</PlemText>
            <UnderlineTextInput
              style={styles.input}
              value={email}
              onChangeText={onChangeEmail}
              placeholder="이메일을 입력해 주세요."
              wrapperProps={{ style: styles.inputWrap }}
              isInvalidValue={isInvalidEmail}
              editable={!isSent}
              selectTextOnFocus={isSent}
              keyboardType="email-address"
            />
            {isInvalidEmail && <PlemText style={styles.errorText}>이메일 형식이 올바르지 않습니다.</PlemText>}
          </View>
          {isSent && (
            <>
              <View style={styles.verificationCodeWrap}>
                <PlemText>인증번호</PlemText>
                <UnderlineTextInput
                  style={styles.input}
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  wrapperProps={{ style: styles.inputWrap }}
                  placeholder={'인증번호 여섯자리를 입력해 주세요.'}
                  keyboardType={'number-pad'}
                  maxLength={6}
                />
              </View>
              <View style={styles.notReceivedButtonWrap}>
                <UnderlineButton style={{ color: '#444444' }} onPress={handleNotReceivedPress}>
                  인증 메일을 받지 못하셨나요?
                </UnderlineButton>
              </View>
            </>
          )}
        </View>
      </CustomScrollView>
      {isSent ? (
        <BottomButton title={'메일 변경 완료'} onPress={onPressVerify} disabled={verificationCode.length !== 6} />
      ) : (
        <BottomButton title={'인증 메일 받기'} onPress={onPressSend} disabled={isInvalidEmail || !email} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: MAIN_COLOR,
    flex: 1,
  },
  content: {
    paddingHorizontal: 15,
    flex: 1,
    paddingBottom: 36,
  },
  titleWrap: {
    marginTop: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    lineHeight: 1.28,
  },
  descriptionWrap: {
    marginTop: 16,
  },
  description: {
    lineHeight: 1.33,
  },
  emailWrap: {
    marginTop: 40,
  },
  input: {
    fontSize: 18,
  },
  inputWrap: {
    marginTop: 12,
  },
  verificationCodeWrap: {
    marginTop: 32,
  },
  label: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    color: '#E40C0C',
    marginTop: 5,
  },
  toast: {
    backgroundColor: '#444444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    borderRadius: 4,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
  },
  notReceivedButtonWrap: {
    alignItems: 'center',
    marginTop: 32,
  },
});
export default ModifyEmailPage;
