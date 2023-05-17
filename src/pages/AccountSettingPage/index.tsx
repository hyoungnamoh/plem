import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Header from '../../components/Header';
import { MAIN_COLOR } from '../../constants/color';
import { ACCOUNT_SETTING_PAGE_MENUES, MenuItem } from '../../constants/menu';
import { SettingTabStackParamList } from '../../tabs/SettingTab';
import MenuButton from '../../components/MenuButton';
import LabelText from '../../components/LabelText';
import PlemText from '../../components/Atoms/PlemText';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../states/loggedInUserState';

type AccountSettingPageProps = NativeStackScreenProps<SettingTabStackParamList, 'AccountSettingPage'>;

const AccountSettingPage = ({ navigation }: AccountSettingPageProps) => {
  const loggedInUser = useRecoilValue(loggedInUserState);

  const onPressMenu = (menu: MenuItem) => {
    if (!menu.value) {
      return;
    }
    navigation.navigate(menu.value);
  };

  const onPressWithdrawal = () => {};

  if (!loggedInUser) {
    return null;
  }
  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <Header title="계정 설정" />
      <View style={styles.content}>
        <LabelText label="연동된 이메일">{loggedInUser.email}</LabelText>
        <ScrollView>
          {ACCOUNT_SETTING_PAGE_MENUES.map((menu) => {
            if (menu.value === 'ModifyNickNamePage') {
              menu.label = loggedInUser.nickname;
            }
            return <MenuButton key={menu.value} item={menu} onPress={onPressMenu} />;
          })}
          <Pressable key={'withDrawal'} style={styles.withDrawalMenu} onPress={onPressWithdrawal}>
            <PlemText style={styles.withDrawalMenuTitle}>탈퇴하기</PlemText>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
  },
  content: {
    paddingHorizontal: 15,
  },
  withDrawalMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    marginTop: 84,
  },
  withDrawalMenuTitle: {
    color: '#E40C0C',
  },
});

export default AccountSettingPage;
