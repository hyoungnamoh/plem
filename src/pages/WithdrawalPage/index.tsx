import { Alert, StyleSheet, TextInput, TouchableNativeFeedback, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import Header from 'components/Header';
import { DropdownWithLabel } from 'components/DropdownWithLabel';
import { useRef, useState } from 'react';
import { DropdownItem } from 'components/Dropdown';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import WithDrawalButton from 'assets/images/with_drawal_button.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { phoneTokenState } from 'states/phoneTokenState';
import { loggedInUserState } from 'states/loggedInUserState';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDeleteUser } from 'hooks/mutations/useDeleteUser';
import PlemButton from 'components/Atoms/PlemButton';
import { WITHDRAWAL_REASON_LIST } from './constants';
import WithdrawalConfirmAlert from './WithdrawalConfirmAlert';
import { WithdrawalReason } from 'api/users/deleteUserApi';
import WhiteBoard from 'assets/images/white_board.svg';
import PlemTextInput from 'components/Atoms/PlemTextInput';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';
import dayjs from 'dayjs';
import { useQueryClient } from 'react-query';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type DirectInquiryPageProps = NativeStackScreenProps<SettingTabStackParamList, 'WithdrawalPage'>;

const WithdrawalPage = ({ navigation }: DirectInquiryPageProps) => {
  const queryClient = useQueryClient();
  const setPhoneToken = useSetRecoilState(phoneTokenState);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [openReasonDropdown, setOpenReasonDropdown] = useState(false);
  const [selectedReason, setSelectedReason] = useState<DropdownItem<WithdrawalReason | ''>>(WITHDRAWAL_REASON_LIST[0]);
  const [reason, setReason] = useState('');
  const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
  const reasonRef = useRef<TextInput>(null);

  const { mutate: deleteUser } = useDeleteUser({
    onSuccess: () => {
      clearAllUserData();
      // navigation.navigate('MainTab', { screen: 'HomeTab' });
    },
  });

  const handleReasonChange = (selectedItem: DropdownItem<WithdrawalReason | ''>) => {
    setSelectedReason(selectedItem);
    setOpenReasonDropdown(false);
  };

  const handleReasonDropdownOpen = () => {
    setOpenReasonDropdown((prev) => !prev);
  };

  const handleInquiryButton = () => {
    navigation.navigate('DirectInquiryPage');
  };

  const handleWithdrwalButton = () => {
    if (!loggedInUser) {
      Alert.alert('문제가 발생했습니다.\n로그아웃 후 재시도 해주세요.');
      return;
    }
    if (selectedReason.value === '') {
      Alert.alert('탈퇴 사유를 선택해주세요.');
      return;
    }
    if (selectedReason.value === 'etc' && reason === '') {
      Alert.alert('탈퇴 사유를 작성해주세요.');
      return;
    }
    setOpenConfirmAlert(true);
  };

  const clearAllUserData = async () => {
    await AsyncStorage.clear();
    await EncryptedStorage.clear();
    const accessDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await AsyncStorage.setItem('lastAccess', accessDate);
    setLoggedInUser(null);
    setPhoneToken('');
    queryClient.clear();
  };

  const closeConfirmAlert = () => {
    setOpenConfirmAlert(false);
  };

  const handleWithdrawalConfirm = () => {
    deleteUser({ type: selectedReason.value, reason });
  };

  const closeWithdrawalDropdown = () => {
    setOpenReasonDropdown(false);
  };

  return (
    <>
      <TouchableNativeFeedback onPress={closeWithdrawalDropdown}>
        <KeyboardAwareScrollView>
          <Header close title="계정 삭제하기" />
          <CustomScrollView contentContainerStyle={styles.page}>
            <View style={{ padding: 16, height: '100%', position: 'relative' }}>
              <PlemText style={{ fontSize: 28 }}>조금 아쉽지만,</PlemText>
              <PlemText style={{ fontSize: 28 }}>플렘은 모든 계획을 응원합니다!</PlemText>
              <View style={{ marginTop: 40 }}>
                <DropdownWithLabel<WithdrawalReason | ''>
                  label="탈퇴사유"
                  list={WITHDRAWAL_REASON_LIST}
                  onChange={handleReasonChange}
                  onPressRow={handleReasonDropdownOpen}
                  open={openReasonDropdown}
                  value={selectedReason}
                />
                <PlemButton onPress={() => reasonRef.current?.focus()} style={{ marginTop: 12 }}>
                  <WhiteBoard preserveAspectRatio="none" width={'100%'} height={180} />
                  <View style={{ position: 'absolute', padding: 12, height: 180 }}>
                    <PlemTextInput
                      ref={reasonRef}
                      value={reason}
                      onChangeText={setReason}
                      placeholder="서비스 개선을 위해 탈퇴 사유를 작성해 주세요."
                      multiline={true}
                      maxLength={500}
                    />
                  </View>
                </PlemButton>
                <View style={{ marginTop: 24 }}>
                  <PlemText style={{ color: '#444444', lineHeight: 1.44 }}>
                    {'잠깐! 플렘은 소통에 진심입니다.'}
                  </PlemText>
                  <PlemButton onPress={handleInquiryButton} style={{ alignSelf: 'flex-start' }}>
                    <PlemText
                      style={{
                        color: '#444444',
                        lineHeight: 1.44,
                        textDecorationLine: 'underline',
                      }}>
                      1:1 문의하기
                    </PlemText>
                  </PlemButton>
                </View>
              </View>
              <View style={{ alignItems: 'center', marginTop: 60 }}>
                <PlemText style={{ color: '#444444' }}>
                  계정 삭제 시 모든 데이터가 삭제되며, 동일 이메일로 재가입이 불가능합니다.
                </PlemText>
                <PlemButton onPress={handleWithdrwalButton} style={{ width: '100%', marginTop: 32 }}>
                  <WithDrawalButton preserveAspectRatio="none" width={'100%'} />
                </PlemButton>
                <PlemButton onPress={navigation.goBack}>
                  <PlemText style={{ marginTop: 32, textDecorationLine: 'underline' }}>머무를게요!</PlemText>
                </PlemButton>
              </View>
            </View>
          </CustomScrollView>
        </KeyboardAwareScrollView>
      </TouchableNativeFeedback>
      <WithdrawalConfirmAlert
        open={openConfirmAlert}
        onCancel={closeConfirmAlert}
        onConfirm={handleWithdrawalConfirm}
        cancelText="머무를게요"
        confirmText="계정 삭제"
        confirmTextStyle={{ color: '#E40C0C' }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  page: {
    paddingBottom: 100,
  },
});

export default WithdrawalPage;
