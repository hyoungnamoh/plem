import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSetRecoilState } from 'recoil';
import { LoggedOutStackParamList } from '../../AppInner';
import PlemText from '../components/Atoms/PlemText';
import BottomButton from '../components/BottomButton';
import Header from '../components/Header';
import UnderlineTextInput from '../components/UnderlineTextInput';
import { bottomSafeAreaState } from '../states/bottomSafeAreaState';

type NicknameSettingPageProps = NativeStackScreenProps<LoggedOutStackParamList, 'NicknameSettingPage'>;

const NicknameSettingPage = ({ navigation, route }: NicknameSettingPageProps) => {
  const { email, password } = route.params;
  const [nickname, setNickname] = useState('');

  const onPressNextButton = () => {
    navigation.navigate('EmailVerifyIntroPage', { email, password, nickname });
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.page}>
      <Header />
      <View style={styles.content}>
        <View style={styles.titleWrap}>
          <PlemText style={styles.title}>플렘에서 사용할</PlemText>
          <PlemText style={styles.title}>닉네임을 입력해 주세요.</PlemText>
        </View>
        <View style={styles.nicknameWrap}>
          <PlemText>닉네임</PlemText>
          <UnderlineTextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해 주세요."
            wrapperProps={{ style: styles.inputWrap }}
          />
        </View>
      </View>
      <BottomButton title="다음" onPress={onPressNextButton} disabled={false} />
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
  nicknameWrap: {
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
});

export default NicknameSettingPage;
