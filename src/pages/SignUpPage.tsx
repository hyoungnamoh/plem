import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRecoilState, useSetRecoilState } from 'recoil';
import PlemText from '../components/Atoms/PlemText';
import PlemTextInput from '../components/Atoms/PlemTextInput';
import BottomButton from '../components/BottomButton';
import Header from '../components/Header';
import UnderlineTextInput from '../components/UnderLineTextInput';
import { bottomSafeAreaState } from '../states/bottomSafeAreaState';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const setbBottomSafeArea = useSetRecoilState(bottomSafeAreaState);

  useEffect(() => {
    setbBottomSafeArea('#000');
  }, []);

  const onPressNextButton = () => {
    console.log('next');
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
          />
        </View>
      </View>
      <BottomButton title="다음" onPress={onPressNextButton} />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  page: { backgroundColor: '#F4F1E8', flex: 1 },
  content: { paddingHorizontal: 15 },
  titleWrapper: { marginTop: 12 },
  title: { fontSize: 28, lineHeight: 36 },
  emailWrapper: { marginTop: 40 },
  label: { fontSize: 14 },
  input: { fontSize: 18 },
  inputWrapper: { marginTop: 12 },
  passwordWrapper: { marginTop: 32 },
});

export default SignUpPage;
