import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Image from 'react-native-scalable-image';
import Header from '../../components/Header';
import { MAIN_COLOR } from '../../constants/colors';
import { SettingTabStackParamList } from '../../tabs/SettingTab';
import PlemText from '../../components/Atoms/PlemText';
import Accordion from 'react-native-collapsible/Accordion';
import { useState } from 'react';
import ArrowDownSvg from '../../assets/images/arrow_down_32x32.svg';
import ArrowUpSvg from '../../assets/images/arrow_up_32x32.svg';
import { useGetNoticeList } from '../../hooks/queries/useGetNoticeList';
import { Notice } from '../../../types/notice';

type NoticeListPageProps = NativeStackScreenProps<SettingTabStackParamList, 'NoticeListPage'>;

const lineGray = require('../../assets/images/line_gray.png');

const NoticeListPage = ({ navigation }: NoticeListPageProps) => {
  const [activeNotice, setAciveNotice] = useState<number[]>([]);
  const { data: noticeList } = useGetNoticeList();

  const renderAccordionHeader = (notice: Notice, _: number, isActive: boolean) => {
    return (
      <View style={styles.accordionHeader}>
        <View>
          <PlemText>{notice.title}</PlemText>
          <PlemText style={styles.date}>2023.01.27</PlemText>
        </View>
        {isActive ? <ArrowUpSvg /> : <ArrowDownSvg />}
      </View>
    );
  };

  const renderAccordionContent = (notice: Notice) => {
    return (
      <View style={styles.content}>
        {notice.contents.map((content) => {
          console.log(`http://192.168.219.101:3030/${content}`);
          return (
            <Image
              source={{ uri: `http://192.168.219.101:3030/${content}` }}
              width={Dimensions.get('screen').width - 40}
            />
          );
        })}
        {/* <PlemText>{notice.content}</PlemText> */}
      </View>
    );
  };

  const renderAccordionFooter = () => {
    return <Image source={lineGray} style={{ width: Dimensions.get('window').width }} />;
  };

  const updateSections = (sectionIndexs: number[]) => {
    setAciveNotice(sectionIndexs);
  };

  return (
    <View style={{ flex: 1, backgroundColor: MAIN_COLOR }}>
      <Header title="공지사항" />
      <Accordion
        sections={noticeList?.data || []}
        activeSections={activeNotice}
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
