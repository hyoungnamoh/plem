import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useSetRecoilState } from 'recoil';
import PlemText from 'components/Atoms/PlemText';
import BlackButton from 'components/BlackButton';
import Header from 'components/Header';
import UnderlineButton from 'components/UnderlineButton';
import { MAIN_COLOR } from 'constants/colors';
import { bottomSafeAreaState } from 'states/bottomSafeAreaState';
import { LoggedOutStackParamList } from 'types/appInner';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';

// 안쓰는 페이지??

type EmailVerifyIntroPageProps = NativeStackScreenProps<LoggedOutStackParamList, 'EmailVerifyIntroPage'>;

const EmailVerifyIntroPage = ({ navigation, route }: EmailVerifyIntroPageProps) => {
  const { email, password, nickname } = route.params;
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);

  const onPressVerify = () => {
    // navigation.navigate('EmailVerifyPage', { email, password, nickname });
  };

  const onPressNoVerify = () => {
    // navigation.navigate('EmailVerifyIntroPage');
  };

  return (
    <CustomScrollView contentContainerStyle={styles.page}>
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
          <UnderlineButton style={styles.noVerificateButtonText} onPress={onPressNoVerify}>
            나중에 인증하기
          </UnderlineButton>
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
    lineHeight: 1.28,
  },
  descriptionWrap: {
    marginTop: 40,
  },
  description1: {
    lineHeight: 1.33,
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
