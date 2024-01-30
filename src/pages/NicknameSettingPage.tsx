import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useMutation } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ApiResponse } from 'types/axios';
import { signUpApi, SignUpParams, SignUpResponse } from 'api/auth/signUpApi';
import PlemText from 'components/Atoms/PlemText';
import BottomButton from 'components/BottomButton';
import Header from 'components/Header';
import UnderlineButton from 'components/UnderlineButton';
import UnderlineTextInput from 'components/UnderlineTextInput';
import { MAIN_COLOR } from 'constants/colors';
import { bottomSafeAreaState } from 'states/bottomSafeAreaState';
import { isVerifiedEmailState } from 'states/isVerifiedEmailState';
import { makeNickname } from 'utils/makeNickname';
import { LoggedOutStackParamList } from 'types/appInner';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';

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
    (body) => signUpApi(body),
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
    }
  );

  const { isLoading: signUpLoading, mutate: signUp, data } = useSignUp;

  const onPressNextButton = () => {
    if (signUpLoading) {
      return;
    }

    signUp({ email, password, nickname });
  };

  const onPressMakeNickname = () => {
    setNickname(makeNickname());
  };

  return (
    <CustomScrollView contentContainerStyle={styles.page}>
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
              <UnderlineButton style={styles.randomButton} onPress={onPressMakeNickname}>
                랜덤짓기
              </UnderlineButton>
            </View>
          </View>
        </View>
      </View>
      <BottomButton title="가입 완료하기" onPress={onPressNextButton} disabled={!canSignUp} />
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
  titleWrap: {
    marginTop: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    lineHeight: 1.28,
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
