import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import { MAIN_COLOR } from '../../constants/color';
import { ACCOUNT_SETTING_PAGE_MENUES, MenuItem, SETTING_PAGE_MENUS } from '../../constants/menu';
import { SettingTabStackParamList } from '../../tabs/SettingTab';
import MenuButton from '../../components/MenuButton';

type AccountSettingPageProps = NativeStackScreenProps<SettingTabStackParamList, 'AccountSettingPage'>;

const AccountSettingPage = ({ navigation }: AccountSettingPageProps) => {
  const [email, setEmail] = useState('zzzsh789@naver.com');

  const onPressMenu = (menu: MenuItem) => {
    navigation.navigate(menu.value);
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <Header title="계정 설정" />
      <View style={styles.content}>
        <LabelInput value={email} onChangeText={setEmail} label="연동된 이메일" />
        <ScrollView>
          {ACCOUNT_SETTING_PAGE_MENUES.map((menu) => {
            if (menu.value === 'ModifyNickNamePage') menu.label = '오도도링';
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

export default AccountSettingPage;
