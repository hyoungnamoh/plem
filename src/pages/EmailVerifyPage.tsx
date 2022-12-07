import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { LoggedOutStackParamList } from '../../AppInner';
import { ApiResponse } from '../../types/axios';
import { LoginApiResponse } from '../api/auth/login';
import {
  postVerificationEmail,
  PostVerificationEmailParams,
  PostVerificationEmailResponse,
} from '../api/auth/postVerificationEmail';
import PlemText from '../components/Atoms/PlemText';
import BlackButton from '../components/BlackButton';
import BottomButton from '../components/BottomButton';
import Header from '../components/Header';
import UnderlineText from '../components/UnderlineText';
import UnderlineTextInput from '../components/UnderlineTextInput';
import { bottomSafeAreaState } from '../states/bottomSafeAreaState';

type EmailVerifyPageProps = NativeStackScreenProps<LoggedOutStackParamList, 'EmailVerifyPage'>;

const EmailVerifyPage = ({ navigation, route }: EmailVerifyPageProps) => {
  const queryClient = useQueryClient();
  const { email, password, nickname } = route.params;
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);

  const [verificationCode, setVerificationCode] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    setBottomSafeArea('#F4F1E8');
  }, []);

  const { isLoading, mutate } = useMutation<
    ApiResponse<PostVerificationEmailResponse>,
    AxiosError,
    PostVerificationEmailParams
  >('verificationCode', ({ email }) => postVerificationEmail({ email }), {
    onSuccess: async (responseData, variables, context) => {
      if (responseData.status === 200) {
        setVerificationCode(responseData.data.verificationCode);
        Alert.alert('이메일 확인 ㄱ ㄱ');
      } else if (responseData.data.error) {
        Alert.alert(responseData.data.message);
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

  const onPressSend = () => {
    if (isLoading) {
      return;
    }

    mutate({ email });
    setIsSent(true);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.page}>
      <Header />
      <View style={styles.content}>
        <View style={styles.titleWrap}>
          <PlemText style={styles.title}>계정 보호를 위해</PlemText>
          <PlemText style={styles.title}>이메일 인증을 진행해 주세요.</PlemText>
        </View>
        <View style={styles.descriptionWrap}>
          <PlemText style={styles.description}>이메일 정보는 계정 찾기에만 사용되며,</PlemText>
          <PlemText style={styles.description}>다른 용도로 사용되지 않습니다.</PlemText>
        </View>
        <View style={styles.emailWrap}>
          <PlemText>이메일</PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={email}
            wrapperProps={{ style: styles.inputWrap }}
            editable={false}
          />
        </View>
        {isSent && (
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
        )}
      </View>
      <BottomButton title="인증 메일 받기" onPress={onPressSend} disabled={false} />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F4F1E8',
    flex: 1,
  },
  content: {
    paddingHorizontal: 15,
    flex: 1,
    paddingBottom: 36,
  },
  titleWrap: {
    marginTop: 12,
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
});

export default EmailVerifyPage;
