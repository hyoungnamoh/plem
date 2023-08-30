import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { LoggedOutStackParamList } from '../../../AppInner';
import { ApiResponse } from '../../../types/axios';
import PlemText from '../../components/Atoms/PlemText';
import BlackButton from '../../components/BlackButton';
import Header from '../../components/Header';
import UnderlineTextInput from '../../components/UnderlineTextInput';
import { MAIN_COLOR } from '../../constants/colors';
import { bottomSafeAreaState } from '../../states/bottomSafeAreaState';

type NotReceivedMailPage = NativeStackScreenProps<LoggedOutStackParamList, 'NotReceivedMailPage'>;

const NotReceivedMailPage = ({ route, navigation }: NotReceivedMailPage) => {
  const { usePostVerificationEmail, email } = route.params;
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);

  useEffect(() => {
    setBottomSafeArea(MAIN_COLOR);
  }, []);
  const { isLoading: sendEmailLoading, mutate: sendEmail, data } = usePostVerificationEmail;

  const onPressSend = () => {
    if (sendEmailLoading) {
      return;
    }
    sendEmail({ email }, { onSuccess: () => navigation.goBack() });
  };

  return (
    <View style={styles.page}>
      <Header close />
      <View style={styles.content}>
        <View style={styles.titleWrap}>
          <PlemText style={styles.title}>인증 메일을</PlemText>
          <PlemText style={styles.title}>받지 못하셨나요?</PlemText>
        </View>
        <PlemText style={styles.checkText}>아래 사항을 확인해 보세요.</PlemText>
        <View style={styles.confirmListContainer}>
          <View style={styles.confirmList}>
            <PlemText>1. </PlemText>
            <PlemText style={styles.confirmText}>이메일을 정확히 기입했는지 확인해 주세요.</PlemText>
          </View>
          <View style={styles.confirmList}>
            <PlemText>2. </PlemText>
            <PlemText style={styles.confirmText}>스팸 메일함을 확인해 주세요.</PlemText>
          </View>
          <View style={styles.confirmList}>
            <PlemText>3. </PlemText>
            <View>
              <PlemText style={styles.confirmText}>그래도 메일 수신이 안된다면 하단의</PlemText>
              <PlemText style={styles.confirmText}>재발송 버튼을 눌러주세요.</PlemText>
            </View>
          </View>
        </View>
        <View style={styles.inquiryContainer}>
          <PlemText style={styles.inquiryText}>계속 문제가 생긴다면</PlemText>
          <PlemText style={styles.inquiryText}>plemdeveloper@gmail.com 으로 문의주세요.</PlemText>
          <PlemText style={styles.inquiryText}>빠르게 도와드릴게요!</PlemText>
        </View>
      </View>
      <View style={styles.buttonWrap}>
        <BlackButton onPress={onPressSend}>
          <PlemText style={{ color: '#fff' }}>인증 메일 재발송</PlemText>
        </BlackButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: MAIN_COLOR,
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

export default NotReceivedMailPage;
