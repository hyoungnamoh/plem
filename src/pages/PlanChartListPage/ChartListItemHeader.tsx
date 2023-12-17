import { Pressable, StyleSheet, View } from 'react-native';
import PlemText from '../../components/Atoms/PlemText';
import ArrowUpSvg from '../../assets/images/arrow_up_32x32.svg';
import ArrowDownSvg from '../../assets/images/arrow_down_32x32.svg';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { PlanChartListTabStackParamList } from '../../tabs/PlanChartListTab';
import { numToDayKorParser } from '../../helper/numToDayKorParser';
import { PlanChart, Repeats } from '../../../types/chart';
import { usePieChart } from '../../hooks/usePieChart';
import { PieChart } from 'react-native-gifted-charts';
import { SCREEN_WIDTH } from '../../constants/etc';

const ChartListItemHeader = ({ chart, isActive }: { chart: PlanChart; isActive: boolean }) => {
  const navigation = useNavigation<NavigationProp<PlanChartListTabStackParamList>>();
  const { pieChartData, initialAngle } = usePieChart({ chart, hideName: true });

  const repeatsSorting = (repeats: Repeats) => {
    const newRepeats = [...repeats];
    return newRepeats.sort((a, b) => a! - b!);
  };

  return (
    <View key={`header${chart.id}`} style={styles.header}>
      <Pressable style={styles.headerContent} onPress={() => navigation.navigate('AddChartPage', { chart: chart })}>
        <PieChart
          data={pieChartData}
          initialAngle={initialAngle}
          showText
          textColor={'#000'}
          labelsPosition={'outward'}
          textSize={14}
          font={'LeeSeoyun'}
          strokeColor={'black'}
          strokeWidth={2}
          radius={32}
        />
        <View style={styles.headerInfo}>
          <PlemText>{chart.name}</PlemText>
          <PlemText style={styles.repeats}>{numToDayKorParser(repeatsSorting(chart.repeats))}</PlemText>
          <PlemText style={styles.plans} numberOfLines={1}>
            {chart.plans.map((plan) => plan.name).join(' / ')}
          </PlemText>
        </View>
      </Pressable>
      {isActive ? <ArrowUpSvg style={{ alignSelf: 'center' }} /> : <ArrowDownSvg style={{ alignSelf: 'center' }} />}
    </View>
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
    width: SCREEN_WIDTH - 164, // 차트, 화살표 이미지 제외 공간
  },
  repeats: {
    fontSize: 16,
    marginTop: 4,
  },
  plans: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default ChartListItemHeader;
