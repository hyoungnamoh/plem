import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { LoggedOutStackParamList } from '../../../AppInner';
import { ApiResponse } from '../../../types/axios';
import PlemText from '../../components/Atoms/PlemText';
import BlackButton from '../../components/BlackButton';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import UnderlineTextInput from '../../components/UnderlineTextInput';
import { bottomSafeAreaState } from '../../states/bottomSafeAreaState';
import StartPlemButtonTitle from './StartPlemButtonTitle';

type SignUpSuccessPage = NativeStackScreenProps<LoggedOutStackParamList, 'SignUpSuccessPage'>;

const SignUpSuccessPage = ({ route, navigation }: SignUpSuccessPage) => {
  const { nickname } = route.params;
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);

  useEffect(() => {
    setBottomSafeArea('#000');
  }, []);

  const onPressStart = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'IntroPage' }, { name: 'LoginPage', params: { from: 'SignUpSuccessPage' } }],
    });
  };

  const onPressClose = () => {
    navigation.reset({ index: 0, routes: [{ name: 'IntroPage' }] });
  };

  return (
    <View style={styles.page}>
      <Header close onBack={onPressClose} />
      <View style={styles.content}>
        <View style={styles.titleWrap}>
          <PlemText style={styles.title}>{nickname}님!</PlemText>
          <PlemText style={styles.title}>회원가입을 축하합니다.</PlemText>
        </View>
      </View>
      <BottomButton onPress={onPressStart} title={<StartPlemButtonTitle />} />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F4F1E8',
    flex: 1,
    paddingBottom: 36,
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
    paddingBottom: 36,
  },
  titleWrap: {
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
  },
  confirmListContainer: {
    marginTop: 16,
  },
  confirmList: {
    flexDirection: 'row',
    marginTop: 20,
  },
  confirmText: {
    lineHeight: 24,
  },
  buttonWrap: {
    paddingHorizontal: 15,
  },
  inquiryContainer: {
    marginTop: 20,
  },
  inquiryText: {
    color: '#444444',
    lineHeight: 22,
  },
  checkText: {
    marginTop: 16,
    color: '#888888',
  },
});

export default SignUpSuccessPage;
