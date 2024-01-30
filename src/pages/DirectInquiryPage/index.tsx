import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, StyleSheet, View } from 'react-native';
import Header from 'components/Header';
import { MAIN_COLOR } from 'constants/colors';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import { useState } from 'react';
import { DropdownWithLabel } from 'components/DropdownWithLabel';
import LabelInput from 'components/LabelInput';
import PlemText from 'components/Atoms/PlemText';
import BlackButton from 'components/BlackButton';
import { removeWhitespace } from 'helper/removeWhitespace';

type DirectInquiryPageProps = NativeStackScreenProps<SettingTabStackParamList, 'DirectInquiryPage'>;

const inquiryTypeList = [
  { label: '계정 관련', value: 'account' },
  { label: '기능 관련', value: 'function' },
  { label: '버그 신고', value: 'bug' },
  { label: '건의 사항', value: 'proposal' },
  { label: '기타', value: 'etc' },
];

const inquiryInput = require('../../assets/images/white_board_345x210.png');

const DirectInquiryPage = ({}: DirectInquiryPageProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [inquiryType, setInquiryType] = useState(inquiryTypeList[0]);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');

  const onChangeType = () => {};

  const onPressDrondown = () => {
    setOpenDropdown(!openDropdown);
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <Header
        title="공지사항"
        buttonName="SNS 문의"
        buttonProps={{
          onPress: () => {
            console.log('hi');
          },
        }}
      />
      <View style={styles.content}>
        <DropdownWithLabel
          label="문의 유형"
          open={openDropdown}
          list={inquiryTypeList}
          onChange={onChangeType}
          onPressRow={onPressDrondown}
          value={inquiryType}
        />
        <View style={{ marginTop: 32 }}>
          <LabelInput
            label="제목"
            value={title}
            onChangeText={setTitle}
            placeholder={'제목을 입력해 주세요. (20자 이내)'}
          />
          <Image source={inquiryInput} style={{ marginTop: 12 }} />
        </View>
        <View style={{ marginTop: 32 }}>
          <LabelInput
            label="답변받을 이메일 주소"
            value={title}
            onChangeText={(value) => setEmail(removeWhitespace(value))}
            placeholder={'제목을 입력해 주세요. (20자 이내)'}
          />
        </View>
        <PlemText style={{ color: '#888888', marginTop: 12 }}>
          {'* support@plem.com으로 부터\n메일을 수신 가능한 상태로 설정해 주세요.'}
        </PlemText>
        <BlackButton style={{ marginTop: 32 }}>
          <PlemText style={{ color: '#fff' }}>문의하기</PlemText>
        </BlackButton>
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
    marginTop: 20,
  },
});

export default DirectInquiryPage;
