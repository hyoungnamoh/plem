import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ApiResponse } from '../../../types/axios';
import { LoggedOutStackParamList } from '../../../AppInner';
import { signUpApi, SignUpParams, SignUpResponse } from '../../api/auth/signUpApi';
import PlemText from '../../components/Atoms/PlemText';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import UnderlineText from '../../components/UnderlineText';
import UnderlineTextInput from '../../components/UnderlineTextInput';
import { MAIN_COLOR } from '../../constants/color';
import { bottomSafeAreaState } from '../../states/bottomSafeAreaState';
import { isVerifiedEmailState } from '../../states/isVerifiedEmailState';
import { SettingTabStackParamList } from '../../tabs/SettingTab';

type ModifyNickNamePageProps = NativeStackScreenProps<SettingTabStackParamList, 'ModifyNickNamePage'>;

const ModifyNickNamePage = ({ navigation }: ModifyNickNamePageProps) => {
  const [nickname, setNickname] = useState('');

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.page}>
      <Header title="닉네임" buttonName="완료" buttonProps={{ onPress: () => Alert.alert('하이') }} />
      <View style={styles.content}>
        <View style={styles.nicknameWrap}>
          <PlemText>닉네임</PlemText>
          <View>
            <UnderlineTextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력해 주세요."
              wrapperProps={{ style: styles.inputWrap }}
            />
            <View style={styles.randomButtonWrap}>
              <UnderlineText style={styles.randomButton}>랜덤짓기</UnderlineText>
            </View>
          </View>
        </View>
      </View>
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
