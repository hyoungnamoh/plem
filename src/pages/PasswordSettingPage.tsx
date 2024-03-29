import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import BottomButton from 'components/BottomButton';
import Header from 'components/Header';
import UnderlineTextInput from 'components/UnderlineTextInput';
import { MAIN_COLOR } from 'constants/colors';
import { validator } from 'helper/validator';
import { LoggedOutStackParamList } from 'types/appInner';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';
import { useInitPassword } from 'hooks/mutations/useInitPassword';
import { useSetRecoilState } from 'recoil';
import { globalToastState } from 'states/globalToastState';

type PasswordSettingPage = NativeStackScreenProps<LoggedOutStackParamList, 'PasswordSettingPage'>;

const PasswordSettingPage = ({ navigation, route }: PasswordSettingPage) => {
  const { email, isFindingPassword } = route.params;
  const setGlobalToast = useSetRecoilState(globalToastState);
  const { mutate: updatePassword } = useInitPassword({
    onSuccess: async (responseData) => {
      if (responseData.status === 200) {
        setGlobalToast({ text: '비밀번호 재설정이 완료되었습니다.', duration: 2000 });
        if (route.params.from === 'ModifyPasswordPage') {
          navigation.pop(3);
          return;
        }
        navigation.popToTop();
        navigation.push('LoginPage');
      } else if (responseData.data) {
        Alert.alert(responseData.data);
      }
    },
  });

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isInvalidPasswordConfirm, setIsInvalidPasswordConfirm] = useState(false);

  const hasEmptyValue = !password || !passwordConfirm;

  const isInvalidAccount = () => {
    return isInvalidPassword || isInvalidPasswordConfirm || hasEmptyValue;
  };

  const passwordValidate = () => {
    if (!validator({ value: password, type: 'password' })) {
      Alert.alert('비밀번호 형식을 확인해주세요.');
      return false;
    }
    if (password !== passwordConfirm) {
      Alert.alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return false;
    }

    return true;
  };

  const onPressNextButton = () => {
    if (!passwordValidate()) {
      return;
    }
    navigation.navigate('NicknameSettingPage', { email, password });
  };

  const onPressCompleteButton = () => {
    if (!passwordValidate()) {
      return;
    }
    updatePassword({ email, password });
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
    <CustomScrollView contentContainerStyle={styles.page}>
      <Header />
      <View style={styles.content}>
        <View style={styles.titleWrap}>
          <PlemText style={styles.title}>플렘에서 사용할</PlemText>
          <PlemText style={styles.title}>비밀번호를 설정하세요.</PlemText>
        </View>
        <View style={styles.passwordWrap}>
          <PlemText style={[styles.label, isInvalidPassword ? styles.errorTextColor : null]}>비밀번호</PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={password}
            onChangeText={onChangePassword}
            placeholder="영문, 숫자 포함 8-20자리"
            wrapperProps={{ style: styles.inputWrap }}
            secureTextEntry
            maxLength={20}
            isInvalidValue={isInvalidPassword}
          />
          {isInvalidPassword && (
            <PlemText style={[styles.errorText, styles.errorTextColor]}>비밀번호 형식이 올바르지 않습니다.</PlemText>
          )}
        </View>
        <View style={styles.passwordWrap}>
          <PlemText style={[styles.label, isInvalidPasswordConfirm ? styles.errorTextColor : null]}>
            비밀번호 확인
          </PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={passwordConfirm}
            onChangeText={onChangePasswordConfirm}
            placeholder="영문, 숫자 포함 8-20자리"
            wrapperProps={{ style: styles.inputWrap }}
            secureTextEntry
            maxLength={20}
            isInvalidValue={isInvalidPasswordConfirm}
          />
          {isInvalidPasswordConfirm && (
            <PlemText style={[styles.errorText, styles.errorTextColor]}>비밀번호가 일치하지 않습니다.</PlemText>
          )}
        </View>
      </View>
      <BottomButton
        title={isFindingPassword ? '재설정 완료하기' : '다음'}
        onPress={isFindingPassword ? onPressCompleteButton : onPressNextButton}
        disabled={isInvalidAccount()}
      />
    </CustomScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: MAIN_COLOR,
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
    lineHeight: 1.28,
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
    marginTop: 5,
  },
  errorTextColor: {
    color: '#E40C0C',
  },
});

export default PasswordSettingPage;
