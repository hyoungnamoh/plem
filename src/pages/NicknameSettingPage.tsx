import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { LoggedOutStackParamList } from '../../AppInner';
import { ApiResponse } from '../../types/axios';
import { signUpApi, SignUpParams, SignUpResponse } from '../api/auth/signUpApi';
import PlemText from '../components/Atoms/PlemText';
import BottomButton from '../components/BottomButton';
import Header from '../components/Header';
import UnderlineText from '../components/UnderlineText';
import UnderlineTextInput from '../components/UnderlineTextInput';
import { bottomSafeAreaState } from '../states/bottomSafeAreaState';
import { isVerifiedEmailState } from '../states/isVerifiedEmailState';

type NicknameSettingPageProps = NativeStackScreenProps<LoggedOutStackParamList, 'NicknameSettingPage'>;

const NicknameSettingPage = ({ navigation, route }: NicknameSettingPageProps) => {
  const { email, password } = route.params;
  const [isVerifiedEmail, setIsVerifiedEmail] = useRecoilState(isVerifiedEmailState);
  const setBottomSafeArea = useSetRecoilState(bottomSafeAreaState);

  const [nickname, setNickname] = useState('');

  const canSignUp = email && password && nickname && isVerifiedEmail;

  useEffect(() => {
    if (canSignUp) {
      setBottomSafeArea('#000');
    } else {
      setBottomSafeArea('#AAAAAA');
    }
  }, [email, password, nickname, isVerifiedEmail]);

  useFocusEffect(() => {
    if (canSignUp) {
      setBottomSafeArea('#000');
    } else {
      setBottomSafeArea('#AAAAAA');
    }
  });

  const useSignUp = useMutation<ApiResponse<SignUpResponse>, AxiosError, SignUpParams>(
    'useSignUp',
    ({ email }) => signUpApi({ email, password, nickname }),
    {
      onSuccess: async (responseData, variables, context) => {
        if (responseData.status === 200) {
          setIsVerifiedEmail(false);
          navigation.navigate('SignUpSuccessPage', { nickname });
        } else if (responseData.data) {
          Alert.alert(responseData.data);
        } else {
          Alert.alert('알 수 없는 오류가 발생했어요 ;ㅂ;');
          console.info('useSignUp: ', responseData);
        }
      },
      onError: (error, variable, context) => {
        Alert.alert('알 수 없는 오류가 발생했어요 ;ㅂ;');
        console.info(error.name + ': ', error.message);
      },
    }
  );

  const { isLoading: signUpLoading, mutate: signUp, data } = useSignUp;

  const onPressNextButton = () => {
    if (signUpLoading) {
      return;
    }

    signUp({ email, password, nickname });
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
      <BottomButton title="가입 완료하기" onPress={onPressNextButton} disabled={!canSignUp} />
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
    marginTop: 20,
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

export default NicknameSettingPage;
