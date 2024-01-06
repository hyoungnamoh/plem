import { StyleSheet, View } from 'react-native';
import { categoryListState } from '../../../../states/categoryListState';
import { useRecoilValue } from 'recoil';
import { CalendarSchedule, ScheduleMap } from '../../../../api/schedules/getScheduleListApi';
import PlemText from '../../../../components/Atoms/PlemText';
import { SCREEN_WIDTH } from '../../../../constants/etc';
import { memo, useMemo } from 'react';
import dayjs from 'dayjs';
import PaletteFF6550Svg from '../../../../assets/images/palette_ff6550_8x8.svg';
import PaletteFFC700Svg from '../../../../assets/images/palette_ffc700_8x8.svg';
import Palette22DA81Svg from '../../../../assets/images/palette_22da81_8x8.svg';
import Palette4659FFSvg from '../../../../assets/images/palette_4659ff_8x8.svg';

export const PaletteMap = {
  palette_ff6550_8x8: <PaletteFF6550Svg />,
  palette_ffc700_8x8: <PaletteFFC700Svg />,
  palette_22da81_8x8: <Palette22DA81Svg />,
  palette_4569ff_8x8: <Palette4659FFSvg />,
} as const;

const ScheduleList = ({
  noRepeatScheduleMap,
  monthlyRepeatScheduleList,
  twoWeeklyRepeatScheduleMap,
  weeklyRepeatScheduleMap,
  dailyRepeatScheduleList,
  year,
  month,
  date,
}: {
  noRepeatScheduleMap?: CalendarSchedule['noRepeatSchedules'];
  monthlyRepeatScheduleList?: CalendarSchedule['repeatSchedules']['monthlyRepeatScheduleMap'];
  twoWeeklyRepeatScheduleMap?: ScheduleMap;
  weeklyRepeatScheduleMap?: ScheduleMap;
  dailyRepeatScheduleList?: CalendarSchedule['repeatSchedules']['dailyRepeatSchedules'];
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
    const noRepeatScheduleList = getScheduleList();
    const monthly = monthlyRepeatScheduleList && monthlyRepeatScheduleList[date] ? monthlyRepeatScheduleList[date] : [];
    const twoWeekly = getTwoWeeklyRepeatScheduleList();
    const weekly = getWeeklyRepeatScheduleList();
    const daily = dailyRepeatScheduleList ? dailyRepeatScheduleList : [];

    return monthly.concat(weekly, twoWeekly, daily, noRepeatScheduleList);
  };

  const getScheduleList = () => {
    return noRepeatScheduleMap && noRepeatScheduleMap[year] && noRepeatScheduleMap[year][month]
      ? noRepeatScheduleMap[year][month][date]
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

  const allScheduleList = getAllScheduleList();

  return (
    <View style={{ marginTop: 2 }}>
      {allScheduleList.map((schedule) => {
        return (
          <View key={schedule.id} style={styles.scheduleRow}>
            {
              PaletteMap[
                categoryList.find((category) => category.value === schedule.category)?.image || categoryList[0].image
              ]
            }
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
    fontSize: 10,
    marginLeft: 2,
  },
  svg: {
    position: 'absolute',
  },
});

export default memo(ScheduleList);
