import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs, { Dayjs } from 'dayjs';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { AddPlanPageProps } from '.';
import { AddPlan, AddPlanChart, PlanTime } from '../../../types/chart';
import { addPlanChartState } from '../../states/addPlanChartState';
import { addPlanDefault, addPlanState } from '../../states/addPlanState';

export const useAddPlan = ({ route, navigation }: AddPlanPageProps) => {
  const isModify = route.params?.planIndex !== undefined;
  const [chart, setChart] = useRecoilState(addPlanChartState);
  const [plan, setPlan] = useRecoilState(addPlanState);

  const [openStartPicker, setOpenStartTimePicker] = useState(false);
  const [openEndPicker, setOpenEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState<PlanTime>({ hour: 0, minute: 0 });
  const [endTime, setEndTime] = useState<PlanTime>({ hour: 1, minute: 0 });
  const [name, setName] = useState('');

  useEffect(() => {
    if (isModify) {
      const modifyPlan = chart.plans[route.params.planIndex];
      setName(modifyPlan.name);
      setStartTime(modifyPlan.startTime);
      setEndTime(modifyPlan.endTime);

      // setPlan(chart.plans[route.params.planIndex]);
    }

    return () => setPlan(addPlanDefault);
  }, []);

  const setStorageChartData = async (chartData: AddPlanChart) => {
    await AsyncStorage.setItem('chart_data', JSON.stringify(chartData));
  };

  const isInvalidTime = () => {
    const start = dayjs().set('hour', startTime.hour).set('minute', startTime.minute);
    const end = dayjs().set('hour', endTime.hour).set('minute', endTime.minute);
    return start.isAfter(end) || start.isSame(end);
  };

  const isDuplicatedTime = () => {
    const today = dayjs();
    const duplicatePlan = chart.plans.find((p, pIndex) => {
      if (isModify && pIndex === route.params?.planIndex) {
        return;
      }
      const planStart = today.set('hour', p.startTime.hour).set('minute', p.startTime.minute);
      const planEnd = today.set('hour', p.endTime.hour).set('minute', p.endTime.minute);
      const checkValueStart = today.set('hour', startTime.hour).set('minute', startTime.minute);
      const checkValueEnd = today.set('hour', endTime.hour).set('minute', endTime.minute);
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
    // value.isSame(start) || value.isSame(end);
  };

  const onPressAddPlan = () => {
    if (isInvalidTime()) {
      return alert('종료시간이 시작시간과\n같거나 빠를 수 없습니다.');
    }
    if (isDuplicatedTime()) {
      return alert('시간이 중복되는 계획이 있어요.');
    }

    const copiedChart = cloneDeep(chart);
    const startHour = startTime.hour;
    const startMin = startTime.minute;
    const endHour = endTime.hour;
    const endMin = endTime.minute;
    const newPlan = {
      ...plan,
      name,
      startTime: { hour: startHour, minute: startMin },
      endTime: { hour: endHour, minute: endMin },
    };

    if (isModify) {
      copiedChart.plans[route.params?.planIndex] = newPlan;
      copiedChart.plans = plansSortingByTime(copiedChart.plans);
      setChart(copiedChart);
      setStorageChartData(copiedChart);
    } else {
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
    const newStart = dayjs(date);
    const end = dayjs().set('hour', endTime.hour).set('minute', endTime.minute);
    if (end.diff(newStart) < 600000) {
      const newEnd = newStart.add(10, 'minute');
      setEndTime({ hour: newEnd.get('hour'), minute: newEnd.get('minute') });
    }
    setStartTime({ hour: newStart.get('hour'), minute: newStart.get('minute') });
    setOpenStartTimePicker(false);
  };

  const onPressEndConfirm = (date: Date) => {
    setEndTime({ hour: date.getHours(), minute: date.getMinutes() });
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

  const getStartPickerValue = () => {
    const date = new Date();
    date.setHours(startTime.hour);
    date.setMinutes(startTime.minute);
    return date;
  };

  const getEndPickerValue = () => {
    const date = new Date();
    date.setHours(endTime.hour);
    date.setMinutes(endTime.minute);
    return date;
  };

  const onChangeName = (value: string) => {
    setName(value);
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
    getStartPickerValue,
    getEndPickerValue,
  };
};
