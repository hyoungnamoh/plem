import { View, Dimensions, TouchableOpacity, Image, Pressable, StyleSheet } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { PlanChart } from '../../../types/chart';
import PlemText from '../../components/Atoms/PlemText';
import { numToDayKorParser } from '../../helper/numToDayKorParser';
import { useState } from 'react';
import { BOTTOM_TAB_HEIGHT } from '../../components/BottomTabBar';
import dayjs from 'dayjs';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PlanChartListTabStackParamList } from '../../tabs/PlanChartListTab';
import { LoggedInTabParamList } from '../../../AppInner';

const arrowDownImage = require('../../assets/images/arrow_down.png');
const arrowUpImage = require('../../assets/images/arrow_up.png');
const lineGray = require('../../assets/images/line_gray.png');

const ChartList = ({ list }: { list: PlanChart[] }) => {
  const navigation = useNavigation<NavigationProp<PlanChartListTabStackParamList>>();
  const [activeSections, setAciveSections] = useState<number[]>([]);

  const renderAccordionHeader = (content: PlanChart, index: number, isActive: boolean) => {
    return (
      <View key={`header${content.id}`} style={styles.header}>
        <Pressable style={styles.headerContent} onPress={() => navigation.navigate('AddChartPage', { chart: content })}>
          <View style={styles.test} />
          <View style={styles.headerInfo}>
            <PlemText>{content.name}</PlemText>
            <PlemText style={styles.repeats}>{numToDayKorParser(content.repeats)}</PlemText>
            <PlemText style={styles.plans} numberOfLines={1}>
              {content.plans.map((plan) => plan.name).join(' / ')}
            </PlemText>
          </View>
        </Pressable>
        <Image source={isActive ? arrowUpImage : arrowDownImage} style={{ alignSelf: 'center' }} />
      </View>
    );
  };

  const renderAccordionContent = (content: PlanChart, index: number, isActive: boolean) => {
    return (
      <View key={`content${content.id}`} style={styles.content}>
        <View style={styles.test} />
        <View>
          {content.plans.map((plan) => {
            const startHour = String(plan.startHour).padStart(2, '0');
            const startMin = String(plan.startMin).padStart(2, '0');
            const endHour = String(plan.endHour).padStart(2, '0');
            const endMin = String(plan.endMin).padStart(2, '0');

            return (
              <View key={`plan${content.id}${plan.id}`} style={styles.contentRowContainer}>
                <View style={styles.contentRow}>
                  <PlemText style={styles.planInfo} numberOfLines={1}>
                    {plan.name}
                  </PlemText>
                  <PlemText style={styles.planInfo}>{`${startHour}:${startMin} - ${endHour}:${endMin}`}</PlemText>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const updateSections = (sectionIndexs: number[]) => {
    setAciveSections(sectionIndexs);
  };

  const renderAccordionFooter = (content: PlanChart, index: number, isActive: boolean, sections: PlanChart[]) => {
    return (
      <View key={`footer${content.id}`}>
        <Image source={lineGray} style={{ width: Dimensions.get('window').width }} />
        {list.length - 1 === index ? (
          <Pressable style={styles.writeButton} onPress={() => navigation.navigate('AddChartPage')}>
            <PlemText>계획표 작성</PlemText>
          </Pressable>
        ) : null}
      </View>
    );
  };

  return (
    <Accordion
      sections={list}
      activeSections={activeSections}
      renderContent={renderAccordionContent}
      renderHeader={renderAccordionHeader}
      renderFooter={renderAccordionFooter}
      onChange={updateSections}
      duration={500}
      expandMultiple={true}
      renderAsFlatList={true}
      touchableComponent={TouchableOpacity}
      containerStyle={{ marginBottom: BOTTOM_TAB_HEIGHT }}
      keyExtractor={(item) => `chart${item.id}`}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    width: '90%',
  },
  test: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    height: 64,
    width: 64,
  },
  headerInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  repeats: {
    fontSize: 16,
    marginTop: 4,
  },
  plans: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    width: Dimensions.get('screen').width - 164, // 차트, 화살표 이미지 제외 공간
  },
  content: {
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  contentRowContainer: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  contentRow: {
    width: '100%',
    flexDirection: 'row',
    height: 20,
  },
  planInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    width: '45%',
  },
  writeButton: {
    width: 126,
    height: 36,
    borderRadius: 18,
    borderColor: '#000',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    marginBottom: 100,
  },
});

export default ChartList;
