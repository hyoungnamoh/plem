import { Alert, Dimensions, Pressable, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import Header from 'components/Header';
import { DropdownWithLabel } from 'components/DropdownWithLabel';
import { useState } from 'react';
import { DropdownItem } from 'components/Dropdown';
import UnderlineTextInput from 'components/UnderlineTextInput';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import WithDrawalButton from 'assets/images/with_drawal_button.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { phoneTokenState } from 'states/phoneTokenState';
import { loggedInUserState } from 'states/loggedInUserState';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDeleteUser } from 'hooks/mutations/useDeleteUser';

type DirectInquiryPageProps = NativeStackScreenProps<SettingTabStackParamList, 'WithdrawalPage'>;

const WithdrawalPage = ({ navigation }: DirectInquiryPageProps) => {
  const setPhoneToken = useSetRecoilState(phoneTokenState);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [openReasonDropdown, setOpenReasonDropdown] = useState(false);
  const [selectedReason, setSelectedReason] = useState<DropdownItem>({ label: '기타 (직접 입력)', value: 'etc' });
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: deleteUser } = useDeleteUser({
    onError: () => {
      console.log('??');
    },
  });

  const handleReasonChange = (selectedItem: DropdownItem) => {
    setSelectedReason(selectedItem);
  };

  const handleReasonDropdownOpen = () => {
    setOpenReasonDropdown((prev) => !prev);
  };

  const handleInquiryButton = () => {
    navigation.navigate('DirectInquiryPage');
  };

  const handleWithdrwalButton = () => {
    // if (!password) {
    //   Alert.alert('비밀번호를 입력해주세요.');
    //   return;
    // }
    if (!loggedInUser) {
      Alert.alert('문제가 발생했습니다.\n로그아웃 후 재시도 해주세요.');
      return;
    }
    Alert.alert('계정 삭제 시 모든 데이터는 복구할 수 없어요. 정말 삭제하시겠어요?', '', [
      {
        text: '다시 생각해볼게요.',
        onPress: async () => {},
        style: 'cancel',
      },
      {
        text: '네',
        onPress: async () => {
          deleteUser({ password: '123123qq' });
          return;
          // navigation.navigate('MainTab', { screen: 'HomeTab' });
        },
      },
    ]);
  };

  const clearAllUserData = async () => {
    await AsyncStorage.clear();
    await EncryptedStorage.clear();
    setLoggedInUser(null);
    setPhoneToken('');
  };

  return (
    <View style={{ height: '100%' }}>
      <Header close title="계정 삭제하기" />
      <View style={{ padding: 16, height: '100%', position: 'relative' }}>
        <PlemText style={{ fontSize: 28 }}>조금 아쉽지만,</PlemText>
        <PlemText style={{ fontSize: 28 }}>플렘은 모든 계획을 응원합니다!</PlemText>
        <View style={{ marginTop: 16 }}>
          <PlemText style={{ color: '#444444', lineHeight: 1.22 }}>
            {'다시 돌아오고 싶은 서비스가 되도록\n계속 발전하겠습니다.'}
          </PlemText>
        </View>
        <View style={{ marginTop: 40 }}>
          <DropdownWithLabel
            label="탈퇴사유"
            list={[{ label: '기타 (직접 입력)', value: 'etc' }]}
            onChange={handleReasonChange}
            onPressRow={handleReasonDropdownOpen}
            open={openReasonDropdown}
            value={selectedReason}
          />
          <UnderlineTextInput
            style={{ marginTop: 20 }}
            onChangeText={setReason}
            value={reason}
            placeholder="서비스 개선을 위해 탈퇴 사유를 작성해 주세요."
          />
          <View style={{ marginTop: 32 }}>
            <PlemText style={{ color: '#444444', lineHeight: 1.44 }}>{'잠깐! 플렘은 소통에 진심입니다.'}</PlemText>
            <Pressable onPress={handleInquiryButton} style={{ alignSelf: 'flex-start' }}>
              <PlemText
                style={{
                  color: '#444444',
                  lineHeight: 1.44,
                  textDecorationLine: 'underline',
                }}>
                1:1 문의하기
              </PlemText>
            </Pressable>
          </View>
        </View>
        <View style={{ alignItems: 'center', position: 'absolute', bottom: 90, left: 16 }}>
          <Pressable onPress={handleWithdrwalButton}>
            <WithDrawalButton preserveAspectRatio="none" width={Dimensions.get('window').width - 32} />
          </Pressable>
          <Pressable onPress={navigation.goBack}>
            <PlemText style={{ marginTop: 32, textDecorationLine: 'underline' }}>머무를게요!</PlemText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default WithdrawalPage;
