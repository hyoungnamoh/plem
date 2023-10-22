import { View, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { PlanChart } from '../../../types/chart';
import PlemText from './../Atoms/PlemText';
import dayjs from 'dayjs';
import { usePieChart } from '../../hooks/usePieChart';

const screenWidth = Dimensions.get('screen').width;
const screenHight = Dimensions.get('screen').height;
const chartRadius = Dimensions.get('screen').width / 2.65;

const MainChartTable = ({ chart }: { chart: PlanChart | null }) => {
  const { pieChartData, initialAngle, currentTimeDegree } = usePieChart({ chart, renderCurrentTime: true });
  if (!chart) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View>
        <View style={styles.container}>
          <View style={styles.labelCell}>
            <PlemText>Date</PlemText>
          </View>
          <View style={styles.valueCell}>
            <PlemText>{dayjs().format('YYYY.MM.DD')}</PlemText>
          </View>
        </View>
        <View style={[styles.container, { borderTopWidth: 0, borderBottomWidth: 0 }]}>
          <View style={styles.labelCell}>
            <PlemText>Title</PlemText>
          </View>
          <View style={styles.valueCell}>
            <PlemText>{chart.name}</PlemText>
          </View>
        </View>
        <View style={styles.chartBox}>
          <View style={{ marginLeft: '8%', marginTop: '10%' }}>
            <PlemText style={[styles.baseTimes, { top: '-8%', left: '42%' }]}>24</PlemText>
            <PlemText style={[styles.baseTimes, { top: '43%', left: '92%' }]}>6</PlemText>
            <PlemText style={[styles.baseTimes, { top: '93%', left: '42%' }]}>12</PlemText>
            <PlemText style={[styles.baseTimes, { top: '43%', left: '-7%' }]}>18</PlemText>
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
              radius={chartRadius}
            />
          </View>
          <View
            style={[
              styles.currentTimeBar,
              {
                transform: [
                  { translateY: chartRadius / 2 },
                  { rotate: `${currentTimeDegree}deg` },
                  { translateY: -(chartRadius / 2) },
                ],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  container: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#000',
  },
  labelCell: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (screenWidth - 30) * 0.19,
    height: screenHight * 0.5 * 0.077,
    borderRightWidth: 2,
    borderColor: '#000',
  },
  valueCell: {
    justifyContent: 'center',
    width: 285,
    height: screenHight * 0.5 * 0.077,
    paddingHorizontal: 10,
  },
  baseTimes: {
    position: 'absolute',
    color: '#AAAAAA',
  },
  currentTimeBar: {
    backgroundColor: '#FFE600',
    width: 2,
    height: chartRadius * 0.75,
    position: 'absolute',
    marginTop: '10%',
    top: 0,
  },
  chartBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default MainChartTable;
