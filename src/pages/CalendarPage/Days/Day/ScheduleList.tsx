import { StyleSheet, View } from 'react-native';
import { categoryListState } from 'states/categoryListState';
import { useRecoilValue } from 'recoil';
import { CalendarSchedule, ScheduleMap } from 'api/schedules/getScheduleListApi';
import PlemText from 'components/Atoms/PlemText';
import { SCREEN_WIDTH } from 'constants/etc';
import { memo } from 'react';
import PaletteSvg from 'components/PaletteSvg/PaletteSvg';

const ScheduleList = ({
  noRepeatScheduleMap,
  yearlyRepeatScheduleMap,
  monthlyRepeatScheduleMap,
  twoWeeklyRepeatScheduleMap,
  weeklyRepeatScheduleMap,
  dailyRepeatScheduleMap,
  year,
  month,
  date,
}: {
  noRepeatScheduleMap?: CalendarSchedule['noRepeatSchedules'];
  yearlyRepeatScheduleMap?: ScheduleMap;
  monthlyRepeatScheduleMap?: ScheduleMap;
  twoWeeklyRepeatScheduleMap?: ScheduleMap;
  weeklyRepeatScheduleMap?: ScheduleMap;
  dailyRepeatScheduleMap?: ScheduleMap;
  year: number;
  month: number;
  date: number;
}) => {
  const categoryList = useRecoilValue(categoryListState);
  // const targetDate = useMemo(
  //   () => dayjs().set('year', year).set('month', month).set('date', date),
  //   [year, month, date]
  // );

  const getAllScheduleList = () => {
    const noRepeatScheduleList = getNoRepeatScheduleList();
    const yearly = getYealyRepeatScheduleList();
    const monthly = getMonthlyRepeatScheduleList();
    const twoWeekly = getTwoWeeklyRepeatScheduleList();
    const weekly = getWeeklyRepeatScheduleList();
    const daily = getDailyRepeatScheduleList();

    return yearly.concat(monthly, weekly, twoWeekly, daily, noRepeatScheduleList);
  };

  const getNoRepeatScheduleList = () => {
    return noRepeatScheduleMap && noRepeatScheduleMap[year] && noRepeatScheduleMap[year][month]
      ? noRepeatScheduleMap[year][month][date]
      : [];
  };

  const getYealyRepeatScheduleList = () => {
    return yearlyRepeatScheduleMap && yearlyRepeatScheduleMap[year] && yearlyRepeatScheduleMap[year][month]
      ? yearlyRepeatScheduleMap[year][month][date]
      : [];
  };

  const getMonthlyRepeatScheduleList = () => {
    return monthlyRepeatScheduleMap && monthlyRepeatScheduleMap[year] && monthlyRepeatScheduleMap[year][month]
      ? monthlyRepeatScheduleMap[year][month][date]
      : [];
  };

  const getTwoWeeklyRepeatScheduleList = () => {
    return twoWeeklyRepeatScheduleMap && twoWeeklyRepeatScheduleMap[year] && twoWeeklyRepeatScheduleMap[year][month]
      ? twoWeeklyRepeatScheduleMap[year][month][date]
      : [];
  };

  const getWeeklyRepeatScheduleList = () => {
    return weeklyRepeatScheduleMap && weeklyRepeatScheduleMap[year] && weeklyRepeatScheduleMap[year][month]
      ? weeklyRepeatScheduleMap[year][month][date]
      : [];
  };

  const getDailyRepeatScheduleList = () => {
    return dailyRepeatScheduleMap && dailyRepeatScheduleMap[year] && dailyRepeatScheduleMap[year][month]
      ? dailyRepeatScheduleMap[year][month][date]
      : [];
  };

  const allScheduleList = getAllScheduleList();

  return (
    <View style={{ marginTop: 2 }}>
      {allScheduleList.map((schedule) => {
        return (
          <View key={schedule.id} style={styles.scheduleRow}>
            <PaletteSvg
              size="small"
              color={
                categoryList.find((category) => category.value === schedule.category)?.color || categoryList[0].color
              }
            />
            <PlemText style={styles.scheduleName}>{schedule.name}</PlemText>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  currentDateBackground: {
    width: 24,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCell: {
    width: Math.floor(SCREEN_WIDTH / 7),
    alignItems: 'center',
    minHeight: 64,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 2,
  },
  scheduleSticker: {
    width: 6,
    height: 6,
  },
  scheduleName: {
    fontSize: 12,
    marginLeft: 2,
  },
  svg: {
    position: 'absolute',
  },
});

export default memo(ScheduleList);
