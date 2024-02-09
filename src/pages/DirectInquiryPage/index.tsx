import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Dimensions, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Header from 'components/Header';
import { MAIN_COLOR } from 'constants/colors';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import { useRef, useState } from 'react';
import { DropdownWithLabel } from 'components/DropdownWithLabel';
import LabelInput from 'components/LabelInput';
import PlemText from 'components/Atoms/PlemText';
import BlackButton from 'components/BlackButton';
import { removeWhitespace } from 'helper/removeWhitespace';
import { DropdownItem } from 'components/Dropdown';
import WhiteBoard from 'assets/images/white_board.svg';
import PlemTextInput from 'components/Atoms/PlemTextInput';
import { useAddInquiry } from 'hooks/mutations/useAddInquiry';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';
import { validator } from 'helper/validator';

type DirectInquiryPageProps = NativeStackScreenProps<SettingTabStackParamList, 'DirectInquiryPage'>;

const inquiryTypeList: DropdownItem<InquiryType>[] = [
  { label: '계정 관련', value: 'account' },
  { label: '기능 관련', value: 'function' },
  { label: '버그 신고', value: 'bug' },
  { label: '건의 사항', value: 'proposal' },
  { label: '기타', value: 'etc' },
];

export type InquiryType = 'account' | 'function' | 'bug' | 'proposal' | 'etc';

const DirectInquiryPage = ({ navigation }: DirectInquiryPageProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [inquiryType, setInquiryType] = useState(inquiryTypeList[0]);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const contentRef = useRef<TextInput>(null);
  const { mutate: addInquiry } = useAddInquiry({
    onSuccess: () => {
      Alert.alert('문의가 성공적으로 등록되었습니다. 빠른 시일 내에 답변드리겠습니다. 감사합니다.');
      navigation.goBack();
    },
  });

  const onChangeType = (item: DropdownItem<InquiryType>) => {
    setInquiryType(item);
    setOpenDropdown(false);
  };

  const onPressDrondown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleInquiry = async () => {
    if (!title) {
      Alert.alert('제목을 입력해 주세요.');
      return;
    }
    if (!content) {
      Alert.alert('문의 내용을 입력해 주세요.');
      return;
    }
    if (!email) {
      Alert.alert('이메일을 입력해 주세요.');
      return;
    }
    if (isInvalidEmail) {
      Alert.alert('이메일 형식을 확인해 주세요.');
      return;
    }

    addInquiry({
      type: inquiryType.value,
      title,
      content,
      email,
    });
  };

  const handleEmailChange = (value: string) => {
    const newEmail = removeWhitespace(value);
    setEmail(newEmail);
    if (!value) {
      setIsInvalidEmail(false);
      return;
    }
    setIsInvalidEmail(!validator({ value: newEmail, type: 'email' }));
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setOpenDropdown(false);
      }}>
      <View>
        <CustomScrollView contentContainerStyle={{ backgroundColor: MAIN_COLOR, paddingBottom: 20 }}>
          <Header
            title="1:1 문의"
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
                maxLength={20}
              />
            </View>
            <Pressable onPress={() => contentRef.current?.focus()} style={{ marginTop: 12 }}>
              <WhiteBoard preserveAspectRatio="none" width={Dimensions.get('window').width - 32} />
              <View style={{ position: 'absolute', padding: 12 }}>
                <PlemTextInput
                  ref={contentRef}
                  value={content}
                  onChangeText={setContent}
                  placeholder="문의 내용을 입력해 주세요."
                  multiline={true}
                />
              </View>
            </Pressable>
            <View style={{ marginTop: 32 }}>
              <LabelInput
                label="답변받을 이메일 주소"
                value={email}
                onChangeText={handleEmailChange}
                placeholder={'제목을 입력해 주세요. (20자 이내)'}
                keyboardType="email-address"
                isInvalidValue={isInvalidEmail}
              />
              {isInvalidEmail && <PlemText style={styles.errorText}>이메일 형식이 올바르지 않습니다.</PlemText>}
            </View>
            <PlemText style={{ color: '#888888', marginTop: 12 }}>
              {'* plemsupport@gmail.com으로 부터\n메일을 수신 가능한 상태로 설정해 주세요.'}
            </PlemText>
            <BlackButton style={{ marginTop: 32 }} onPress={handleInquiry}>
              <PlemText style={{ color: '#fff' }}>문의하기</PlemText>
            </BlackButton>
          </View>
        </CustomScrollView>
      </View>
    </TouchableWithoutFeedback>
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
  errorText: {
    fontSize: 14,
    color: '#E40C0C',
    marginTop: 5,
  },
});

export default DirectInquiryPage;
