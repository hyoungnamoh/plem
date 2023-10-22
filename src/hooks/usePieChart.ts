import { useCallback, useEffect, useState } from 'react';
import { itemType } from 'react-native-gifted-charts/src/LineChart/types';
import { useFocusEffect } from '@react-navigation/native';
import { DAY_TO_MS, MIN_TO_MS } from '../constants/times';
import dayjs from 'dayjs';
import { AddPlanChart, PlanChart } from '../../types/chart';

export const usePieChart = ({
  chart,
  renderCurrentTime,
  hideName,
}: {
  chart: PlanChart | AddPlanChart | null;
  renderCurrentTime?: boolean;
  hideName?: boolean;
}) => {
  const [pieChartData, setChartData] = useState<itemType[]>([]);
  const [currentTimeDegree, setCurrentTimeDegree] = useState(
    renderCurrentTime ? (dayjs().diff(dayjs().startOf('date')) / DAY_TO_MS) * 360 : 0
  );
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
    if (!renderCurrentTime) {
      return;
    }
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
    const chartData = [];
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
            chartData.push(element);
          } else {
            // 빈 시간이 있을 경우
            chartData.push(element);
            chartData.push({
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
          chartData.push(element);
          chartData.push({
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
          chartData.push(element);
        } else {
          // 빈 시간이 있을 경우
          chartData.push(element);
          chartData.push({
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
          chartData.push(element);
        } else {
          chartData.push(element);
          chartData.push({
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

    return chartData.map((plan) => {
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
        text: hideName ? '' : plan.name,
        shiftTextX: plan.name.length * -3,
        color: 'transparent',
        labelPosition: 'outward',
      };
    });
  };

  return {
    pieChartData,
    initialAngle,
    currentTimeDegree,
  };
};
