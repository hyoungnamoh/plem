import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import Header from 'components/Header';
import { MAIN_COLOR } from 'constants/colors';
import { CUSTOMMER_SUPPORT_PAGE_MENUES, MenuItem } from 'constants/menus';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import MenuButton from 'components/MenuButton';
import VersionCheck from 'react-native-version-check';

type CustommerSupportPageProps = NativeStackScreenProps<SettingTabStackParamList, 'CustommerSupportPage'>;

const AppVersionCheck = async () => {
  console.log('첫진입 시작');
  //기기에 설치되 있는 버전
  let CurrentVersion = VersionCheck.getCurrentVersion();
  //앱의 최신버전
  let LatestVersion = await VersionCheck.getLatestVersion();

  //기기에 설치되있는 버전과 앱에 올려져있는 최신버전을 비교
  VersionCheck.needUpdate({
    currentVersion: CurrentVersion,
    latestVersion: LatestVersion,
  }).then((res: any) => {
    if (res.isNeeded) {
    }
  });
};

const CustommerSupportPage = ({ navigation }: CustommerSupportPageProps) => {
  AppVersionCheck();
  // VersionCheck.getCountry().then((country) => console.log(country)); // KR
  // console.log(VersionCheck.getCurrentBuildNumber()); // 10
  // console.log(VersionCheck.getCurrentVersion()); // 0.1.1

  // VersionCheck.getLatestVersion().then((latestVersion) => {
  //   console.log(latestVersion); // 0.1.2
  // });

  // VersionCheck.getLatestVersion({
  //   provider: 'appStore', // for iOS
  // }).then((latestVersion) => {
  //   console.log(latestVersion); // 0.1.2
  // });

  const onPressMenu = (menu: MenuItem) => {
    navigation.navigate(menu.value);
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <Header title="고객 지원" />
      <View style={styles.content}>
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          {CUSTOMMER_SUPPORT_PAGE_MENUES.map((menu) => {
            if (menu.value === 'VersionInfoPage') {
              menu.label = '현재 1.1.8 / 최신 1.2.1';
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
