import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import PlemText from '../../components/Atoms/PlemText';
import { MAIN_COLOR } from '../../constants/color';
import { MenuItem, SETTING_PAGE_MENUS } from '../../constants/menu';
import { SettingTabStackParamList } from '../../tabs/SettingTab';
import MenuButton from '../../components/MenuButton';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../states/loggedInUserState';
import { useLogout } from '../../hooks/mutaions/useLogout';
import EncryptedStorage from 'react-native-encrypted-storage';

const underlineGrayImage = require('../../assets/images/underline_gray.png');

type SettingPageProps = NativeStackScreenProps<SettingTabStackParamList, 'SettingPage'>;

const SettingPage = ({ navigation }: SettingPageProps) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const onSuccessLogout = async () => {
    setLoggedInUser(null);
    await EncryptedStorage.removeItem('accessToken');
  };

  const { mutate: logout } = useLogout({
    onSuccess: onSuccessLogout,
    onError: (e) => {
      console.info('useLogout Error: ', e);
      Alert.alert('알 수 없는 에러가 발생햇습니다 ;ㅂ;');
    },
  });

  const onPressMenu = (menu: MenuItem) => {
    if (!menu.value) {
      return;
    }
    navigation.navigate(menu.value);
  };

  const onPressLogout = () => {
    logout();
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
    width: Dimensions.get('screen').width,
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
