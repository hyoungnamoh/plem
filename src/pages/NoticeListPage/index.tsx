import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Header from 'components/Header';
import { MAIN_COLOR } from 'constants/colors';
import { SettingTabStackParamList } from 'tabs/SettingTab';
import PlemText from 'components/Atoms/PlemText';
import Accordion from 'react-native-collapsible/Accordion';
import { useState } from 'react';
import ArrowDownSvg from 'assets/images/arrow_down_32x32.svg';
import ArrowUpSvg from 'assets/images/arrow_up_32x32.svg';
import { useGetNoticeList } from 'hooks/queries/useGetNoticeList';
import { Notice } from 'types/notice';
import Image from '@hyoungnamoh/react-native-scalable-image';
import { baseUrl } from 'api';
import UnderlineSvg from 'assets/images/underline.svg';
import { SCREEN_WIDTH } from 'constants/etc';
import dayjs from 'dayjs';

type NoticeListPageProps = NativeStackScreenProps<SettingTabStackParamList, 'NoticeListPage'>;

const NoticeListPage = ({ navigation }: NoticeListPageProps) => {
  const [activeNotice, setAciveNotice] = useState<number[]>([]);
  const { data: noticeList } = useGetNoticeList();

  const renderAccordionHeader = (notice: Notice, _: number, isActive: boolean) => {
    return (
      <View style={styles.accordionHeader}>
        <View>
          <PlemText>{notice.title}</PlemText>
          <PlemText style={styles.date}>{dayjs(notice.createdAt).format('YYYY.MM.DD')}</PlemText>
        </View>
        {isActive ? <ArrowUpSvg /> : <ArrowDownSvg />}
      </View>
    );
  };

  const renderAccordionContent = (notice: Notice) => {
    return (
      <View style={styles.content}>
        {notice.contents.map((content) => {
          return <Image source={{ uri: `${baseUrl}/${content}` }} width={SCREEN_WIDTH - 40} />;
        })}
      </View>
    );
  };

  const renderAccordionFooter = () => {
    return <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#CCCCCC'} />;
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
