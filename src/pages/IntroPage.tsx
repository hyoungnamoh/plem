import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import BlackButton from 'components/BlackButton';
import UnderlineButton from 'components/UnderlineButton';
import { MAIN_COLOR } from 'constants/colors';
import { LoggedOutStackParamList } from 'types/appInner';
import IntroLogoSvg from 'assets/images/intro_logo_202x60.svg';

type IntroPageProps = NativeStackScreenProps<LoggedOutStackParamList, 'IntroPage'>;

const IntroPage = ({ navigation }: IntroPageProps) => {
  const onPressTogetherButton = () => {
    navigation.navigate('EmailVerifyPage');
  };

  const onPressAlreadyHaveAccountButton = () => {
    navigation.navigate('LoginPage');
  };

  return (
    <View style={styles.page}>
      <View>
        <IntroLogoSvg style={styles.logo} />
        <PlemText style={styles.descriptionText}>{'계획대로 흘러가는\n온전한 하루'}</PlemText>
      </View>
      <View style={styles.buttonContainer}>
        <BlackButton onPress={onPressTogetherButton}>
          <PlemText style={styles.togetherButtonText}>함께하기</PlemText>
        </BlackButton>
        <UnderlineButton style={styles.alreadyHaveAccountText} onPress={onPressAlreadyHaveAccountButton}>
          계정이 이미 있어요
        </UnderlineButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    paddingBottom: 36,
  },
  logo: {
    width: 202,
    height: 60,
    marginTop: 156,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  togetherButtonText: {
    color: '#fff',
  },
  alreadyHaveAccountText: {
    marginTop: 32,
  },
  descriptionText: {
    fontSize: 28,
    marginTop: 24,
  },
  logoContainer: {},
});

export default IntroPage;
