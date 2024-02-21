import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { PlanChart } from 'types/chart';
import { useState } from 'react';
import AddChartButton from './AddChartButton';
import { BOTTOM_TAB_HEIGHT } from 'components/BottomTabBar/constants';
import ChartListHeader from './ChartListItemHeader';
import ChartListItemContent from './ChartListItemContent';
import UnderlineSvg from 'assets/images/underline.svg';

const ChartList = ({ list, onPressAddChart }: { list: PlanChart[]; onPressAddChart: () => void }) => {
  const [activeSections, setAciveSections] = useState<number[]>([]);

  const renderAccordionHeader = (chart: PlanChart, _: number, isActive: boolean) => {
    return <ChartListHeader chart={chart} isActive={isActive} />;
  };

  const renderAccordionContent = (chart: PlanChart, _: number) => {
    return <ChartListItemContent chart={chart} />;
  };

  const updateSections = (sectionIndexs: number[]) => {
    setAciveSections(sectionIndexs);
  };

  const renderAccordionFooter = (content: PlanChart, index: number) => {
    // return <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#CCCCCC'} />;
    return list.length - 1 === index ? (
      <View key={`footer${content.id}`} style={styles.footerWrap}>
        <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#CCCCCC'} />
        <AddChartButton onPress={onPressAddChart} />
      </View>
    ) : (
      <UnderlineSvg preserveAspectRatio="none" width={'100%'} stroke={'#CCCCCC'} />
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
      containerStyle={{ marginBottom: BOTTOM_TAB_HEIGHT + 50 }}
      // keyExtractor={(item) => `chart${item.id}`} 라이브러리에서 제공하는 renderFooter의 두번째 인자 index에 기본값은 index인데 keyExtractor로 키 만들면 index대신 key가 들어감
    />
  );
};

const styles = StyleSheet.create({
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
  footerWrap: {
    alignItems: 'center',
    paddingBottom: 30,
  },
});

export default ChartList;
