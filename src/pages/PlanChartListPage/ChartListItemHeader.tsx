import { StyleSheet, View } from 'react-native';
import PlemText from 'components/Atoms/PlemText';
import ArrowUpSvg from 'assets/images/arrow_up_32x32.svg';
import ArrowDownSvg from 'assets/images/arrow_down_32x32.svg';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { PlanChartListTabStackParamList } from 'tabs/PlanChartListTab';
import { PlanChart, Repeats } from 'types/chart';
import { usePieChart } from 'hooks/usePieChart';
import { SCREEN_WIDTH } from 'constants/etc';
import PlemButton from 'components/Atoms/PlemButton';
import { repeatOptionList } from 'pages/RepeatSettingPage';
import { PieChart } from 'components/PieChart';
import { CHART_RADIUS, STROKE_WIDTH } from './constants';

const ChartListItemHeader = ({ chart, isActive }: { chart: PlanChart; isActive: boolean }) => {
  const navigation = useNavigation<NavigationProp<PlanChartListTabStackParamList>>();
  const { pieChartData, initialAngle } = usePieChart({ chart, hideName: true });

  const getRepeatOptions = (repeats: Repeats) => {
    if (repeats.includes(null)) {
      return '안 함';
    }
    if (repeats.includes(7) && chart.repeatDates) {
      return '날짜 지정';
    }

    const sortedRepeatList = repeatOptionList
      .filter((option) => repeats.includes(option.value))
      .sort((a, b) => a.order! - b.order!);

    const isWeekend =
      sortedRepeatList.length === 2 && sortedRepeatList.every((option) => option.value === 0 || option.value === 6);
    const isWeekdays =
      sortedRepeatList.length === 5 && sortedRepeatList.every((option) => option.value !== 0 && option.value !== 6);

    if (isWeekend) {
      return '주말';
    }

    if (isWeekdays) {
      return '주중';
    }

    if (sortedRepeatList.length === 7) {
      return '매일';
    }

    return sortedRepeatList.map((option) => option.day).join(', ');
  };

  return (
    <View key={`header${chart.id}`} style={styles.header}>
      <PlemButton style={styles.headerContent} onPress={() => navigation.navigate('AddChartPage', { chart: chart })}>
        <View style={{ width: CHART_RADIUS * 2 + STROKE_WIDTH, height: CHART_RADIUS * 2 + STROKE_WIDTH }}>
          <PieChart
            data={pieChartData}
            initialAngle={initialAngle}
            textColor={'#000'}
            labelsPosition={'outward'}
            textSize={14}
            font={'AaGongCatPen'}
            strokeColor={'black'}
            strokeWidth={STROKE_WIDTH}
            radius={CHART_RADIUS}
          />
        </View>
        <View style={styles.headerInfo}>
          <PlemText>{chart.name}</PlemText>
          <PlemText style={styles.repeats}>{getRepeatOptions(chart.repeats)}</PlemText>
          <PlemText style={styles.plans} numberOfLines={1}>
            {isActive ? '' : chart.plans.map((plan) => plan.name).join(' / ')}
          </PlemText>
        </View>
      </PlemButton>
      {isActive ? <ArrowUpSvg style={{ alignSelf: 'center' }} /> : <ArrowDownSvg style={{ alignSelf: 'center' }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 8,
    paddingHorizontal: 16,
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
