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

  const repeatScheduleList = useMemo(
    () =>
      yearlyRepeatSchedules
        .concat(monthlyRepeatSchedules, twoWeeklyRepeatSchedules, weeklyRepeatSchedules, dailyRepeatSchedules)
        .filter((schedule) => {
          const scheduleStartDate = new Date(schedule.startDate);
          const scheduleStartDateMonth = scheduleStartDate.getMonth();
          const scheduleStartDateOfMonth = scheduleStartDate.getDate();
          const todayMonth = today.getMonth();
          const todayDateOfMonth = today.getDate();
          const startOfToday = new Date(today);
          const startOfScheduleStartDate = new Date(scheduleStartDate);
          startOfToday.setHours(0, 0, 0, 0);
          startOfScheduleStartDate.setHours(0, 0, 0, 0);

          if (startOfScheduleStartDate.getTime() > startOfToday.getTime()) {
            return;
          }
          const dateDiff = (startOfToday.getTime() - startOfScheduleStartDate.getTime()) / 1000 / 24 / 60 / 60;
          const isSameDay = today.getDay() === scheduleStartDate.getDay();
          const isSameMonth = todayMonth === scheduleStartDateMonth;
          const isSameDateOfMonth = todayDateOfMonth === scheduleStartDateOfMonth;

          const everyCondition = schedule.repeats === 'every';
          const weekCondition = schedule.repeats === 'week' && isSameDay;
          const twoWeeksCondition = schedule.repeats === 'twoWeeks' && (dateDiff === 0 || dateDiff % 14 === 0);
          const monthCondition = schedule.repeats === 'month' && isSameDateOfMonth;
          const yearCondition = schedule.repeats === 'year' && isSameMonth && isSameDateOfMonth;

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
