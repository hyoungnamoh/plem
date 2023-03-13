import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import PlemText from '../../components/Atoms/PlemText';
import { MAIN_COLOR } from '../../constants/color';
import { MenuItem, SETTING_PAGE_MENUS } from '../../constants/menu';
import { SettingTabStackParamList } from '../../tabs/SettingTab';
import MenuButton from '../../components/MenuButton';

const underlineGrayImage = require('../../assets/images/underline_gray.png');

type SettingPageProps = NativeStackScreenProps<SettingTabStackParamList, 'SettingPage'>;

const SettingPage = ({ navigation }: SettingPageProps) => {
  const onPressMenu = (menu: MenuItem) => {
    navigation.navigate(menu.value);
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <View style={{ padding: 20 }}>
        <PlemText style={styles.title}>안녕하세요! 배우구님</PlemText>
        <PlemText style={styles.email}>plem@plem.com</PlemText>
      </View>
      <Image source={underlineGrayImage} style={styles.headerLine} />
      <ScrollView contentContainerStyle={styles.buttonList}>
        {SETTING_PAGE_MENUS.map((menu) => {
          return <MenuButton item={menu} onPress={onPressMenu} />;
        })}
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
