import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import { MAIN_COLOR } from 'constants/colors';
import { MenuItem, SETTING_PAGE_MENUS } from 'constants/menus';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import MenuButton from 'components/MenuButton';
import { useRecoilState } from 'recoil';
import { loggedInUserState } from 'states/loggedInUserState';
import { useLogout } from 'hooks/mutations/useLogout';
import EncryptedStorage from 'react-native-encrypted-storage';
import { bottomSafeAreaState } from 'states/bottomSafeAreaState';
import { useFocusEffect } from '@react-navigation/native';
import { SCREEN_WIDTH } from 'constants/etc';
import { phoneTokenState } from 'states/phoneTokenState';

const underlineGrayImage = require('../../assets/images/underline_gray.png');

type SettingPageProps = NativeStackScreenProps<SettingTabStackParamList, 'SettingPage'>;

const SettingPage = ({ navigation }: SettingPageProps) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [bottomSafeArea, setBottomSafeArea] = useRecoilState(bottomSafeAreaState);
  const [phoneToken, setPhoneToken] = useRecoilState(phoneTokenState);

  const onSuccessLogout = async () => {
    setLoggedInUser(null);
    setPhoneToken('');
    await EncryptedStorage.removeItem('accessToken');
  };

  useFocusEffect(() => {
    if (bottomSafeArea === MAIN_COLOR) {
      return;
    }
    setBottomSafeArea(MAIN_COLOR);
  });

  const { mutate: logout } = useLogout({
    onSuccess: onSuccessLogout,
  });

  const onPressMenu = (menu: MenuItem) => {
    if (!menu.value) {
      return;
    }
    navigation.navigate(menu.value);
  };

  const onPressLogout = () => {
    logout({ phoneToken });
  };

  if (!loggedInUser) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <View style={{ padding: 20 }}>
        <PlemText style={styles.title}>안녕하세요! {loggedInUser.nickname}</PlemText>
        <PlemText style={styles.email}>{loggedInUser.email}</PlemText>
      </View>
      <Image source={underlineGrayImage} style={styles.headerLine} />
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
  headerLine: {
    width: SCREEN_WIDTH,
  },
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
