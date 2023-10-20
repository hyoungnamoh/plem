import { View, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { PlanChart } from '../../types/chart';
import PlemText from './Atoms/PlemText';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { itemType } from 'react-native-gifted-charts/src/LineChart/types';
import { useFocusEffect } from '@react-navigation/native';
import { DAY_TO_MS, MIN_TO_MS } from '../constants/times';

const screenWidth = Dimensions.get('screen').width;
const screenHight = Dimensions.get('screen').height;
const chartRadius = Dimensions.get('screen').width / 2.65;

const MainSVGFrame = ({ chart }: { chart: PlanChart | null }) => {
  const [chartData, setChartData] = useState<itemType[]>([]);
  const [currentTimeDegree, setCurrentTimeDegree] = useState((dayjs().diff(dayjs().startOf('date')) / DAY_TO_MS) * 360);
  const initialAngle =
    chart && chart.plans.length > 0
      ? (dayjs()
          .set('hour', chart.plans[0].startHour)
          .set('minute', chart.plans[0].startMin)
          .set('second', 0)
          .set('millisecond', 0)
          .diff(dayjs().startOf('date')) /
          DAY_TO_MS) *
        Math.PI *
        2
      : 0;

  useFocusEffect(() => {
    const focusedTimeDegree = (dayjs().diff(dayjs().startOf('date')) / DAY_TO_MS) * 360;
    const degreeOfMinute = (MIN_TO_MS / DAY_TO_MS) * 360;
    if (focusedTimeDegree - currentTimeDegree < degreeOfMinute) {
      return;
    }
    setCurrentTimeDegree(focusedTimeDegree);
  });

  useEffect(() => {
    if (!chart) {
      return;
    }
    setChartData(getPieChartData());
  }, [chart]);

  const getPieChartData = () => {
    if (!chart) {
      return [];
    }
    const pieChartData = [];
    for (let index = 0; index < chart.plans.length; index++) {
      const element = chart.plans[index];

      const endTime = dayjs()
        .set('hour', element.endHour)
        .set('minute', element.endMin)
        .set('second', 0)
        .set('millisecond', 0);

      // 첫번째 계획
      if (index === 0) {
        // 계획이 하나만 있는 게 아니라면
        if (chart?.plans.length !== 1) {
          const nextPlan = chart.plans[index + 1];
          const nextStartTime = dayjs()
            .set('hour', nextPlan.startHour)
            .set('minute', nextPlan.startMin)
            .set('second', 0)
            .set('millisecond', 0);

          // 빈 시간이 없을 경우
          if (endTime.isSame(nextStartTime)) {
            pieChartData.push(element);
          } else {
            // 빈 시간이 있을 경우
            pieChartData.push(element);
            pieChartData.push({
              id: Math.random(),
              name: '',
              startHour: element.endHour,
              startMin: element.endMin,
              endHour: nextPlan.startHour,
              endMin: nextPlan.startMin,
            });
          }
          // 계획이 하나뿐인 경우
        } else {
          pieChartData.push(element);
          pieChartData.push({
            id: Math.random(),
            name: '',
            startHour: element.endHour,
            startMin: element.endMin,
            endHour: element.startHour,
            endMin: element.startMin,
          });
        }
        // 마지막 계획
      } else if (index === chart.plans.length - 1) {
        const firstPlan = chart.plans[0];
        const firstStartTime = dayjs()
          .set('hour', firstPlan.startHour)
          .set('minute', firstPlan.startMin)
          .set('second', 0)
          .set('millisecond', 0);

        // 빈 시간이 없을 경우
        if (endTime.isSame(firstStartTime)) {
          pieChartData.push(element);
        } else {
          // 빈 시간이 있을 경우
          pieChartData.push(element);
          pieChartData.push({
            id: Math.random(),
            name: '',
            startHour: element.endHour,
            startMin: element.endMin,
            endHour: firstPlan.startHour,
            endMin: firstPlan.startMin,
          });
        }
      } else {
        const nextPlan = chart.plans[index + 1];
        const nextStartTime = dayjs()
          .set('hour', nextPlan.startHour)
          .set('minute', nextPlan.startMin)
          .set('second', 0)
          .set('millisecond', 0);
        if (endTime.isSame(nextStartTime)) {
          pieChartData.push(element);
        } else {
          pieChartData.push(element);
          pieChartData.push({
            id: Math.random(),
            name: '',
            startHour: element.endHour,
            startMin: element.endMin,
            endHour: nextPlan.startHour,
            endMin: nextPlan.startMin,
          });
        }
      }
    }

    return pieChartData.map((plan) => {
      const startTime = dayjs()
        .set('hour', plan.startHour)
        .set('minute', plan.startMin)
        .set('second', 0)
        .set('millisecond', 0);
      const endTime = dayjs()
        .set('hour', plan.endHour)
        .set('minute', plan.endMin)
        .set('second', 0)
        .set('millisecond', 0);
      return {
        value: startTime.isAfter(endTime) ? endTime.diff(startTime) + DAY_TO_MS : endTime.diff(startTime),
        text: plan.name,
        shiftTextX: plan.name.length * -3,
        color: 'transparent',
        labelPosition: 'outward',
      };
    });
  };

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
              data={chartData}
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

export default MainSVGFrame;
