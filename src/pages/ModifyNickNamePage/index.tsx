import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';
import PlemText from 'components/Atoms/PlemText';
import Header from 'components/Header';
import UnderlineButton from 'components/UnderlineButton';
import UnderlineTextInput from 'components/UnderlineTextInput';
import { MAIN_COLOR } from 'constants/colors';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import { loggedInUserState } from 'states/loggedInUserState';
import { useUpdateNickname } from 'hooks/mutations/useUpdateNickname';
import jwt_decode from 'jwt-decode';
import EncryptedStorage from 'react-native-encrypted-storage';
import { LoggedInUser } from 'types/user';
import { makeNickname } from 'utils/makeNickname';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';

type ModifyNickNamePageProps = NativeStackScreenProps<SettingTabStackParamList, 'ModifyNickNamePage'>;

const ModifyNickNamePage = ({ navigation }: ModifyNickNamePageProps) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [nickname, setNickname] = useState(loggedInUser?.nickname || '');

  const { mutate: updateNickname } = useUpdateNickname({
    onSuccess: async ({ success, data }) => {
      if (!success) {
        Alert.alert(data);
        return;
      }
      await EncryptedStorage.setItem('refreshToken', data.refreshToken);
      await EncryptedStorage.setItem('accessToken', data.accessToken);
      const user = jwt_decode<LoggedInUser>(data.accessToken);
      setLoggedInUser(user);
      navigation.goBack();
    },
  });

  const onPressComplete = () => {
    if (loggedInUser?.nickname === nickname) {
      Alert.alert('기존 닉네임과 동일합니다.');
      return;
    }
    updateNickname({ nickname });
  };

  const onPressMakeNickname = () => {
    setNickname(makeNickname());
  };

  const isInvalidNickname = nickname.length < 2 || nickname.length > 12 || nickname === loggedInUser?.nickname;

  if (!loggedInUser) {
    return null;
  }
  return (
    <CustomScrollView contentContainerStyle={styles.page}>
      <Header
        title="닉네임"
        buttonName="완료"
        buttonProps={{ onPress: () => onPressComplete(), disabled: isInvalidNickname }}
      />
      <View style={styles.content}>
        <View style={styles.nicknameWrap}>
          <PlemText>닉네임</PlemText>
          <View>
            <UnderlineTextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력해 주세요. 2-12자리"
              maxLength={12}
              wrapperProps={{ style: styles.inputWrap }}
            />
            <View style={styles.randomButtonWrap}>
              <UnderlineButton style={styles.randomButton} onPress={onPressMakeNickname}>
                랜덤짓기
              </UnderlineButton>
            </View>
          </View>
        </View>
      </View>
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
  nicknameWrap: {
    marginTop: 20,
  },
  input: {
    fontSize: 18,
    width: '80%',
  },
  inputWrap: {
    marginTop: 12,
  },
  randomButtonWrap: {
    position: 'absolute',
    marginTop: 12,
    right: 0,
  },
  randomButton: {
    fontSize: 16,
  },
});

export default ModifyNickNamePage;
