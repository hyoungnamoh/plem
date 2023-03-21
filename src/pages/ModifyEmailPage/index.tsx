import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import { MAIN_COLOR } from '../../constants/color';
import { ACCOUNT_SETTING_PAGE_MENUES, MenuItem, SETTING_PAGE_MENUS } from '../../constants/menu';
import { SettingTabStackParamList } from '../../tabs/SettingTab';
import MenuButton from '../../components/MenuButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from '@hyoungnamoh/react-native-easy-toast';
import PlemText from '../../components/Atoms/PlemText';
import UnderlineTextInput from '../../components/UnderlineTextInput';
import UnderlineButton from '../../components/UnderlineButton';
import BottomButton from '../../components/BottomButton';
import { useMutation, useQueryClient } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isVerifiedEmailState } from '../../states/isVerifiedEmailState';
import { bottomSafeAreaState } from '../../states/bottomSafeAreaState';
import { ApiResponse } from '../../../types/axios';
import {
  postVerificationEmailApi,
  PostVerificationEmailParams,
  PostVerificationEmailResponse,
} from '../../api/auth/postVerificationEmailApi';
import { AxiosError } from 'axios';
import { validator } from '../../helper/validator';

type ModifyEmailPageProps = NativeStackScreenProps<SettingTabStackParamList, 'ModifyEmailPage'>;

const ModifyEmailPage = ({ navigation }: ModifyEmailPageProps) => {
  const queryClient = useQueryClient();
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);
  const [isVerifiedEmail, setIsVerifiedEmail] = useRecoilState(isVerifiedEmailState);

  const [email, setEmail] = useState('');
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [receivedCode, setReceivedCode] = useState('');
  const [isSent, setIsSent] = useState(false);

  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    setBottomSafeArea(MAIN_COLOR);
  }, []);

  const usePostVerificationEmail = useMutation<
    ApiResponse<PostVerificationEmailResponse>,
    AxiosError,
    PostVerificationEmailParams
  >('verificationCode', ({ email }) => postVerificationEmailApi({ email }), {
    onSuccess: async (responseData, variables, context) => {
      if (responseData.status === 200) {
        setReceivedCode(`${responseData.data.verificationCode}`);
        setIsSent(true);
        toastRef.current?.show('인증 메일이 전송되었습니다.', 2000);
        setIsVerifiedEmail(false);
        setVerificationCode(''); // 재발송 시 사용
        // test
        console.log(`${responseData.data.verificationCode}`);
      } else if (responseData.data) {
        Alert.alert(responseData.data);
      } else {
        Alert.alert('알 수 없는 오류가 발생했어요 ;ㅂ;');
        console.info('verificationCode: ', responseData);
      }
    },
    onError: (error, variable, context) => {
      Alert.alert('알 수 없는 오류가 발생했어요 ;ㅂ;');
      console.info(error.name + ': ', error.message);
    },
  });

  const { isLoading: sendEmailLoading, mutate: sendEmail, data } = usePostVerificationEmail;

  const onPressSend = () => {
    if (sendEmailLoading) {
      return;
    }
    sendEmail({ email });
  };

  const onPressNotReceived = () => {
    // navigation.navigate('NotReceivedMailPage', { usePostVerificationEmail, email });
  };

  const onChangeEmail = (value: string) => {
    if (isVerifiedEmail) {
      Alert.alert('메일을 수정하면 인증 다시 받아야하는데 수정하시겠어요?', '', [
        {
          text: '아니요',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: '네',
          onPress: () => {
            setIsVerifiedEmail(false);
            setIsSent(false);
            setVerificationCode('');
          },
        },
      ]);
      return;
    }

    setEmail(value);
    if (!value) {
      setIsInvalidEmail(false);
      return;
    }
    setIsInvalidEmail(!validator({ value, type: 'email' }));
  };

  const onPressVerify = () => {
    if (verificationCode === receivedCode) {
      setIsVerifiedEmail(true);
      // navigation.navigate('PasswordSettingPage', { email });
      return;
    }
    Alert.alert('인증번호가 일치하지 않습니다.');
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.page}>
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
                editable={!isVerifiedEmail}
              />
            </View>
            <View style={styles.notReceivedButtonWrap}>
              <UnderlineButton style={{ color: '#444444' }} onPress={onPressNotReceived}>
                인증 메일을 받지 못하셨나요?
              </UnderlineButton>
            </View>
          </>
        )}
      </View>
      {isSent ? (
        <BottomButton title={'메일 인증 완료'} onPress={onPressVerify} disabled={verificationCode.length !== 6} />
      ) : (
        <BottomButton title={'인증 메일 받기'} onPress={onPressSend} disabled={isInvalidEmail || !email} />
      )}
    </KeyboardAwareScrollView>
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
    lineHeight: 36,
  },
  descriptionWrap: {
    marginTop: 16,
  },
  description: {
    lineHeight: 24,
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
    fontFamily: 'LeeSeoyun',
    fontSize: 16,
  },
  notReceivedButtonWrap: {
    alignItems: 'center',
    marginTop: 32,
  },
});
export default ModifyEmailPage;