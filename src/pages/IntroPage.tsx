import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, StyleSheet, View } from 'react-native';
import { LoggedOutStackParamList } from '../../AppInner';
import PlemText from '../components/Atoms/PlemText';
import BlackButton from '../components/BlackButton';
import UnderlineText from '../components/UnderlineText';

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
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <View style={{ height: 100, backgroundColor: 'yellow' }} />
      <View style={styles.buttonContainer}>
        <BlackButton onPress={onPressTogetherButton}>
          <PlemText style={styles.togetherButtonText}>함께하기</PlemText>
        </BlackButton>
        <UnderlineText style={styles.alreadyHaveAccountText} onPress={onPressAlreadyHaveAccountButton}>
          계정이 이미 있어요
        </UnderlineText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F4F1E8',
    paddingHorizontal: 15,
  },
  logo: {
    width: 202,
    height: 60,
    marginTop: 120,
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
});

export default IntroPage;
