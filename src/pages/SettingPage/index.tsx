import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import { MAIN_COLOR } from 'constants/colors';
import { MenuItem, SETTING_PAGE_MENUS } from 'constants/menus';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import MenuButton from 'components/MenuButton';
import { useRecoilState } from 'recoil';
import { loggedInUserState } from 'states/loggedInUserState';
import { useLogout } from 'hooks/mutations/useLogout';
import EncryptedStorage from 'react-native-encrypted-storage';
import { phoneTokenState } from 'states/phoneTokenState';
import UnderlineSvg from 'assets/images/underline.svg';
import { useQueryClient } from 'react-query';
import { logEvent } from 'helper/analytics';
import SharedDefaults from 'widgets/SharedDefaults';

type SettingPageProps = NativeStackScreenProps<SettingTabStackParamList, 'SettingPage'>;

const SettingPage = ({ navigation }: SettingPageProps) => {
  const queryClient = useQueryClient();
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [phoneToken, setPhoneToken] = useRecoilState(phoneTokenState);

  // api 호출 모두 완료 후 EncryptedStorage 데이터 삭제
  const onSuccessLogout = async () => {
    await EncryptedStorage.removeItem('accessToken');
    await EncryptedStorage.removeItem('refreshToken');
  };

  const { mutate: logout } = useLogout({
    onSuccess: onSuccessLogout,
  });

  const onPressMenu = (menu: MenuItem) => {
    if (!menu.value) {
      return;
    }
    navigation.navigate(menu.value);
  };

  const onPressLogout = async () => {
    await SharedDefaults.setTokenBridge(null);
    await SharedDefaults.updateDoItNowBridge();
    logEvent('SettingPage_logout');
    logout({ phoneToken });
    setLoggedInUser(null);
    setPhoneToken('');
    queryClient.clear();
  };

  if (!loggedInUser) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <View style={{ padding: 16 }}>
        <PlemText style={styles.title}>안녕하세요! {loggedInUser.nickname}님</PlemText>
        <PlemText style={styles.email}>{loggedInUser.email}</PlemText>
      </View>
      <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#CCCCCC'} />
      <ScrollView contentContainerStyle={styles.buttonList}>
        {SETTING_PAGE_MENUS.map((menu) => {
          return <MenuButton key={menu.value} item={menu} onPress={onPressMenu} />;
        })}
        <MenuButton key={'logout_menu'} item={{ title: '로그아웃', arrow: false }} onPress={onPressLogout} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  email: {
    marginTop: 5,
    fontSize: 14,
    color: '#888888',
  },
  title: {
    fontSize: 24,
  },
  buttonList: {
    paddingHorizontal: 15,
  },
});

export default SettingPage;
