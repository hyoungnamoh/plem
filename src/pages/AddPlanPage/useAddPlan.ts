import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs, { Dayjs } from 'dayjs';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { AddPlanPageProps } from '.';
import { AddPlan, AddPlanChart } from '../../../types/chart';
import { addPlanChartState } from '../../states/addPlanChartState';
import { addPlanDefault, addPlanState } from '../../states/addPlanState';

export const useAddPlan = ({ route, navigation }: AddPlanPageProps) => {
  const isModify = route.params?.planIndex !== undefined;
  const [chart, setChart] = useRecoilState(addPlanChartState);
  const [plan, setPlan] = useRecoilState(addPlanState);

  const [openStartPicker, setOpenStartTimePicker] = useState(false);
  const [openEndPicker, setOpenEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs>(dayjs('2023-01-08 00:00'));
  const [endTime, setEndTime] = useState<Dayjs>(dayjs('2023-01-08 01:00'));
  const [name, setName] = useState('');

  useEffect(() => {
    if (isModify) {
      setPlan(chart.plans[route.params.planIndex]);
    }

    return () => setPlan(addPlanDefault);
  }, []);

  const setStorageChartData = async (chartData: AddPlanChart) => {
    await AsyncStorage.setItem('chart_data', JSON.stringify(chartData));
  };

  const isInvalidTime = () => {
    return startTime.isAfter(endTime) || startTime.isSame(endTime);
  };

  const isDuplicatedTime = () => {
    const today = dayjs();
    const duplicatePlan = chart.plans.find((p) => {
      const planStart = today.set('hour', p.startTime.hour).set('minute', p.startTime.minute);
      const planEnd = today.set('hour', p.endTime.hour).set('minute', p.endTime.minute);
      const checkValueStart = today.set('hour', startTime.get('hour')).set('minute', startTime.get('minute'));
      const checkValueEnd = today.set('hour', endTime.get('hour')).set('minute', endTime.get('minute'));
      return (
        duplicateTimeCheck(checkValueStart, planStart, planEnd) ||
        duplicateTimeCheck(checkValueEnd, planStart, planEnd) ||
        duplicateTimeCheck(planStart, checkValueStart, checkValueEnd) ||
        duplicateTimeCheck(planEnd, checkValueStart, checkValueEnd)
      );
    });

    return duplicatePlan;
  };

  const duplicateTimeCheck = (value: Dayjs, start: Dayjs, end: Dayjs) => {
    return value.isAfter(start) && value.isBefore(end);
  };

  const onPressAddPlan = () => {
    if (isInvalidTime()) {
      return alert('종료시간이 시작시간과\n같거나 빠를 수 없습니다.');
    }
    if (isDuplicatedTime()) {
      return alert('시간이 중복되는 계획이 있어요.');
    }

    const copiedChart = cloneDeep(chart);

    if (isModify) {
      copiedChart.plans[route.params?.planIndex] = plan;
      setChart(copiedChart);
      setStorageChartData(copiedChart);
    } else {
      const startHour = startTime.get('hour');
      const startMin = startTime.get('minute');
      const endHour = endTime.get('hour');
      const endMin = endTime.get('minute');

      const newPlan = {
        ...plan,
        name,
        startTime: { hour: startHour, minute: startMin },
        endTime: { hour: endHour, minute: endMin },
      };

      setPlan(newPlan);
      setChart({ ...copiedChart, plans: plansSortingByTime([...copiedChart.plans, newPlan]) });
      setStorageChartData({ ...copiedChart, plans: plansSortingByTime([...copiedChart.plans, newPlan]) });
    }
    navigation.goBack();
  };

  const plansSortingByTime = (plans: AddPlan[]) => {
    return plans.sort((a, b) => {
      const aStartTime = `${a.startTime.hour}:${a.startTime.minute}`;
      const bStartTime = `${b.startTime.hour}:${b.startTime.minute}`;
      return aStartTime.localeCompare(bStartTime);
    });
  };

  const onPressSetNotification = () => {
    navigation.navigate('PlanNotiSettingPage');
  };

  const onPressStartConfirm = (date: Date) => {
    const newStartTime = dayjs(date);
    if (endTime.diff(newStartTime) < 600000) {
      setEndTime(newStartTime.add(10, 'minute'));
    }
    setStartTime(newStartTime);
    setOpenStartTimePicker(false);
  };

  const onPressEndConfirm = (date: Date) => {
    setEndTime(dayjs(date));
    setOpenEndTimePicker(false);
  };

  const onPressStartCancel = () => {
    setOpenStartTimePicker(false);
  };

  const onPressEndCancel = () => {
    setOpenEndTimePicker(false);
  };

  const onPressSetStart = () => {
    setOpenStartTimePicker(true);
  };

  const onPressSetEnd = () => {
    setOpenEndTimePicker(true);
  };

  const onChangeName = (value: string) => {
    setName(value);
  };

  const getMinEndTime = () => {
    return startTime.add(10, 'minute').toDate();
  };

  const onPressDelete = () => {
    if (!isModify) {
      return;
    }
    const copiedChart = cloneDeep(chart);
    copiedChart.plans.splice(route.params?.planIndex, 1);
    setChart(copiedChart);
    setStorageChartData(copiedChart);

    navigation.goBack();
  };

  return {
    onPressDelete,
    isModify,
    name,
    onChangeName,
    onPressSetStart,
    startTime,
    onPressSetEnd,
    endTime,
    onPressSetNotification,
    plan,
    onPressAddPlan,
    openStartPicker,
    onPressStartConfirm,
    onPressStartCancel,
    openEndPicker,
    onPressEndConfirm,
    onPressEndCancel,
  };
};
