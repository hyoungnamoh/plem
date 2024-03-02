import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Header from 'components/Header';
import LabelInput from 'components/LabelInput';
import { MAIN_COLOR } from 'constants/colors';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import BottomButton from 'components/BottomButton';
import { validator } from 'helper/validator';
import PlemText from 'components/Atoms/PlemText';
import { useUpdatePassword } from 'hooks/mutations/useUpdatePassword';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { loggedInUserState } from 'states/loggedInUserState';
import UnderlineButton from 'components/UnderlineButton';
import { globalToastState } from 'states/globalToastState';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';

type ModifyPasswordPageProps = NativeStackScreenProps<SettingTabStackParamList, 'ModifyPasswordPage'>;

const ModifyPasswordPage = ({ navigation }: ModifyPasswordPageProps) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const setGlobalToast = useSetRecoilState(globalToastState);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isInvalidCurrentPassword, setIsInvalidCurrentPassword] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isInvalidPasswordConfirm, setIsInvalidPasswordConfirm] = useState(false);
  const isCurrentPassword = !isInvalidCurrentPassword && !!currentPassword && currentPassword === newPassword;

  const hasEmptyValue = !currentPassword || !newPassword || !newPasswordConfirm;

  const { mutate: updatePassword } = useUpdatePassword({
    onSuccess: async (responseData) => {
      if (responseData.status === 200) {
        setGlobalToast({ text: '비밀번호 재설정이 완료되었습니다.', duration: 2000 });
        navigation.goBack();
      } else if (responseData.data) {
        Alert.alert(responseData.data);
      }
    },
  });

  const isInvalidAccount = () => {
    return (
      isInvalidCurrentPassword || isInvalidPassword || isInvalidPasswordConfirm || hasEmptyValue || isCurrentPassword
    );
  };

  const handleNextButton = () => {
    if (!loggedInUser) {
      return;
    }
    if (
      !validator({ value: newPassword, type: 'password' }) ||
      !validator({ value: currentPassword, type: 'password' })
    ) {
      Alert.alert('비밀번호 형식을 확인해주세요.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      Alert.alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return;
    }
    updatePassword({ email: loggedInUser.email, newPassword, currentPassword });
  };

  const onChangeCurrentPassword = (value: string) => {
    setCurrentPassword(value);
    if (!value) {
      setIsInvalidCurrentPassword(false);
      return;
    }
    setIsInvalidCurrentPassword(!validator({ value, type: 'password' }));
  };

  const onChangeNewPassword = (value: string) => {
    setNewPassword(value);
    if (!value) {
      setIsInvalidPassword(false);
      return;
    }
    setIsInvalidPassword(!validator({ value, type: 'password' }));
  };

  const onChangeNewPasswordConfirm = (value: string) => {
    setNewPasswordConfirm(value);
    if (!value) {
      setIsInvalidPasswordConfirm(false);
      return;
    }
    setIsInvalidPasswordConfirm(value !== newPassword);
  };

  const onPressFindAccount = () => {
    navigation.navigate('FindPasswordPage', { from: 'ModifyPasswordPage' });
  };

  return (
    <>
      <CustomScrollView>
        <Header title="비밀번호 변경" />
        <View style={styles.content}>
          <View style={{ marginTop: 20 }}>
            <LabelInput
              value={currentPassword}
              onChangeText={onChangeCurrentPassword}
              label="현재 비밀번호"
              placeholder="영문, 숫자 포함 8-20자리"
              secureTextEntry
              maxLength={20}
              isInvalidValue={isInvalidCurrentPassword}
            />
          </View>
          {isInvalidCurrentPassword && <PlemText style={styles.errorText}>비밀번호 형식이 올바르지 않습니다.</PlemText>}
          <View style={{ marginTop: 32 }}>
            <LabelInput
              value={newPassword}
              onChangeText={onChangeNewPassword}
              label="새로운 비밀번호"
              placeholder="영문, 숫자 포함 8-20자리"
              secureTextEntry
              maxLength={20}
              isInvalidValue={isInvalidPassword}
            />
          </View>
          {isInvalidPassword && <PlemText style={styles.errorText}>비밀번호 형식이 올바르지 않습니다.</PlemText>}
          {isCurrentPassword && <PlemText style={styles.errorText}>현재 사용 중인 비밀번호입니다.</PlemText>}
          <View style={{ marginTop: 32 }}>
            <LabelInput
              value={newPasswordConfirm}
              onChangeText={onChangeNewPasswordConfirm}
              label="새로운 비밀번호 확인"
              placeholder="영문, 숫자 포함 8-20자리"
              secureTextEntry
              maxLength={20}
              isInvalidValue={isInvalidPasswordConfirm}
            />
          </View>
          {isInvalidPasswordConfirm && <PlemText style={styles.errorText}>비밀번호가 일치하지 않습니다.</PlemText>}
          <UnderlineButton style={styles.fintPassword} onPress={onPressFindAccount}>
            비밀번호가 생각나지 않으시나요?
          </UnderlineButton>
        </View>
      </CustomScrollView>
      <BottomButton title="변경" onPress={handleNextButton} disabled={isInvalidAccount()} />
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
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
    color: '#E40C0C',
    marginTop: 5,
  },
  fintPassword: {
    marginTop: 40,
    alignSelf: 'center',
  },
});

export default ModifyPasswordPage;
