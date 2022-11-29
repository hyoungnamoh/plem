import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { SuccessResponse } from '../../types/axios';
import { checkDuplicateEmail } from '../api/users/checkDuplicateEmail';
import PlemText from '../components/Atoms/PlemText';
import BottomButton from '../components/BottomButton';
import Header from '../components/Header';
import UnderlineTextInput from '../components/UnderlineTextInput';
import { validator } from '../helper/validator';
import { bottomSafeAreaState } from '../states/bottomSafeAreaState';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const setbBottomSafeArea = useSetRecoilState(bottomSafeAreaState);

  useEffect(() => {
    setbBottomSafeArea('#000');
  }, []);

  const { data, refetch: checkEmail } = useQuery<SuccessResponse<boolean>>(
    ['checkDuplicateEmail', username],
    () => checkDuplicateEmail({ email: username }),
    { enabled: false }
  );

  const onPressNextButton = () => {
    if (!validator({ value: username, type: 'email' })) {
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

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.page}>
      <Header />
      <View style={styles.content}>
        <View style={styles.titleWrapper}>
          <PlemText style={styles.title}>이메일과 비밀번호를</PlemText>
          <PlemText style={styles.title}>입력해 주세요.</PlemText>
        </View>
        <View style={styles.emailWrapper}>
          <PlemText style={styles.label}>이메일</PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="이메일을 입력해 주세요."
            wrapperProps={{ style: styles.inputWrapper }}
          />
        </View>
        <View style={styles.passwordWrapper}>
          <PlemText style={styles.label}>비밀번호</PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="영문, 숫자 포함 8~20자리"
            wrapperProps={{ style: styles.inputWrapper }}
            secureTextEntry
            maxLength={20}
          />
        </View>
        <View style={styles.passwordWrapper}>
          <PlemText style={styles.label}>비밀번호 확인</PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            placeholder="영문, 숫자 포함 8~20자리"
            wrapperProps={{ style: styles.inputWrapper }}
            secureTextEntry
          />
        </View>
      </View>
      <BottomButton title="다음" onPress={onPressNextButton} />
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
  titleWrapper: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
  },
  emailWrapper: {
    marginTop: 40,
  },
  label: {
    fontSize: 14,
  },
  input: {
    fontSize: 18,
  },
  inputWrapper: {
    marginTop: 12,
  },
  passwordWrapper: {
    marginTop: 32,
  },
});

export default SignUpPage;
