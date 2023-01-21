import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSetRecoilState } from 'recoil';
import { LoggedOutStackParamList } from '../../AppInner';
import PlemText from '../components/Atoms/PlemText';
import BlackButton from '../components/BlackButton';
import Header from '../components/Header';
import UnderlineText from '../components/UnderlineText';
import { MAIN_COLOR } from '../constants';
import { bottomSafeAreaState } from '../states/bottomSafeAreaState';

type EmailVerifyIntroPageProps = NativeStackScreenProps<LoggedOutStackParamList, 'EmailVerifyIntroPage'>;

const EmailVerifyIntroPage = ({ navigation, route }: EmailVerifyIntroPageProps) => {
  const { email, password, nickname } = route.params;
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);

  useFocusEffect(() => {
    setBottomSafeArea(MAIN_COLOR);
  });

  const onPressVerify = () => {
    // navigation.navigate('EmailVerifyPage', { email, password, nickname });
  };

  const onPressNoVerify = () => {
    // navigation.navigate('EmailVerifyIntroPage');
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.page}>
      <Header />
      <View style={styles.content}>
        <View>
          <View style={styles.titleWrap}>
            <PlemText style={styles.title}>이메일 인증하고</PlemText>
            <PlemText style={styles.title}>계정을 안전하게 지키세요!</PlemText>
          </View>
          <View style={styles.descriptionWrap}>
            <PlemText style={styles.description1}>이메일 인증이 완료되지 않으면 비밀번호 분실 시</PlemText>
            <PlemText style={styles.description1}>비밀번호 찾기가 불가능합니다.</PlemText>
            <PlemText style={styles.description2}>지금 바로 인증하러 가시겠어요?</PlemText>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <BlackButton onPress={onPressVerify}>
            <PlemText style={styles.verificateButtonText}>인증하기</PlemText>
          </BlackButton>
          <UnderlineText style={styles.noVerificateButtonText} onPress={onPressNoVerify}>
            나중에 인증하기
          </UnderlineText>
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
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: 36,
  },
  titleWrap: {
    marginTop: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
  },
  descriptionWrap: {
    marginTop: 40,
  },
  description1: {
    lineHeight: 24,
  },
  description2: {
    marginTop: 16,
  },
  verificateButtonText: {
    color: '#fff',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  noVerificateButtonText: {
    marginTop: 32,
  },
});

export default EmailVerifyIntroPage;
