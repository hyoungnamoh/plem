import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs, { Dayjs } from 'dayjs';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRecoilState } from 'recoil';
import { AddPlanPageProps } from 'pages/AddPlanPage';
import { AddPlan, AddPlanChart } from 'types/chart';
import { addPlanChartState } from 'states/addPlanChartState';
import { addPlanDefault, addPlanState } from 'states/addPlanState';

export const useAddPlan = ({ route, navigation }: AddPlanPageProps) => {
  const isModify = route.params?.planIndex !== undefined;
  const [chart, setChart] = useRecoilState(addPlanChartState);
  const [plan, setPlan] = useRecoilState(addPlanState);

  const [openStartTimePicker, setOpenStartTimePicker] = useState(false);
  const [openEndPicker, setOpenEndTimePicker] = useState(false);
  const [startHour, setStartHour] = useState(0);
  const [startMin, setStartMin] = useState(0);
  const [endHour, setEndHour] = useState(1);
  const [endMin, setEndMin] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    if (isModify) {
      const modifyPlan = chart.plans[route.params.planIndex];
      setPlan(modifyPlan);
      setName(modifyPlan.name);
      setStartHour(modifyPlan.startHour);
      setStartMin(modifyPlan.startMin);
      setEndHour(modifyPlan.endHour);
      setEndMin(modifyPlan.endMin);
    }

    return () => setPlan(addPlanDefault);
  }, []);

  const setStorageChartData = async (chartData: AddPlanChart) => {
    await AsyncStorage.setItem('chartData', JSON.stringify(chartData));
  };

  const isDuplicatedTime = () => {
    const duplicatePlan = chart.plans.find((p, pIndex) => {
      if (isModify && pIndex === route.params?.planIndex) {
        return;
      }
      const timeRange = { startHour: p.startHour, startMin: p.startMin, endHour: p.endHour, endMin: p.endMin };
      return duplicateTimeCheck({
        targetTime: { startHour: startHour, startMin: startMin, endHour: endHour, endMin: endMin },
        timeRange,
      });
    });

    return duplicatePlan;
  };

  const reverseTimeDuplicateCheck = ({
    startTime1,
    endTime1,
    startTime2,
    endTime2,
  }: {
    startTime1: Dayjs;
    endTime1: Dayjs;
    startTime2: Dayjs;
    endTime2: Dayjs;
  }) => {
    return (
      startTime1.isAfter(startTime2) ||
      (startTime1.isAfter(startTime1.startOf('date')) && startTime1.isBefore(endTime2)) ||
      endTime1.isAfter(startTime2) ||
      (startTime1.isSame(startTime2) && endTime1.isSame(endTime2))
    );
  };

  const duplicateTimeCheck = ({
    targetTime,
    timeRange,
  }: {
    targetTime: { startHour: number; startMin: number; endHour: number; endMin: number };
    timeRange: { startHour: number; startMin: number; endHour: number; endMin: number };
  }) => {
    const today = dayjs();
    const targetStart = dayjs(today).set('hour', targetTime.startHour).set('minute', targetTime.startMin);
    const targetEnd = dayjs(today).set('hour', targetTime.endHour).set('minute', targetTime.endMin);
    const rangeStart = dayjs(today).set('hour', timeRange.startHour).set('minute', timeRange.startMin);
    const rangeEnd = dayjs(today).set('hour', timeRange.endHour).set('minute', timeRange.endMin);

    // 저장되어 있는 계획의 시작시간이 종료 시간보다 느릴 경우 ex) 22:00-04:00
    if (rangeStart.isAfter(rangeEnd) && targetStart.isAfter(targetEnd)) {
      return (
        reverseTimeDuplicateCheck({
          startTime1: rangeStart,
          endTime1: rangeEnd,
          startTime2: targetStart,
          endTime2: targetEnd,
        }) ||
        reverseTimeDuplicateCheck({
          startTime1: targetStart,
          endTime1: targetEnd,
          startTime2: rangeStart,
          endTime2: rangeEnd,
        })
      );
    } else if (targetStart.isAfter(targetEnd)) {
      return reverseTimeDuplicateCheck({
        startTime1: rangeStart,
        endTime1: rangeEnd,
        startTime2: targetStart,
        endTime2: targetEnd,
      });
    } else if (rangeStart.isAfter(rangeEnd)) {
      return reverseTimeDuplicateCheck({
        startTime1: targetStart,
        endTime1: targetEnd,
        startTime2: rangeStart,
        endTime2: rangeEnd,
      });
    }

    return (
      (targetStart.isAfter(rangeStart) && targetStart.isBefore(rangeEnd)) ||
      (targetEnd.isAfter(rangeStart) && targetEnd.isBefore(rangeEnd)) ||
      (rangeStart.isAfter(targetStart) && rangeStart.isBefore(targetEnd)) ||
      (rangeEnd.isAfter(targetStart) && rangeEnd.isBefore(targetEnd)) ||
      (targetStart.isSame(rangeStart) && targetEnd.isSame(rangeEnd))
    );
  };

  const isSameTime = (times: { startHour: number; startMin: number; endHour: number; endMin: number }) => {
    const start = dayjs().set('hour', times.startHour).set('minute', times.startMin).startOf('minute');
    const end = dayjs().set('hour', times.endHour).set('minute', times.endMin).startOf('minute');

    return start.isSame(end);
  };

  const onPressAddPlan = () => {
    if (isSameTime({ startHour, startMin, endHour, endMin })) {
      return Alert.alert('시작시간과 종료시간이 같을 수 없습니다.');
    }
    if (isDuplicatedTime()) {
      return Alert.alert('시간이 중복되는 계획이 있어요.');
    }

    const copiedChart = cloneDeep(chart);

    const newPlan: AddPlan = {
      ...plan,
      name,
      startHour,
      startMin,
      endHour,
      endMin,
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
    return plans.sort(
      (a, b) =>
        dayjs().set('hour', a.startHour).set('minute', a.startMin).unix() -
        dayjs().set('hour', b.startHour).set('minute', b.startMin).unix()
    );
  };

  const onPressSetNotification = () => {
    navigation.navigate('PlanNotiSettingPage');
  };

  const onPressStartConfirm = (date: Date) => {
    const newStart = dayjs().set('hour', date.getHours()).set('minute', date.getMinutes());
    const end = dayjs().set('hour', endHour).set('minute', endMin);

    // if (end.diff(newStart) < 600000) {
    //   const newEnd = newStart.add(10, 'minute');
    //   setEndHour(newEnd.get('hour'));
    //   setEndMin(newEnd.get('minute'));
    //   // setEndTime({ hour: newEnd.get('hour'), minute: newEnd.get('minute') });
    // }
    setStartHour(newStart.get('hour'));
    setStartMin(newStart.get('minute'));
    // setStartTime({ hour: newStart.get('hour'), minute: newStart.get('minute') });
    setOpenStartTimePicker(false);
  };

  const onPressEndConfirm = (date: Date) => {
    setEndHour(date.getHours());
    setEndMin(date.getMinutes());
    // setEndTime({ hour: date.getHours(), minute: date.getMinutes() });
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

  const getTimePickerValue = ({ hour, min }: { hour: number; min: number }) => {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(min);
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
    startHour,
    startMin,
    endHour,
    endMin,
    onPressSetEnd,
    onPressSetNotification,
    plan,
    onPressAddPlan,
    openStartTimePicker,
    onPressStartConfirm,
    onPressStartCancel,
    openEndPicker,
    onPressEndConfirm,
    onPressEndCancel,
    getTimePickerValue,
  };
};
