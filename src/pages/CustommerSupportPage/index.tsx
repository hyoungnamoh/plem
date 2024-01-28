import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import Header from 'components/Header';
import { MAIN_COLOR } from 'constants/colors';
import { CUSTOMMER_SUPPORT_PAGE_MENUES, MenuItem } from 'constants/menus';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import MenuButton from 'components/MenuButton';
import VersionCheck from 'react-native-version-check';
import { useEffect, useState } from 'react';

type CustommerSupportPageProps = NativeStackScreenProps<SettingTabStackParamList, 'CustommerSupportPage'>;

const CustommerSupportPage = ({ navigation }: CustommerSupportPageProps) => {
  const [version, setVersion] = useState<{ current: string; latest: string | undefined } | null>(null);
  useEffect(() => {
    getVersion();
  }, []);

  const getVersion = async () => {
    const currentVersion = VersionCheck.getCurrentVersion();
    const latestVersion = await VersionCheck.getLatestVersion();
    setVersion({
      current: currentVersion,
      latest: latestVersion,
    });
  };

  const onPressMenu = (menu: MenuItem) => {
    if (menu.value === 'VersionInfoPage') {
      return;
    }
    navigation.navigate(menu.value);
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <Header title="고객 지원" />
      <View style={styles.content}>
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          {CUSTOMMER_SUPPORT_PAGE_MENUES.map((menu) => {
            if (menu.value === 'VersionInfoPage') {
              menu.label = `현재 ${version?.current} / 최신 ${version?.latest || version?.current}`;
              menu.labelProps = { style: { color: '#888888', fontSize: 14 } };
              menu.arrow = false;
            }
            return <MenuButton key={menu.value} item={menu} onPress={onPressMenu} />;
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
