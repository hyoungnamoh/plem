import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { MAIN_COLOR } from '../../constants/color';
import { CUSTOMMER_SUPPORT_PAGE_MENUES, MenuItem } from '../../constants/menu';
import { SettingTabStackParamList } from '../../tabs/SettingTab';
import MenuButton from '../../components/MenuButton';
import PlemText from '../../components/Atoms/PlemText';
import Accordion from 'react-native-collapsible/Accordion';
import { useState } from 'react';

type NoticeListPageProps = NativeStackScreenProps<SettingTabStackParamList, 'NoticeListPage'>;
type Section = {
  title: string;
  content: string;
};

const arrowDownImage = require('../../assets/images/arrow_down.png');
const arroUpImage = require('../../assets/images/arrow_up.png');
const lineGray = require('../../assets/images/line_gray.png');

const NOTICE_LIST = [
  {
    title: 'title1',
    content:
      '그들에게 얼마나 얼마나 같이, 뿐이다.\n청춘이 고동을 청춘을 실현에 예가 착목한는 기쁘며,\n고행을 것이다. 앞이 부패를 피에\n인간의 있을 이상 노래하며 그리하였는가?\n\n같이 날카로우나 봄바람을 옷을 인류의 뜨거운지라,\n얼마나 가는 공자는 것이다.\n이상이 현저하게 위하여,\n부패를 끓는 이것을 못하다 그리하였는가?',
  },
  {
    title: 'title2',
    content:
      '그들에게 얼마나 얼마나 같이, 뿐이다.\n청춘이 고동을 청춘을 실현에 예가 착목한는 기쁘며,\n고행을 것이다. 앞이 부패를 피에\n인간의 있을 이상 노래하며 그리하였는가?\n\n같이 날카로우나 봄바람을 옷을 인류의 뜨거운지라,\n얼마나 가는 공자는 것이다.\n이상이 현저하게 위하여,\n부패를 끓는 이것을 못하다 그리하였는가?',
  },
];

const NoticeListPage = ({ navigation }: NoticeListPageProps) => {
  const [activeSections, setAciveSections] = useState<number[]>([]);

  const renderAccordionHeader = (section: Section, _: number, isActive: boolean) => {
    return (
      <View style={styles.accordionHeader}>
        <View>
          <PlemText>{section.title}</PlemText>
          <PlemText style={styles.date}>2023.01.27</PlemText>
        </View>
        <Image source={isActive ? arroUpImage : arrowDownImage} />
      </View>
    );
  };

  const renderAccordionContent = (section: Section) => {
    return (
      <View style={styles.content}>
        <PlemText>{section.content}</PlemText>
      </View>
    );
  };

  const renderAccordionFooter = () => {
    return <Image source={lineGray} style={{ width: Dimensions.get('window').width }} />;
  };

  const updateSections = (sectionIndexs: number[]) => {
    setAciveSections(sectionIndexs);
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <Header title="공지사항" />
      <Accordion
        sections={NOTICE_LIST}
        activeSections={activeSections}
        renderHeader={renderAccordionHeader}
        renderContent={renderAccordionContent}
        renderFooter={renderAccordionFooter}
        onChange={updateSections}
        duration={500}
        expandMultiple={true}
        renderAsFlatList={true}
        touchableComponent={TouchableOpacity}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  date: {
    color: '#888888',
    fontSize: 14,
    marginTop: 8,
  },
});

export default NoticeListPage;
