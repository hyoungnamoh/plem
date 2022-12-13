import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { LoggedOutStackParamList } from '../../AppInner';
import { ApiResponse, SuccessResponse } from '../../types/axios';
import { checkDuplicateEmailApi } from '../api/auth/checkDuplicateEmailApi';
import PlemText from '../components/Atoms/PlemText';
import BottomButton from '../components/BottomButton';
import Header from '../components/Header';
import UnderlineText from '../components/UnderlineText';
import UnderlineTextInput from '../components/UnderlineTextInput';
import { validator } from '../helper/validator';
import { bottomSafeAreaState } from '../states/bottomSafeAreaState';

type PasswordSettingPage = NativeStackScreenProps<LoggedOutStackParamList, 'PasswordSettingPage'>;

const PasswordSettingPage = ({ navigation, route }: PasswordSettingPage) => {
  const { email } = route.params;
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);

  const [password, setPassword] = useState('123123qq');
  const [passwordConfirm, setPasswordConfirm] = useState('123123qq');
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isInvalidPasswordConfirm, setIsInvalidPasswordConfirm] = useState(false);

  const hasEmptyValue = !password || !passwordConfirm;

  const isInvalidAccount = () => {
    return isInvalidPassword || isInvalidPasswordConfirm || hasEmptyValue;
  };

  const onPressNextButton = () => {
    if (!validator({ value: password, type: 'password' })) {
      Alert.alert('비밀번호 형식을 확인해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return;
    }
    navigation.navigate('NicknameSettingPage', { email, password });
  };

  const onChangePassword = (value: string) => {
    setPassword(value);
    if (!value) {
      setIsInvalidPassword(false);
      return;
    }
    setIsInvalidPassword(!validator({ value, type: 'password' }));
  };

  const onChangePasswordConfirm = (value: string) => {
    setPasswordConfirm(value);
    if (!value) {
      setIsInvalidPasswordConfirm(false);
      return;
    }
    setIsInvalidPasswordConfirm(value !== password);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.page}>
      <Header />
      <View style={styles.content}>
        <View style={styles.titleWrap}>
          <PlemText style={styles.title}>플렘에서 사용할</PlemText>
          <PlemText style={styles.title}>비밀번호를 설정하세요.</PlemText>
        </View>
        <View style={styles.passwordWrap}>
          <PlemText style={styles.label}>비밀번호</PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={password}
            onChangeText={onChangePassword}
            placeholder="영문, 숫자 포함 8~20자리"
            wrapperProps={{ style: styles.inputWrap }}
            secureTextEntry
            maxLength={20}
            isInvalidValue={isInvalidPassword}
          />
          {isInvalidPassword && <PlemText style={styles.errorText}>비밀번호 형식이 올바르지 않습니다.</PlemText>}
        </View>
        <View style={styles.passwordWrap}>
          <PlemText style={styles.label}>비밀번호 확인</PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={passwordConfirm}
            onChangeText={onChangePasswordConfirm}
            placeholder="영문, 숫자 포함 8~20자리"
            wrapperProps={{ style: styles.inputWrap }}
            secureTextEntry
            isInvalidValue={isInvalidPasswordConfirm}
          />
          {isInvalidPasswordConfirm && <PlemText style={styles.errorText}>비밀번호가 일치하지 않습니다.</PlemText>}
        </View>
      </View>
      <BottomButton title="다음" onPress={onPressNextButton} disabled={isInvalidAccount()} />
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
    marginTop: 20,
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
    marginTop: 40,
  },
  errorText: {
    fontSize: 14,
    color: '#E40C0C',
    marginTop: 5,
  },
});

export default PasswordSettingPage;