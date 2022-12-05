import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { LoggedOutStackParamList } from '../../AppInner';
import { ApiResponse, SuccessResponse } from '../../types/axios';
import { checkDuplicateEmail } from '../api/users/checkDuplicateEmail';
import PlemText from '../components/Atoms/PlemText';
import BottomButton from '../components/BottomButton';
import Header from '../components/Header';
import UnderlineTextInput from '../components/UnderlineTextInput';
import { validator } from '../helper/validator';
import { bottomSafeAreaState } from '../states/bottomSafeAreaState';

type SignUpPageProps = NativeStackScreenProps<LoggedOutStackParamList, 'SignUpPage'>;

const SignUpPage = ({ navigation }: SignUpPageProps) => {
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isValidatedEmail, setIsValidatedEmail] = useState(true);
  const [isValidatedPassword, setIsValidatedPassword] = useState(true);
  const [isValiDatedPasswordConfirm, setIsValidatedPasswordConfirm] = useState(true);

  const hasEmptyValue = !email || !password || !passwordConfirm;

  const { refetch: checkEmail } = useQuery<ApiResponse<boolean>>(
    ['checkDuplicateEmail', email],
    () => checkDuplicateEmail({ email: email }),
    {
      enabled: false,
      onError: (error) => {
        Alert.alert('error');
        console.info('error', error);
      },
      onSuccess: (responseData) => {
        if (responseData.status === 200) {
          navigation.navigate('NicknameSettingPage', { email, password });
        } else if (responseData.status === 400) {
          Alert.alert('이미 사용중인 이메일입니다.');
        } else {
          Alert.alert(responseData.data.message);
        }
      },
    }
  );

  const isValidatedAccount = () => {
    return isValidatedEmail && isValidatedPassword && isValiDatedPasswordConfirm && !hasEmptyValue;
  };

  const onPressNextButton = () => {
    if (!validator({ value: email, type: 'email' })) {
      Alert.alert('이메일 형식을 확인해주세요.');
      return;
    }
    if (!validator({ value: password, type: 'password' })) {
      Alert.alert('비밀번호 형식을 확인해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return;
    }

    checkEmail();
  };

  const onBlurEmail = () => {
    if (!email) {
      setIsValidatedEmail(true);
      return;
    }
    setIsValidatedEmail(validator({ value: email, type: 'email' }));
  };

  const onBlurPassword = () => {
    if (!password) {
      setIsValidatedPassword(true);
      return;
    }
    setIsValidatedPassword(validator({ value: password, type: 'password' }));
  };

  const onBlurPasswordConfirm = () => {
    if (!passwordConfirm) {
      setIsValidatedPasswordConfirm(true);
      return;
    }
    setIsValidatedPasswordConfirm(password === passwordConfirm);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.page}>
      <Header />
      <View style={styles.content}>
        <View style={styles.titleWrap}>
          <PlemText style={styles.title}>이메일과 비밀번호를</PlemText>
          <PlemText style={styles.title}>입력해 주세요.</PlemText>
        </View>
        <View style={styles.emailWrap}>
          <PlemText style={[styles.label, { color: isValidatedEmail ? '#000' : '#E40C0C' }]}>이메일</PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력해 주세요."
            wrapperProps={{ style: styles.inputWrap }}
            onBlur={onBlurEmail}
            isInvalidValue={!isValidatedEmail}
          />
          {!isValidatedEmail && <PlemText style={styles.errorText}>이메일 형식이 올바르지 않습니다.</PlemText>}
        </View>
        <View style={styles.passwordWrap}>
          <PlemText style={styles.label}>비밀번호</PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="영문, 숫자 포함 8~20자리"
            wrapperProps={{ style: styles.inputWrap }}
            secureTextEntry
            maxLength={20}
            onBlur={onBlurPassword}
            isInvalidValue={!isValidatedPassword}
          />
        </View>
        <View style={styles.passwordWrap}>
          <PlemText style={styles.label}>비밀번호 확인</PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            placeholder="영문, 숫자 포함 8~20자리"
            wrapperProps={{ style: styles.inputWrap }}
            secureTextEntry
            onBlur={onBlurPasswordConfirm}
            isInvalidValue={!isValiDatedPasswordConfirm}
          />
        </View>
      </View>
      <BottomButton title="다음" onPress={onPressNextButton} disabled={!isValidatedAccount()} />
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
  },
  titleWrap: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
  },
  emailWrap: {
    marginTop: 40,
  },
  label: {
    fontSize: 14,
  },
  input: {
    fontSize: 18,
  },
  inputWrap: {
    marginTop: 12,
  },
  passwordWrap: {
    marginTop: 32,
  },
  errorText: {
    fontSize: 14,
    color: '#E40C0C',
    marginTop: 5,
  },
});

export default SignUpPage;
