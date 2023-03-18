import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import Header from '../../components/Header';
import { MAIN_COLOR } from '../../constants/color';
import { CUSTOMMER_SUPPORT_PAGE_MENUES, MenuItem } from '../../constants/menu';
import { SettingTabStackParamList } from '../../tabs/SettingTab';
import MenuButton from '../../components/MenuButton';

type CustommerSupportPageProps = NativeStackScreenProps<SettingTabStackParamList, 'CustommerSupportPage'>;

const CustommerSupportPage = ({ navigation }: CustommerSupportPageProps) => {
  const onPressMenu = (menu: MenuItem) => {
    navigation.navigate(menu.value);
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <Header title="고객 지원" />
      <View style={styles.content}>
        <ScrollView>
          {CUSTOMMER_SUPPORT_PAGE_MENUES.map((menu) => {
            if (menu.value === 'VersionInfoPage') {
              menu.label = '현재 1.1.8 / 최신 1.2.1';
              menu.labelProps = { style: { color: '#888888', fontSize: 14 } };
              menu.arrow = false;
            }
            return <MenuButton item={menu} onPress={onPressMenu} />;
          })}
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
});

export default CustommerSupportPage;
