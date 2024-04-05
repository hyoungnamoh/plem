import { useMemo } from 'react';
import { useGetScheduleList } from './queries/useGetScheduleList';

export const useScheduleList = ({ year, month, date }: { year: number; month: number; date: number }) => {
  const { data: calendarSchedule } = useGetScheduleList();
  const today = useMemo(() => new Date(year, month, date, 0, 0, 0, 0), [year, month, date]);
  const {
    yearlyRepeatSchedules,
    monthlyRepeatSchedules,
    twoWeeklyRepeatSchedules,
    weeklyRepeatSchedules,
    dailyRepeatSchedules,
  } = calendarSchedule?.data.repeatSchedules || {
    yearlyRepeatSchedules: [],
    monthlyRepeatSchedules: [],
    twoWeeklyRepeatSchedules: [],
    weeklyRepeatSchedules: [],
    dailyRepeatSchedules: [],
  };

  const makeDateRange = (start: Date, end: Date) => {
    const dateRangeArray = [];
    for (let i = start.getDate(); i <= end.getDate(); i++) {
      dateRangeArray.push(i);
    }

    return dateRangeArray;
  };

  const repeatScheduleList = useMemo(
    () =>
      yearlyRepeatSchedules
        .concat(monthlyRepeatSchedules, twoWeeklyRepeatSchedules, weeklyRepeatSchedules, dailyRepeatSchedules)
        .filter((schedule) => {
          const scheduleStartDate = new Date(schedule.startDate);
          const scheduleEndDate = new Date(schedule.endDate);
          const scheduleStartDateMonth = scheduleStartDate.getMonth();
          const scheduleStartDateOfMonth = scheduleStartDate.getDate();
          const todayMonth = today.getMonth();
          const todayDateOfMonth = today.getDate();
          const startOfToday = new Date(today);
          const startOfScheduleStartDate = new Date(scheduleStartDate);
          const endOfScheduleEndDate = new Date(scheduleEndDate);
          startOfToday.setHours(0, 0, 0, 0);
          startOfScheduleStartDate.setHours(0, 0, 0, 0);
          endOfScheduleEndDate.setHours(23, 59, 59, 999);

          if (startOfScheduleStartDate.getTime() > startOfToday.getTime()) {
            return;
          }
          const dateDiff = (startOfToday.getTime() - startOfScheduleStartDate.getTime()) / 1000 / 24 / 60 / 60;
          const dateRange = (endOfScheduleEndDate.getTime() - startOfScheduleStartDate.getTime()) / 1000 / 24 / 60 / 60;
          const dateRangeArray = makeDateRange(startOfScheduleStartDate, endOfScheduleEndDate);
          const isSameDay = today.getDay() === scheduleStartDate.getDay();
          const isSameMonth = todayMonth === scheduleStartDateMonth;
          const inDateArray = dateRangeArray.includes(todayDateOfMonth);

          const everyCondition = schedule.repeats === 'every';
          const weekCondition =
            schedule.repeats === 'week' && (isSameDay || dateDiff < dateRange || dateDiff % 7 < dateRange);
          const twoWeeksCondition =
            schedule.repeats === 'twoWeeks' && (dateDiff < dateRange || dateDiff % 14 < dateRange);
          const monthCondition = schedule.repeats === 'month' && inDateArray;
          const yearCondition = schedule.repeats === 'year' && isSameMonth && inDateArray;

          if (everyCondition || weekCondition || twoWeeksCondition || monthCondition || yearCondition) {
            if (schedule.repeatEndDate) {
              const startOfRepeatEndDate = new Date(schedule.repeatEndDate);
              startOfRepeatEndDate.setHours(0, 0, 0, 0);
              const isBeforeOrSame = startOfToday.getTime() <= startOfRepeatEndDate.getTime();

              return isBeforeOrSame;
            }
            return true;
          }
        }),
    [
      yearlyRepeatSchedules,
      monthlyRepeatSchedules,
      twoWeeklyRepeatSchedules,
      weeklyRepeatSchedules,
      dailyRepeatSchedules,
      today,
      year,
      month,
      date,
    ]
  );

  const noRepeatScheduleList = useMemo(
    () =>
      calendarSchedule?.data.noRepeatSchedules?.filter((schedule) => {
        const scheduleStartDate = new Date(schedule.startDate);
        const scheduleStartDateYear = scheduleStartDate.getFullYear();
        const scheduleStartDateMonth = scheduleStartDate.getMonth();
        const scheduleStartDateOfMonth = scheduleStartDate.getDate();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDateOfMonth = today.getDate();

        return (
          scheduleStartDateYear === todayYear &&
          scheduleStartDateMonth === todayMonth &&
          scheduleStartDateOfMonth === todayDateOfMonth
        );
      }) || [],
    [calendarSchedule?.data.noRepeatSchedules, year, month, date]
  );

  const allScheduleList = useMemo(
    () => repeatScheduleList.concat(noRepeatScheduleList),
    [noRepeatScheduleList, repeatScheduleList, year, month, date]
  );

  return {
    allScheduleList,
  };
};
